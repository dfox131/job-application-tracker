import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteApplication,
  getApplications,
} from "../services/applicationService";

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString();
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

export default function DashboardPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

    return applications.filter((application) => {
      const matchesSearch =
        !normalizedSearch ||
        application.company.toLowerCase().includes(normalizedSearch) ||
        application.role.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

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
              placeholder="Search by company or role"
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
                <th>Date Applied</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td className="company-cell">{application.company}</td>
                  <td>{application.role}</td>
                  <td>
                    <span className={getStatusClass(application.status)}>
                      {application.status}
                    </span>
                  </td>
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