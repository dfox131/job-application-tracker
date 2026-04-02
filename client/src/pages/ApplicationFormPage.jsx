import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createApplication,
  extractJobDescription,
  getApplicationById,
  updateApplication,
} from "../services/applicationService";

const initialFormData = {
  company: "",
  role: "",
  status: "APPLIED",
  source: "",
  salary: "",
  location: "",
  dateApplied: "",
  link: "",
  notes: "",
  jobDescription: "",
};

function formatDateForInput(dateString) {
  if (!dateString) return "";
  return dateString.split("T")[0];
}

export default function ApplicationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [extractingJobDescription, setExtractingJobDescription] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplication() {
      if (!isEditMode) return;

      try {
        setLoading(true);
        const data = await getApplicationById(id);
        const application = data.application;

        setFormData({
          company: application.company || "",
          role: application.role || "",
          status: application.status || "APPLIED",
          source: application.source || "",
          salary: application.salary || "",
          location: application.location || "",
          dateApplied: formatDateForInput(application.dateApplied),
          link: application.link || "",
          notes: application.notes || "",
          jobDescription: application.jobDescription || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load application.");
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [id, isEditMode]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleFetchJobDescription() {
    setError("");

    if (!formData.link.trim()) {
      setError("Please enter a job link first.");
      return;
    }

    try {
      setExtractingJobDescription(true);

      const data = await extractJobDescription(formData.link);

      setFormData((prev) => ({
        ...prev,
        jobDescription: data.jobDescription || "",
      }));
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Failed to fetch job description from the provided link."
      );
    } finally {
      setExtractingJobDescription(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.company.trim() || !formData.role.trim()) {
      setError("Company and role are required.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        company: formData.company,
        role: formData.role,
        status: formData.status,
        source: formData.source,
        salary: formData.salary,
        location: formData.location,
        dateApplied: formData.dateApplied || null,
        link: formData.link,
        notes: formData.notes,
        jobDescription: formData.jobDescription,
      };

      if (isEditMode) {
        await updateApplication(id, payload);
      } else {
        await createApplication(payload);
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        isEditMode
          ? "Failed to update application."
          : "Failed to create application."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Loading application...</p>;
  }

  return (
    <div className="page-container">
      <h1>{isEditMode ? "Edit Application" : "Add Application"}</h1>

      <form className="application-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="Benchling"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <input
            id="role"
            name="role"
            type="text"
            value={formData.role}
            onChange={handleChange}
            placeholder="Software Engineer, New Grad (2026)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="source">Source</label>
          <input
            id="source"
            name="source"
            type="text"
            value={formData.source}
            onChange={handleChange}
            placeholder="Welcome to the Jungle"
          />
        </div>

        <div className="form-group">
          <label htmlFor="salary">Salary</label>
          <input
            id="salary"
            name="salary"
            type="text"
            value={formData.salary}
            onChange={handleChange}
            placeholder="$144K or $145K - $170K"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="SF"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateApplied">Date Applied</label>
          <input
            id="dateApplied"
            name="dateApplied"
            type="date"
            value={formData.dateApplied}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="link">Job Link</label>
          <input
            id="link"
            name="link"
            type="url"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://company.com/job-posting"
          />
          <button
            type="button"
            onClick={handleFetchJobDescription}
            disabled={extractingJobDescription}
          >
            {extractingJobDescription ? "Fetching..." : "Fetch from Job Link"}
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="jobDescription">Job Description</label>
          <p className="field-helper-text">
            Paste the job description manually or fetch it from the job link.
          </p>
          <textarea
            id="jobDescription"
            name="jobDescription"
            rows="10"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Paste the full job description here..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows="5"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Applied through company site after finding on job board..."
          />
        </div>

        {error ? <p className="error-message">{error}</p> : null}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting
              ? "Saving..."
              : isEditMode
              ? "Save Changes"
              : "Save Application"}
          </button>
        </div>
      </form>
    </div>
  );
}