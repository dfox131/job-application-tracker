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

Return your response STRICTLY in JSON format with the following structure:

{
  "matchSummary": "Short summary of how well the resume matches the job",
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const response = await openai.responses.create({
      model: "gpt-5.4-mini", // cheaper + fast
      input: prompt,
    });

    const output = response.output_text;

    let parsed;

    try {
      parsed = JSON.parse(output);
    } catch {
      // fallback if model returns slightly messy JSON
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
