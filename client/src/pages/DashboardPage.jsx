import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteApplication,
  getApplications,
} from "../services/applicationService";

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
  });
}

function getStatusClass(status) {
  switch (status) {
    case "APPLIED":
      return "status-badge status-applied";
    case "INTERVIEW":
      return "status-badge status-interview";
    case "OFFER":
      return "status-badge status-offer";
    case "REJECTED":
      return "status-badge status-rejected";
    default:
      return "status-badge";
  }
}

function sortApplications(applications, sortOption) {
  const sorted = [...applications];

  switch (sortOption) {
    case "DATE_DESC":
      sorted.sort((a, b) => {
        const aTime = a.dateApplied ? new Date(a.dateApplied).getTime() : 0;
        const bTime = b.dateApplied ? new Date(b.dateApplied).getTime() : 0;
        return bTime - aTime;
      });
      break;
    case "DATE_ASC":
      sorted.sort((a, b) => {
        const aTime = a.dateApplied ? new Date(a.dateApplied).getTime() : 0;
        const bTime = b.dateApplied ? new Date(b.dateApplied).getTime() : 0;
        return aTime - bTime;
      });
      break;
    case "COMPANY_ASC":
      sorted.sort((a, b) => a.company.localeCompare(b.company));
      break;
    case "COMPANY_DESC":
      sorted.sort((a, b) => b.company.localeCompare(a.company));
      break;
    case "STATUS_ASC":
      sorted.sort((a, b) => a.status.localeCompare(b.status));
      break;
    default:
      break;
  }

  return sorted;
}

export default function DashboardPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOption, setSortOption] = useState("DATE_DESC");

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");
      const data = await getApplications();
      setApplications(data.applications || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete application.");
    }
  }

  const filteredApplications = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = applications.filter((application) => {
      const matchesSearch =
        !normalizedSearch ||
        application.company?.toLowerCase().includes(normalizedSearch) ||
        application.role?.toLowerCase().includes(normalizedSearch) ||
        application.source?.toLowerCase().includes(normalizedSearch) ||
        application.location?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return sortApplications(filtered, sortOption);
  }, [applications, searchTerm, statusFilter, sortOption]);

  if (loading) {
    return <p>Loading applications...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="page-container dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Job Application Tracker</h1>
          <p className="dashboard-subtitle">
            Track your applications, statuses, and job search progress.
          </p>
        </div>

        <Link to="/new" className="primary-link-button">
          + Add Application
        </Link>
      </div>

      <div className="dashboard-controls-card">
        <div className="dashboard-controls">
          <div className="control-group search-group">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              type="text"
              placeholder="Search by company, role, source, or location"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="control-group filter-group">
            <label htmlFor="statusFilter">Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="control-group filter-group">
            <label htmlFor="sortOption">Sort By</label>
            <select
              id="sortOption"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
            >
              <option value="DATE_DESC">Newest Applied Date</option>
              <option value="DATE_ASC">Oldest Applied Date</option>
              <option value="COMPANY_ASC">Company A–Z</option>
              <option value="COMPANY_DESC">Company Z–A</option>
              <option value="STATUS_ASC">Status A–Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="summary-row">
        <div className="summary-card">
          <p className="summary-label">Total Applications</p>
          <p className="summary-value">{applications.length}</p>
        </div>

        <div className="summary-card">
          <p className="summary-label">Filtered Results</p>
          <p className="summary-value">{filteredApplications.length}</p>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="empty-state">
          <h2>No matching applications</h2>
          <p>Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="table-card">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Source</th>
                <th>Salary</th>
                <th>Location</th>
                <th>Date Applied</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td className="company-cell">
                    <Link
                      to={`/applications/${application.id}`}
                      className="company-link"
                    >
                      {application.company}
                    </Link>
                  </td>
                  <td>{application.role}</td>
                  <td>
                    <span className={getStatusClass(application.status)}>
                      {application.status}
                    </span>
                  </td>
                  <td>{application.source || "—"}</td>
                  <td>{application.salary || "—"}</td>
                  <td>{application.location || "—"}</td>
                  <td>{formatDate(application.dateApplied)}</td>
                  <td>
                    {application.link ? (
                      <a
                        href={application.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Job
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/edit/${application.id}`}
                        className="table-action-link"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDelete(application.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}