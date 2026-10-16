import type { CaseFillValues } from "./case-values";
import { chatJson, hasOpenAI } from "./ai/openai";

export type ParentingScheduleSplit = {
  partyA: string;
  partyB: string;
  exchangeNotes: string;
  exchangeLocation: string;
  pickupTime: string;
  dropoffTime: string;
  source: "ai" | "heuristic" | "empty";
};

function extractTimes(text: string): { pickupTime: string; dropoffTime: string } {
  const times = [...text.matchAll(/\b(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))\b/g)].map((m) =>
    m[1].replace(/\s+/g, " ").trim()
  );
  return {
    pickupTime: times[0] || "",
    dropoffTime: times[1] || times[0] || "",
  };
}

function extractExchangeLocation(text: string): string {
  const exchange = text.match(
    /exchanges?\s+(?:at|@)\s+([^.;]+?)(?:\s+and\s+|\.|$|;)/i
  );
  if (exchange?.[1]) return exchange[1].trim();
  const atSchool = /at school/i.test(text);
  const atHome = text.match(/at\s+(Party\s*[AB]'?s?\s+residence|petitioner'?s?\s+home|[^.;]+home)/i);
  if (atSchool && atHome?.[1]) return `School / ${atHome[1]}`;
  if (atSchool) return "School";
  if (atHome?.[1]) return atHome[1];
  return "";
}

function heuristicScheduleSplit(raw: string): ParentingScheduleSplit {
  const text = raw.trim();
  const times = extractTimes(text);
  const exchangeLocation = extractExchangeLocation(text);
  if (!text) {
    return {
      partyA: "",
      partyB: "",
      exchangeNotes: "",
      exchangeLocation: "",
      pickupTime: "",
      dropoffTime: "",
      source: "empty",
    };
  }

  const partyAMatch = text.match(
    /(?:party\s*a|petitioner|mother|father|parent\s*a)\s*[:\-]\s*([\s\S]*?)(?=(?:party\s*b|respondent|parent\s*b)\s*[:\-]|$)/i
  );
  const partyBMatch = text.match(
    /(?:party\s*b|respondent|parent\s*b)\s*[:\-]\s*([\s\S]*?)$/i
  );

  if (partyAMatch?.[1]?.trim() && partyBMatch?.[1]?.trim()) {
    return {
      partyA: partyAMatch[1].trim(),
      partyB: partyBMatch[1].trim(),
      exchangeNotes: "",
      exchangeLocation,
      pickupTime: times.pickupTime,
      dropoffTime: times.dropoffTime,
      source: "heuristic",
    };
  }

  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const isExchange = (part: string) => /exchange/i.test(part);
  const isPartyA = (part: string) =>
    !isExchange(part) &&
    /party\s*a|petitioner/i.test(part) &&
    !/with party\s*b|to party\s*b/i.test(part);
  const isPartyB = (part: string) =>
    !isExchange(part) &&
    /party\s*b|respondent|every other weekend/i.test(part) &&
    !isPartyA(part);
  const partyAText = parts.filter(isPartyA).join(" ");
  const partyBText = parts.filter(isPartyB).join(" ");
  const exchangeText = parts.filter(isExchange).join(" ");
  if (partyAText || partyBText) {
    return {
      partyA: partyAText,
      partyB: partyBText,
      exchangeNotes: exchangeText,
      exchangeLocation,
      pickupTime: times.pickupTime,
      dropoffTime: times.dropoffTime,
      source: "heuristic",
    };
  }

  return {
    partyA: text,
    partyB: "",
    exchangeNotes: exchangeText,
    exchangeLocation,
    pickupTime: times.pickupTime,
    dropoffTime: times.dropoffTime,
    source: "heuristic",
  };
}

async function aiScheduleSplit(raw: string): Promise<ParentingScheduleSplit | null> {
  if (!hasOpenAI()) return null;

  const result = await chatJson<{
    partyA?: string;
    partyB?: string;
    exchangeNotes?: string;
    exchangeLocation?: string;
    pickupTime?: string;
    dropoffTime?: string;
  }>({
    system:
      "You split Arizona parenting-time proposals into Party A (petitioner) and Party B (respondent) schedules. Return JSON only with keys partyA, partyB, exchangeNotes, exchangeLocation, pickupTime, dropoffTime. Use only days, times, and exchange places stated by the client. Do not add drafting instructions or tell anyone to specify something before filing. Keep each value under 180 characters.",
    user: `Parenting schedule text:\n${raw}`,
  });

  if (!result?.partyA?.trim() || !result?.partyB?.trim()) return null;
  if (result.partyA.trim() === result.partyB.trim()) return null;

  const fallback = extractTimes(raw);
  return {
    partyA: result.partyA.trim(),
    partyB: result.partyB.trim(),
    exchangeNotes: (result.exchangeNotes || "").trim(),
    exchangeLocation:
      (result.exchangeLocation || "").trim() || extractExchangeLocation(raw),
    pickupTime: (result.pickupTime || "").trim() || fallback.pickupTime,
    dropoffTime: (result.dropoffTime || "").trim() || fallback.dropoffTime,
    source: "ai",
  };
}

/** Enrich fill values with schedule split + any AI-assisted clarifications. */
export async function enrichCaseFillValues(values: CaseFillValues): Promise<CaseFillValues> {
  const raw = values.parenting.parentingTimeSchedule || values.parenting.notes;
  let schedule = heuristicScheduleSplit(raw);

  if (raw.trim()) {
    const ai = await aiScheduleSplit(raw);
    if (ai) schedule = ai;
  }

  return {
    ...values,
    parenting: {
      ...values.parenting,
      schedulePartyA: schedule.partyA,
      schedulePartyB: schedule.partyB,
      scheduleExchangeNotes: schedule.exchangeNotes,
      scheduleSource: schedule.source,
      exchangeLocation: schedule.exchangeLocation || values.parenting.exchangeLocation,
      pickupTime: schedule.pickupTime || values.parenting.pickupTime,
      dropoffTime: schedule.dropoffTime || values.parenting.dropoffTime,
    },
  };
}
