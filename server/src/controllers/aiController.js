import { openai } from "../openai.js";

export async function analyzeJobMatch(req, res) {
  try {
    const { resumeText, jobDescription } = req.body || {};

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        ok: false,
        error: "resumeText and jobDescription are required.",
      });
    }

    const prompt = `
You are an expert resume reviewer and ATS analyzer.

Compare the following resume with the job description.

Return your response STRICTLY in valid JSON format with the following structure:

{
  "matchScore": 0,
  "matchSummary": "Short summary of how well the resume matches the job",
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

Rules:
- matchScore must be an integer from 0 to 100
- be realistic and conservative with the score
- matchingSkills should list strengths already shown in the resume that align with the job
- missingSkills should list important skills or qualifications not clearly shown in the resume
- suggestions should give practical ways to improve the resume for this job
- do not include any text outside the JSON

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const response = await openai.responses.create({
      model: "gpt-5.4-mini",
      input: prompt,
    });

    const output = response.output_text;

    let parsed;

    try {
      parsed = JSON.parse(output);
    } catch {
      return res.json({
        ok: true,
        raw: output,
      });
    }

    res.json({
      ok: true,
      analysis: parsed,
    });
  } catch (error) {
    console.error("AI analysis failed:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}
