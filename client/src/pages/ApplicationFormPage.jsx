import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../services/applicationService";

const initialFormData = {
  company: "",
  role: "",
  status: "APPLIED",
  dateApplied: "",
  link: "",
  notes: "",
};

export default function ApplicationFormPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

      await createApplication({
        company: formData.company,
        role: formData.role,
        status: formData.status,
        dateApplied: formData.dateApplied || null,
        link: formData.link,
        notes: formData.notes,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to create application.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container">
      <h1>Add Application</h1>

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
            {submitting ? "Saving..." : "Save Application"}
          </button>
        </div>
      </form>
    </div>
  );
}