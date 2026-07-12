#!/usr/bin/env node
/**
 * Cross-posts new/newly-published blog posts to X (Twitter) and Medium.
 * Called by GitHub Actions with a list of markdown file paths as arguments.
 *
 * Secrets required (set in GitHub repo Settings → Secrets → Actions):
 *
 *   X / Twitter (https://developer.twitter.com):
 *     TWITTER_API_KEY          App consumer key
 *     TWITTER_API_SECRET       App consumer secret
 *     TWITTER_ACCESS_TOKEN     Account access token  (Read+Write)
 *     TWITTER_ACCESS_SECRET    Account access token secret
 *
 *   Medium (https://medium.com/me/settings → Integration tokens):
 *     MEDIUM_TOKEN             Integration token
 *
 *   Set automatically by the workflow:
 *     SITE_URL                 e.g. https://is_h.github.io
 */
import { readFileSync } from 'fs';
import matter from 'gray-matter';
import { TwitterApi } from 'twitter-api-v2';

const SITE_URL = process.env.SITE_URL ?? 'https://is_h.github.io';

/* ── X / Twitter ─────────────────────────────────────────────── */
async function postToX(frontmatter, slug) {
  const { TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET } = process.env;
  if (!TWITTER_API_KEY) { console.log('[X] Skipped — secrets not configured.'); return; }

  const client = new TwitterApi({
    appKey:       TWITTER_API_KEY,
    appSecret:    TWITTER_API_SECRET,
    accessToken:  TWITTER_ACCESS_TOKEN,
    accessSecret: TWITTER_ACCESS_SECRET,
  });

  const url      = `${SITE_URL}/blog/${slug}`;
  const hashtags = (frontmatter.tags ?? [])
    .slice(0, 3)
    .map(t => `#${t.replace(/[^a-zA-Z0-9]/g, '')}`)
    .join(' ');

  // Build tweet, keeping under 280 characters
  const body    = `${frontmatter.description}\n\n${url}`;
  const tweet   = `New post: ${frontmatter.title}\n\n${body}\n\n${hashtags}`;
  const trimmed = tweet.length > 277 ? `${tweet.slice(0, 274)}...` : tweet;

  await client.v2.tweet(trimmed);
  console.log(`[X] Posted: ${trimmed.split('\n')[0]}`);
}

/* ── Medium ──────────────────────────────────────────────────── */
async function postToMedium(frontmatter, body, slug) {
  const token = process.env.MEDIUM_TOKEN;
  if (!token) { console.log('[Medium] Skipped — MEDIUM_TOKEN not set.'); return; }

  // Resolve author ID
  const meRes = await fetch('https://api.medium.com/v1/me', {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!meRes.ok) { console.error('[Medium] Auth failed:', meRes.statusText); return; }
  const { data: me } = await meRes.json();

  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const content      = `${body}\n\n---\n\n*Originally published at [${canonicalUrl}](${canonicalUrl})*`;

  const postRes = await fetch(`https://api.medium.com/v1/users/${me.id}/posts`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title:         frontmatter.title,
      contentFormat: 'markdown',
      content,
      tags:          (frontmatter.tags ?? []).slice(0, 5),
      canonicalUrl,
      publishStatus: 'public',
    }),
  });

  const result = await postRes.json();
  if (result.data?.url) {
    console.log(`[Medium] Published: ${result.data.url}`);
  } else {
    console.error('[Medium] Unexpected response:', JSON.stringify(result));
  }
}

/* ── Main ────────────────────────────────────────────────────── */
const files = process.argv.slice(2).filter(Boolean);

if (files.length === 0) {
  console.log('No posts to cross-post.');
  process.exit(0);
}

for (const filePath of files) {
  try {
    const raw  = readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(raw);

    if (frontmatter.draft) {
      console.log(`[skip] draft: ${filePath}`);
      continue;
    }

    const slug = filePath.replace(/^src\/content\/blog\//, '').replace(/\.md$/, '');
    console.log(`\nCross-posting: "${frontmatter.title}"`);

    await postToX(frontmatter, slug);
    await postToMedium(frontmatter, content, slug);
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}
