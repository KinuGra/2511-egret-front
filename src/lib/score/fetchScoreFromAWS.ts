export type Scores = {
  learning_depth?: number;
  expertise_level?: number;
  conciseness?: number;
  clarity_logic?: number;
  [key: string]: number | undefined;
};

export type CalculationSteps = Record<string, string>;

export type FinalResults = {
  average_quality_score?: number;
  final_weighted_score?: number;
  [key: string]: number | undefined;
};

export type Justification = Record<string, string>;

export type AwsParsedResponse = {
  snippet_index?: string;
  character_count?: number;
  scores?: Scores;
  calculation_steps?: CalculationSteps;
  final_results?: FinalResults;
  justification?: Justification;
  [key: string]: any;
};

/**
 * Try to extract a JSON string from various shapes (raw string, code-block wrapped, object containing string)
 * and parse it into an `AwsParsedResponse`.
 */
export function parseAwsSnippetResponse(input: unknown): AwsParsedResponse | null {
  let candidate: string | null = null;

  if (typeof input === "string") {
    candidate = input;
  } else if (typeof input === "object" && input !== null) {
    const obj = input as Record<string, any>;
    // If it already looks like the parsed object, return it
    if (obj.snippet_index || obj.character_count || obj.scores) {
      return obj as AwsParsedResponse;
    }
    // Otherwise, try to find a string field that contains JSON
    for (const v of Object.values(obj)) {
      if (typeof v === "string") {
        candidate = v;
        break;
      }
    }
  }

  if (!candidate) return null;

  // Trim and remove surrounding code fences like ```json ... ```
  let s = candidate.trim();
  const fenceMatch = s.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenceMatch) s = fenceMatch[1];

  // If the string is a quoted JSON string (e.g. "{...}"), try JSON.parse once to unquote
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    try {
      s = JSON.parse(s);
    } catch (e) {
      s = s.slice(1, -1);
    }
  }

  // Try parsing the cleaned string
  try {
    const parsed = JSON.parse(s);
    return parsed as AwsParsedResponse;
  } catch (e) {
    // fallback: attempt to extract the first {...} block
    const start = s.indexOf('{');
    const end = s.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      try {
        const sub = s.slice(start, end + 1);
        return JSON.parse(sub) as AwsParsedResponse;
      } catch (err) {
        // fall through
      }
    }
  }

  return null;
}

export async function fetchScoreFromAWS(index: string, indexvalue: number): Promise<AwsParsedResponse | null> {
  const API_URL = "/api/proxy";
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, indexvalue })
    });
    const data = await res.json();
    const parsed = parseAwsSnippetResponse(data);
    if (!parsed) {
      console.warn("fetchScoreFromAWS: failed to parse AWS response", { raw: data });
    }
    return parsed;
  } catch (err: any) {
    console.log(err);
    return null;
  }
}

export type ScoreSummary = {
  finalWeightedScore: number; // integer
  finalWeightedScoreRaw: number; // original float value from API or computed
  averageQualityScore: number; // percentage integer 0-100
  individualScores: Record<string, number>; // percentage integers
  characterCount: number;
  calculationSteps: CalculationSteps;
  justification: Justification;
};

/**
 * Normalize parsed AWS response into a display-friendly summary.
 * If `parsed` is null, returns zeros and empty objects.
 */
export function computeScoreSummary(parsed: AwsParsedResponse | null): ScoreSummary {
  if (!parsed) {
    return {
      finalWeightedScore: 0,
      averageQualityScore: 0,
      individualScores: {},
      characterCount: 0,
      calculationSteps: {},
      justification: {},
    };
  }

  const characterCount = Number(parsed.character_count ?? 0) || 0;

  // Determine average quality score (0..1).
  let avg = 0;
  if (typeof parsed.final_results?.average_quality_score === "number") {
    avg = parsed.final_results.average_quality_score as number;
  } else if (typeof parsed.average_quality_score === "number") {
    avg = parsed.average_quality_score as number;
  } else if (parsed.scores) {
    const vals = Object.values(parsed.scores).filter((v) => typeof v === "number") as number[];
    if (vals.length > 0) {
      avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    }
  }

  const averageQualityScore = Number.isFinite(avg) ? Math.round(avg * 100) : 0;

  // Final weighted score: prefer final_results.final_weighted_score, or compute avg * characterCount
  let finalRaw = parsed.final_results?.final_weighted_score;
  if (typeof finalRaw !== "number" || !Number.isFinite(finalRaw)) {
    if (Number.isFinite(avg) && characterCount > 0) {
      finalRaw = avg * characterCount;
    } else {
      finalRaw = 0;
    }
  }
  const finalWeightedScoreRaw = Number.isFinite(Number(finalRaw)) ? Number(finalRaw) : 0;
  const finalWeightedScore = Number.isFinite(finalWeightedScoreRaw) ? Math.round(finalWeightedScoreRaw) : 0;

  const individualScores: Record<string, number> = {};
  if (parsed.scores) {
    for (const [k, v] of Object.entries(parsed.scores)) {
      const n = Number(v ?? 0);
      individualScores[k] = Number.isFinite(n) ? Math.round(n * 100) : 0;
    }
  }

  return {
    finalWeightedScore,
    finalWeightedScoreRaw,
    averageQualityScore,
    individualScores,
    characterCount,
    calculationSteps: parsed.calculation_steps ?? {},
    justification: parsed.justification ?? {},
  };
}