# corpus/ — kiran-bot's knowledge base

Anything in this folder is chunked, embedded, and searched by the `ask` command in the
terminal. The site's own data in `lib/data/*` and `public/resume.pdf` are always included,
so only add things that go beyond them.

## Supported files

| type | how it's split |
|---|---|
| `.md`, `.mdx` | one chunk per `#`/`##`/`###` section (long sections are split further) |
| `.pdf` | by résumé-style section headings (EXPERIENCE, PROJECTS, …), then by paragraph |
| `.docx`, `.txt` | same as PDF |

Subfolders are fine (e.g. `corpus/projects/studylens.md`). This README is skipped.
If you put a `resume.pdf` here, it replaces `public/resume.pdf` in the index.

## What makes answers accurate

- **A recruiter FAQ** (`faq.md`): work authorization, availability and start dates,
  location and relocation, GPA, graduation date, the roles you want, and how to reach you.
  These are the questions people ask first, and the ones the site data answers least well.
- **Project deep dives** (`projects/<name>.md`): the problem, your role, the architecture,
  hard bugs, trade-offs and results with numbers. One `##` heading per topic.
- **Experience notes** (`experience/<company>.md`): what you owned and shipped, and the impact,
  especially for roles whose site entry is still "soon" (Acnodal, Aubot).
- **Coursework, research, and "about me"** (`about.md`): interests, what you're learning,
  and fun facts you're happy to share.

Tips:
- Write in the third person with your name ("Kiran built…"), one topic per heading.
  Headings become the citation labels, e.g. `projects/studylens.md §architecture`.
- State facts explicitly, with dates and numbers. The bot is told never to guess.
- Keep it current. If something here disagrees with the site, the bot may cite either.

## Privacy

Everything here can be quoted to any visitor, and this folder is committed to git.
Leave out anything you wouldn't put on your public site (phone number, home address, salary).

## Rebuild the index

```bash
npm run ingest -- --dry   # preview docs and chunk counts
npm run ingest            # embed with Voyage, write lib/rag/index.json + manifest.json
```

Commit `lib/rag/index.json` and `lib/rag/manifest.json` so the deployed site gets the new index.
