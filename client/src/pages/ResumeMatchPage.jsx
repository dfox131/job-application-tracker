import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function ResumeMatchPage() {
  const location = useLocation();
  const prefilledJobDescription = location.state?.jobDescription || "";
  const company = location.state?.company || "";
  const role = location.state?.role || "";

  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (prefilledJobDescription) {
      setJobDescription(prefilledJobDescription);
    }
  }, [prefilledJobDescription]);

  const handleAnalyze = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Please fill in both the resume text and job description.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/job-match`,
        {
          resumeText,
          jobDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(response.data.analysis || response.data);
    } catch (err) {
      console.error("Resume match analysis failed:", err);
      setError(
        err.response?.data?.message ||
          "Something went wrong while analyzing the resume."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-match-page">
      <h1>Resume Match Analyzer</h1>
      <p className="page-subtitle">
        {company || role
          ? `Analyze your resume against ${role || "this role"}${company ? ` at ${company}` : ""}.`
          : "Paste your resume and a job description to see how well they align."}
      </p>

      <form onSubmit={handleAnalyze} className="resume-match-form">
        <div className="form-group">
          <label htmlFor="resumeText">Resume Text</label>
          <textarea
            id="resumeText"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume here..."
            rows={12}
          />
        </div>

        <div className="form-group">
          <label htmlFor="jobDescription">Job Description</label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={12}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="results-card">
          <h2>Analysis Results</h2>

          {typeof result.matchScore === "number" && (
            <section className="result-section">
              <h3>Match Score</h3>
              <p className="match-score">{result.matchScore}%</p>

              <div className="match-score-bar">
                <div
                  className="match-score-fill"
                  style={{ width: `${result.matchScore}%` }}
                />
              </div>
            </section>
          )}

          <section className="result-section">
            <h3>Summary</h3>
            <p>{result.matchSummary || "No summary returned."}</p>
          </section>

          <section className="result-section">
            <h3>Matching Skills</h3>
            {Array.isArray(result.matchingSkills) && result.matchingSkills.length > 0 ? (
              <ul>
                {result.matchingSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p>No matching skills returned.</p>
            )}
          </section>

          <section className="result-section">
            <h3>Missing Skills</h3>
            {Array.isArray(result.missingSkills) && result.missingSkills.length > 0 ? (
              <ul>
                {result.missingSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p>No missing skills returned.</p>
            )}
          </section>

          <section className="result-section">
            <h3>Suggestions</h3>
            {Array.isArray(result.suggestions) && result.suggestions.length > 0 ? (
              <ul>
                {result.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            ) : (
              <p>No suggestions returned.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}