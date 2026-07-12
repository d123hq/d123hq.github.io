#!/usr/bin/env node
/**
 * Create a new blog post with proper frontmatter.
 * Usage:  npm run new-post -- "My Post Title"
 */
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dir  = dirname(fileURLToPath(import.meta.url));
const root   = join(__dir, '..');
const title  = process.argv.slice(2).join(' ').trim();

if (!title) {
  console.error('\nUsage: npm run new-post -- "Your Post Title"\n');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, '')
  .trim()
  .replace(/\s+/g, '-');

const today    = new Date().toISOString().split('T')[0];
const blogDir  = join(root, 'src', 'content', 'blog');
const filePath = join(blogDir, `${slug}.md`);

if (!existsSync(blogDir)) mkdirSync(blogDir, { recursive: true });

if (existsSync(filePath)) {
  console.error(`\nFile already exists: src/content/blog/${slug}.md\n`);
  process.exit(1);
}

const template = `---
title: "${title}"
description: ""
date: ${today}
tags: []
draft: true
---

<!-- Remove draft: true above when ready to publish -->

## Introduction

Write your introduction here.

## Main Content

Your content goes here.

## Conclusion

Wrap up your thoughts.
`;

writeFileSync(filePath, template, 'utf-8');

console.log(`
✓ Created: src/content/blog/${slug}.md

Next steps:
  1. Open the file in your editor and write your post
  2. Set  draft: false  when ready to publish
  3. Preview locally:  npm run dev  → http://localhost:4321/blog/${slug}
  4. Publish:  git add . && git commit -m "post: ${title}" && git push
     → GitHub Actions builds and deploys in ~30 seconds
     → Cross-posting to X / Medium fires automatically
`);
