import { Sponsor } from './types';
import { inMemoryStore } from './store';

export interface AdMatchResult {
  sponsor: Sponsor;
  adHeadline: string;
  ctaUrl: string;
}

/**
 * Parallel Semantic Ad Matcher:
 * Rapidly matches user prompt intent against the active sponsor campaigns.
 */
export function matchSponsorToPrompt(userPrompt: string): AdMatchResult {
  const sponsors = inMemoryStore.sponsors;
  const promptLower = userPrompt.toLowerCase();

  let matchedSponsor = sponsors[0];
  let highestScore = -1;

  for (const sponsor of sponsors) {
    let score = 0;
    const keywords = sponsor.target_intent.split(',').map((k) => k.trim().toLowerCase());

    for (const kw of keywords) {
      if (promptLower.includes(kw)) {
        score += 3;
      }
    }

    if (promptLower.includes(sponsor.company_name.toLowerCase())) {
      score += 10;
    }

    if (score > highestScore) {
      highestScore = score;
      matchedSponsor = sponsor;
    }
  }

  return {
    sponsor: matchedSponsor,
    adHeadline: matchedSponsor.ad_headline,
    ctaUrl: matchedSponsor.cta_url,
  };
}
