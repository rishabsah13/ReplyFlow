# AI Customer Support Assistant

A modern SaaS-style web app to draft customer support replies with AI-like speed.

## Tech stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- Keyword-based “AI” engine (mockable, ready to swap with real LLM)
- LocalStorage for client-side persistence

## Features

- **Customer message input**
  - Paste or type support emails, chats, or tickets.
- **Tone selector**
  - Switch between Professional, Friendly, and Apologetic replies.
- **Smart canned responses**
  - Keyword-based engine generates structured replies for:
    - Billing / refunds
    - Login / access issues
    - Subscription changes / cancellations
    - Feature requests
    - Performance issues
    - Fallback: escalates unusual cases to a human agent
- **Response history**
  - Saves all generated replies with timestamps and tone.
  - Persists across sessions via `localStorage`.
  - One-click **Reuse** to load a previous reply back into the editor.
- **Edit & Regenerate**
  - Inline **Edit** to tweak any reply and save the updated version.
  - **Regenerate** for a fresh draft using the same customer message and tone.
- **Copy to clipboard**
  - One-click copy with “Copied ✅” micro-feedback.
- **Message categorization**
  - Automatic tags (Refund, Subscription, Login, Performance, Feature Request, Needs Review).
  - Visible as badges in the response header and history list.
- **UI/UX**
  - Dark SaaS dashboard layout with sidebar and workspace pill.
  - Responsive 2-column layout.
  - Subtle shadows, hover states, and tight typography.

## Running locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

The current version uses a mock response engine only and does **not** require any API keys.

To enable a real LLM later, replace the mock engine in `src/app/api/generate/route.ts` with your preferred provider.