import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteApplication,
  getApplicationById,
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

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplication() {
      try {
        setLoading(true);
        setError("");

        const data = await getApplicationById(id);
        setApplication(data.application);
      } catch (err) {
        console.error(err);
        setError("Failed to load application.");
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      await deleteApplication(id);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to delete application.");
    }
  }

  if (loading) {
    return <p>Loading application...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!application) {
    return <p>Application not found.</p>;
  }

  return (
    <div className="page-container details-page">
      <div className="details-header">
        <div>
          <p className="details-eyebrow">Application Details</p>
          <h1>{application.company}</h1>
          <p className="details-role">{application.role}</p>
        </div>

        <div className="details-header-actions">
          <Link to={`/edit/${application.id}`} className="primary-link-button">
            Edit
          </Link>
          <button
            type="button"
            className="secondary-delete-button"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="details-card">
        <div className="details-grid">
          <div className="details-item">
            <span className="details-label">Status</span>
            <span className={getStatusClass(application.status)}>
              {application.status}
            </span>
          </div>

          <div className="details-item">
            <span className="details-label">Source</span>
            <span>{application.source || "—"}</span>
          </div>

          <div className="details-item">
            <span className="details-label">Salary</span>
            <span>{application.salary || "—"}</span>
          </div>

          <div className="details-item">
            <span className="details-label">Location</span>
            <span>{application.location || "—"}</span>
          </div>

          <div className="details-item">
            <span className="details-label">Date Applied</span>
            <span>{formatDate(application.dateApplied)}</span>
          </div>

          <div className="details-item">
            <span className="details-label">Job Link</span>
            {application.link ? (
              <a href={application.link} target="_blank" rel="noreferrer">
                Open job posting
              </a>
            ) : (
              <span>—</span>
            )}
          </div>
        </div>
      </div>

      <div className="details-card">
        <h2>Notes</h2>
        <p className="details-notes">{application.notes || "No notes yet."}</p>
      </div>

      <div className="details-footer">
        <Link to="/" className="table-action-link">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}