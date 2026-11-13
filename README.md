# Support Page (Hepi.in)

Next.js 16 + Tailwind 4. Mobile-first, content column fixed at max 414px (centered on desktop).

## Flow

`/` intro → `/daftar` → `/ready?slug=…` → `/{slug}` creator page → `/confirm` → `/success`

`/{slug}` is the public page (`hepi.in/Nadya`). Slugs that collide with app routes are rejected
(see `src/lib/validators.js`).

## Run

```bash
npm install
cp .env.example .env.local   # edit values
npm run dev                  # http://localhost:3000
npm run lint && npm run build && npm start
```

## Configuration

See `.env.example`. Key points:

- `NEXT_PUBLIC_API_URL` is **required in production**. Without it, production services fail with an
  error instead of faking success. In development, mock data is used automatically.
- `NEXT_PUBLIC_ENABLE_MOCKS=true` allows mock data in production (demo deployments only).
- `NEXT_PUBLIC_CS_WHATSAPP_URL` empty hides the "Kontak CS" button; `NEXT_PUBLIC_LOGIN_URL` empty hides "Masuk".

## Backend contract (what the code expects)

All calls go through `src/lib/api.js` (15s timeout, `ApiError` with `status` / `code`).
Error bodies may be `{ "message": "...", "code": "..." }`.

| Call | Where | Expected |
| --- | --- | --- |
| `GET /me` | `services/accountService.js` (server, session cookie forwarded) | `200 { name, avatarUrl }`, `401` when logged out |
| `POST /support-pages` | `services/registerService.js` (browser, `credentials: include`, multipart: `slug, bio, instagram, tiktok, facebook, photo`) | `201 { slug }`, `409` / `code: SLUG_TAKEN`, `422 { message }` |
| `GET /creators/{slug}` | `services/creatorService.js` | `200 { name, role, bio, isVerified, coverImageUrl, avatarImageUrl, socials }`, `404` |
| `GET /creators/{slug}/campaigns` | `services/creatorService.js` | `200 [{ id, title, imageUrl, daysLeft, collectedAmount, targetAmount }]` |
| `POST /donations` | `services/donationService.js` (JSON, `credentials: include`) | `201 { reference }`, `422 { message }` |
| `GET /donations/{reference}` | `services/donationService.js` (server) | `200 { reference, amount, paymentLabel, status, campaign }`, `404` |

If your API differs, adjust only the files in `src/services/`.

**Security note:** the amount in the `/confirm` URL is only a UI convenience. The backend must validate
the amount (and min/max in `src/constants/supportAmounts.js`) when creating the donation, and the success
page shows the amount returned by the API, not the one in the URL.

## Design tokens (`src/app/globals.css`)

Base `#FBFCFF`, text `#091F40` / `#637DA3`, brand `#2E68B2`, soft `#E5F5FF`, accent `#1A73EB`,
avatar `#2858A4`, verified `#059669`, love `#EF3554`.

## Production checklist

- [ ] Set the env vars above on the host
- [ ] Confirm the API contract table with the backend
- [ ] Replace the image placeholders (campaign thumbnails, cover) with real URLs
- [ ] Review `experimental.agentFeedback` in `next.config.mjs` (dev tooling flag from the template; remove if not needed)
- [ ] Add rate limiting / bot protection on `POST /donations` and `POST /support-pages` (backend)
