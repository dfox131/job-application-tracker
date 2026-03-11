import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createApplication,
  getApplicationById,
  updateApplication,
} from "../services/applicationService";

const initialFormData = {
  company: "",
  role: "",
  status: "APPLIED",
  dateApplied: "",
  link: "",
  notes: "",
};

function formatDateForInput(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
}

export default function ApplicationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
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
          dateApplied: formatDateForInput(application.dateApplied),
          link: application.link || "",
          notes: application.notes || "",
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
        dateApplied: formData.dateApplied || null,
        link: formData.link,
        notes: formData.notes,
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
            placeholder="OpenAI"
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
            placeholder="Software Engineer"
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
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows="5"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Applied through company site..."
          />
        </div>

        {error ? <p className="error-message">{error}</p> : null}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
              ? "Save Changes"
              : "Save Application"}
          </button>
        </div>
      </form>
    </div>
  );
}