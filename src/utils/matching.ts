export interface MatchResult<T> {
  item: T;
  score: number;
  matchedThemes: string[];
  keywordMatches: string[];
}

const keywordMap: Record<string, string[]> = {
  hope: ["hope", "hopeful", "optimistic", "inshallah", "future", "better", "insha'allah"],
  comfort: ["comfort", "sad", "cry", "crying", "hurt", "pain", "grief", "loss", "miss", "lonely", "alone"],
  patience: ["patient", "wait", "endure", "difficult", "hard", "struggle", "trial", "test", "sabr"],
  trust: ["trust", "rely", "tawakkal", "surrender", "control", "worry", "anxious", "uncertain"],
  mercy: ["mercy", "forgive", "rahman", "raheem", "compassion", "kind"],
  forgiveness: ["forgive", "sin", "mistake", "regret", "guilt", "sorry", "repent", "tawbah"],
  gratitude: ["grateful", "thankful", "blessing", "alhamdulillah", "shukr", "appreciate", "blessed"],
  peace: ["peace", "calm", "rest", "sakina", "tranquil", "serene", "slee", "insomnia", "anxiety"],
  guidance: ["guidance", "lost", "confused", "direction", "path", "choice", "decision", "confus"],
  healing: ["heal", "recover", "cure", "shifa", "sick", "ill", "disease"],
  strength: ["strong", "strength", "power", "courage", "brave", "firm", "steadfast"],
  motivation: ["motivat", "lazy", "procrastinat", "purpose", "goal", "inspire", "determination"],
  protection: ["protect", "safe", "fear", "afraid", "danger", "shield", "guard", "security"],
  relief: ["relief", "stress", "overwhelm", "burden", "heavy", "tired", "exhaust"],
  blessings: ["blessing", "rizq", "provision", "wealth", "favor", "gift", "barakah"],
};

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const matched: string[] = [];
  for (const [theme, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      matched.push(theme);
    }
  }
  return matched;
}

export function rankByThemes<T extends { themes: string[] }>(
  items: T[],
  moodThemes: string[],
  note?: string
): MatchResult<T>[] {
  const noteThemes = note ? extractKeywords(note) : [];

  const allThemes = [...new Set([...moodThemes, ...noteThemes])];

  const scored: MatchResult<T>[] = items.map((item) => {
    const matchedThemes = allThemes.filter((t) =>
      item.themes.some(
        (it) => it.toLowerCase() === t.toLowerCase()
      )
    );
    const keywordMatches = noteThemes.filter((t) =>
      item.themes.some((it) => it.toLowerCase() === t.toLowerCase())
    );
    const baseScore = matchedThemes.length / Math.max(allThemes.length, 1);
    const noteBonus = keywordMatches.length * 0.15;
    const coverageBonus = matchedThemes.length / Math.max(item.themes.length, 1) * 0.2;
    const score = Math.min(baseScore + noteBonus + coverageBonus, 1);

    return { item, score, matchedThemes, keywordMatches };
  });

  return scored.sort((a, b) => b.score - a.score);
}
