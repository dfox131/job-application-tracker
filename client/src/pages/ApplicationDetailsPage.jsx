import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  analyzeApplication,
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

function formatDateTime(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);
  return date.toLocaleString("en-US");
}

function renderStringList(items, emptyMessage) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState("");
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

  async function handleAnalyzeAndSave() {
    if (!application.jobDescription) {
      setError("Please save a job description before running analysis.");
      return;
    }

    if (!resumeText.trim()) {
      setError("Please paste your resume text before running analysis.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");

      const data = await analyzeApplication(application.id, resumeText);
      setApplication(data.application);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Failed to analyze and save application."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  function handleAnalyzeMatch() {
    navigate("/ai/resume-match", {
      state: {
        applicationId: application.id,
        company: application.company,
        role: application.role,
        jobDescription: application.jobDescription || "",
      },
    });
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
          <button
            type="button"
            className="primary-link-button"
            onClick={handleAnalyzeMatch}
          >
            Analyze Resume Match
          </button>

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
        <h2>Job Description</h2>
        <p className="details-notes">
          {application.jobDescription || "No job description saved yet."}
        </p>
      </div>

      <div className="details-card">
        <h2>Run Saved AI Analysis</h2>
        <p className="page-helper-text">
          Paste your resume text below to analyze it against this application's saved job description.
        </p>

        <div className="form-group">
          <label htmlFor="resumeText">Resume Text</label>
          <textarea
            id="resumeText"
            name="resumeText"
            rows="10"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="primary-link-button"
            onClick={handleAnalyzeAndSave}
            disabled={analyzing}
          >
            {analyzing
              ? "Analyzing..."
              : application.lastAnalyzedAt
              ? "Re-run Saved Analysis"
              : "Run Saved Analysis"}
          </button>
        </div>
      </div>

      <div className="details-card">
        <h2>Saved AI Analysis</h2>

        <div className="details-grid">
          <div className="details-item">
            <span className="details-label">Match Score</span>
            <span>
              {typeof application.matchScore === "number"
                ? `${application.matchScore}%`
                : "Not analyzed yet"}
            </span>
          </div>

          <div className="details-item">
            <span className="details-label">Last Analyzed</span>
            <span>{formatDateTime(application.lastAnalyzedAt)}</span>
          </div>
        </div>

        <div className="result-section">
          <h3>Summary</h3>
          <p>{application.matchSummary || "No saved summary yet."}</p>
        </div>

        <div className="result-section">
          <h3>Matching Skills</h3>
          {renderStringList(application.matchingSkills, "No saved matching skills yet.")}
        </div>

        <div className="result-section">
          <h3>Missing Skills</h3>
          {renderStringList(application.missingSkills, "No saved missing skills yet.")}
        </div>

        <div className="result-section">
          <h3>Suggestions</h3>
          {renderStringList(application.suggestions, "No saved suggestions yet.")}
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