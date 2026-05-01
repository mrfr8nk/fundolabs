const BK9_ENDPOINT = "https://api.bk9.dev/ai/BK94";
const BK9_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

const ZIMSEC_SYSTEM = `You are FundoBot, an expert AI science tutor for ZIMSEC O-Level and A-Level students in Zimbabwe and Africa. You specialise in Chemistry and Physics. You explain concepts clearly using the ZIMSEC syllabus, give step-by-step solutions, use relevant African examples, and always end with an encouraging tip. When asked about experiments, explain aims, methods, observations, equations, and safety. Keep responses concise and educational. Format with clear sections and numbered steps where appropriate. Do not use markdown tables. Created by FundoLabs.`;

export async function askBK9(question: string, context?: string): Promise<string> {
  const systemPrompt = context
    ? `${ZIMSEC_SYSTEM}\n\nCurrent experiment context: ${context}`
    : ZIMSEC_SYSTEM;

  const params = new URLSearchParams({
    BK9: systemPrompt.substring(0, 1000),
    q: question.substring(0, 2000),
    model: BK9_MODEL,
  });

  try {
    const res = await fetch(`${BK9_ENDPOINT}?${params.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) throw new Error(`BK9 HTTP ${res.status}`);
    const data = await res.json();

    if (data?.status && data?.BK9) {
      return String(data.BK9).trim();
    }
    throw new Error("BK9 empty response");
  } catch (err) {
    console.warn("BK9 API error, using fallback:", err);
    return getFallbackResponse(question, context);
  }
}

function getFallbackResponse(question: string, context?: string): string {
  const q = question.toLowerCase();

  if (q.includes("aim") || q.includes("purpose") || q.includes("objective")) {
    return context
      ? `The aim of this experiment is to ${context.toLowerCase()}.\n\nThis experiment demonstrates core scientific principles through direct observation and measurement, aligning with the ZIMSEC curriculum.`
      : "The aim of a scientific experiment is to investigate a specific hypothesis or concept through controlled observation and measurement.";
  }

  if (q.includes("error") || q.includes("accurate") || q.includes("improve")) {
    return "Sources of error in this experiment:\n\n1. Parallax error when reading measuring instruments\n2. Human reaction time when using a stopwatch\n3. Heat loss to the surroundings\n4. Impure reagents affecting results\n\nTo improve accuracy: repeat the experiment at least 3 times and calculate a mean. Use a white tile when reading burettes.";
  }

  if (q.includes("safety") || q.includes("hazard") || q.includes("ppe")) {
    return "Safety precautions:\n\n1. Wear safety goggles, lab coat, and gloves\n2. Never point test tubes at anyone when heating\n3. Know the location of the fire extinguisher and eyewash station\n4. Handle corrosive chemicals (acids, alkalis) with extreme care\n5. Report all accidents and spillages immediately to your teacher";
  }

  if (q.includes("equation") || q.includes("formula")) {
    return "Key equations vary by experiment. For chemistry: always balance by ensuring atoms on both sides are equal. For physics: identify your knowns and unknowns, then select the appropriate formula from your ZIMSEC data booklet. Show all working step by step.";
  }

  return `Great question about this experiment!\n\nThis relates to core ZIMSEC ${context?.includes("chemistry") ? "Chemistry" : "Physics"} concepts.\n\nKey points to consider:\n1. Identify the independent and dependent variables\n2. Understand the underlying scientific principle\n3. Consider sources of error and how to minimise them\n4. Compare your results to theoretical values\n\nFor your specific question: "${question}"\n\nThink about what the theory predicts, then compare with what you observed. This is the scientific method in action! Keep exploring - FundoLabs`;
}
