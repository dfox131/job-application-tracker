import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApplications } from "../services/applicationService";

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

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);
        const data = await getApplications();
        setApplications(data.applications || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

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

      <div className="summary-card">
        <p className="summary-label">Total Applications</p>
        <p className="summary-value">{applications.length}</p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <h2>No applications yet</h2>
          <p>Add your first application to get started.</p>
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
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}