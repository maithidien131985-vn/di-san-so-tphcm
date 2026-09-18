/**
 * Audio Script Synchronization Engine
 * Maps audio timeline (currentTime, duration) to sentence-level glowing text highlights.
 */

export function parseScriptIntoSentences(sections, totalDuration = 180) {
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return [];
  }

  // 1. Gather all sentences across all sections with section metadata
  const rawSentences = [];
  sections.forEach((sec, secIdx) => {
    const title = sec.title || `Phần ${secIdx + 1}`;
    const text = sec.text || sec.content || '';
    
    // Split into sentences (by period, exclamation, question mark, colon, newline)
    const parts = text
      .split(/(?<=[.?!;:\n])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (parts.length === 0 && text.trim().length > 0) {
      parts.push(text.trim());
    }

    parts.forEach((sentenceText, sentIdx) => {
      rawSentences.push({
        id: `sec_${secIdx}_sent_${sentIdx}`,
        secIdx,
        sentIdx,
        secTitle: title,
        text: sentenceText,
        charCount: Math.max(15, sentenceText.length)
      });
    });
  });

  if (rawSentences.length === 0) return [];

  // 2. Calculate time bounds proportionally based on character weight
  const totalChars = rawSentences.reduce((acc, s) => acc + s.charCount, 0);
  const safeDuration = totalDuration > 0 ? totalDuration : 180;

  let accumulatedTime = 0;
  return rawSentences.map((s, idx) => {
    const durationForSent = totalChars > 0 ? (s.charCount / totalChars) * safeDuration : 0;
    const startTime = accumulatedTime;
    const endTime = idx === rawSentences.length - 1 ? safeDuration : accumulatedTime + durationForSent;
    accumulatedTime += durationForSent;

    return {
      ...s,
      globalIndex: idx,
      startTime,
      endTime,
      duration: durationForSent
    };
  });
}

export function getActiveSentenceIndex(sentences, currentTime) {
  if (!sentences || sentences.length === 0) return 0;
  for (let i = 0; i < sentences.length; i++) {
    if (currentTime >= sentences[i].startTime && currentTime < sentences[i].endTime) {
      return i;
    }
  }
  if (currentTime >= (sentences[sentences.length - 1]?.endTime || 0)) {
    return sentences.length - 1;
  }
  return 0;
}
