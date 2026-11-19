# Panduan Integrasi Backend — Support Page

Dokumen ini ditujukan untuk **senior frontend** dan **backend** yang akan mengintegrasikan halaman ini dengan API Sharing Happiness yang sesungguhnya.

---

## 1. Quick Start

```bash
# 1. Salin file env
cp .env.example .env.local

# 2. Isi NEXT_PUBLIC_API_URL dengan URL backend
#    Jika dibiarkan kosong, aplikasi otomatis pakai mock data (aman untuk dev)

# 3. Jalankan dev server
npm run dev
```

> **Mock mode** aktif otomatis selama `NEXT_PUBLIC_API_URL` kosong (di development).
> Semua data mock ada di `src/data/mock*.js`.

---

## 2. Arsitektur Singkat

```
src/
├── app/                   # Next.js App Router (Server Components)
│   ├── [slug]/page.js     # Halaman publik creator  ← route utama
│   ├── dashboard/         # Dashboard creator (auth required)
│   ├── list/page.js       # Registrasi support page
│   ├── ready/page.js      # Konfirmasi registrasi selesai
│   └── support/page.js    # DEV PREVIEW ONLY (bukan route produksi)
│
├── services/              # Semua API call (1 file per domain)
│   ├── accountService.js  # GET /me
│   ├── campaignService.js # GET /creators/{slug}/campaigns
│   ├── creatorService.js  # GET /creators/{slug}
│   ├── dashboardService.js# GET /me/summary, GET /me/supports
│   ├── donationService.js # POST /donations, GET /donations/{ref}
│   ├── pageSettingsService.js # PATCH /support-pages/me
│   ├── registerService.js # POST /support-pages
│   ├── supportService.js  # Orchestrator: submit support → donasi → payment
│   └── supportsClientService.js # GET /me/supports (browser pagination)
│
├── lib/
│   ├── api.js             # HTTP client (timeout, error handling)
│   ├── config.js          # Env vars & feature flags
│   ├── validators.js      # Validasi slug, handle, contact, reference
│   └── safeUrl.js         # Sanitasi URL gambar dari API
│
└── constants/
    ├── routes.js           # Semua path konstanta
    └── supportAmounts.js   # Min/max/preset nominal support
```

---

## 3. API Contract Lengkap

Semua request menggunakan base URL dari `NEXT_PUBLIC_API_URL`.
Auth menggunakan **session cookie** (`credentials: "include"`).
Backend **wajib** mengatur CORS dengan `Access-Control-Allow-Credentials: true` dan origin spesifik (bukan `*`).

### 3.1 Akun (`accountService.js`)

```
GET /me
Cookie: <session>
→ 200 {
    name:      string,
    username?: string,   // dipakai sebagai default slug
    avatarUrl: string,
    pageSlug?: string    // slug support page yang sudah dimiliki
  }
→ 401  → redirect ke NEXT_PUBLIC_LOGIN_URL
```

### 3.2 Registrasi (`registerService.js`)

```
POST /support-pages
Content-Type: multipart/form-data
Cookie: <session>
Fields:
  slug      string  (3–30 karakter, [A-Za-z0-9._-])
  bio       string  (max 300 karakter)
  instagram string  (username, opsional)
  tiktok    string  (username, opsional)
  facebook  string  (username, opsional)
  photo     File    (JPG/PNG, max 1 MB)

→ 201 { slug: string }
→ 409 { code: "SLUG_TAKEN" }
→ 422 { message: string }
```

### 3.3 Pengaturan Halaman (`pageSettingsService.js`)

```
PATCH /support-pages/me
Content-Type: multipart/form-data
Cookie: <session>
Fields:
  bio       string  (max 300 karakter)
  instagram string  (opsional)
  tiktok    string  (opsional)
  facebook  string  (opsional)
  photo?    File    (JPG/PNG, max 5 MB — hanya jika ganti foto)

→ 200
→ 422 { message: string }
```

> **Catatan:** Jika `photo` tidak disertakan, backend harus mempertahankan foto yang ada (tidak menghapusnya).

### 3.4 Profil Creator Publik (`creatorService.js`)

```
GET /creators/{slug}
→ 200 {
    name:           string,
    role:           string,
    bio:            string,
    isVerified:     boolean,
    coverImageUrl:  string,  // https atau path relatif
    avatarImageUrl: string,
    socials: {
      instagram?: string,
      tiktok?:   string,
      facebook?: string
    },
    campaignCount?: number   // opsional; jika tidak ada, frontend fetch campaigns
  }
→ 404  → halaman not found

GET /creators/{slug}/campaigns
→ 200 [{
    id:               string | number,
    title:            string,
    imageUrl:         string,
    daysLeft:         number,
    collectedAmount:  number,
    targetAmount:     number
  }]
```

### 3.5 Donasi / Support (`donationService.js`, `supportService.js`)

```
POST /donations
Content-Type: application/json
Body: {
  creatorSlug: string,
  amount:      number,   // integer Rupiah, harus di dalam batas backend
  message?:    string    // max 500 karakter
}
→ 201 { reference: string }  // [A-Za-z0-9_-]{6,64}
→ 422 { message: string }

GET /donations/{reference}
Cookie: <session>  (opsional, tergantung kebutuhan backend)
→ 200 {
    reference:    string,
    amount:       number,
    paymentLabel: string,   // "Transfer Bank", "QRIS", dll.
    status:       "pending" | "success" | "failed",
    campaign: {
      organizer:           string,
      isOrganizerVerified: boolean,
      title:               string,
      thumbnailUrl:        string,
      daysLeft:            number,
      collectedAmount:     number,
      targetAmount:        number,
      thanksText:          string
    }
  }
→ 404
```

### 3.6 Dashboard (`dashboardService.js`, `supportsClientService.js`)

```
GET /me/summary
Cookie: <session>
→ 200 {
    isActive:       boolean,
    totalGift:      number,
    supporterCount: number,
    activities: [{
      id:      string | number,
      name:    string,
      amount:  number,
      message: string
    }]
  }
→ 401 | 404

GET /me/supports?filter=all|gift|message&cursor=&limit=20
Cookie: <session>
→ 200 {
    totalSupport: number,
    items: [{
      id:        string | number,
      name:      string,
      amount:    number,
      message:   string,
      createdAt: string   // ISO 8601
    }],
    nextCursor?: string   // kosong jika halaman terakhir
  }
→ 401 | 404
```

---

## 4. Yang Perlu Diselesaikan

### ❌ Halaman Pembayaran (`app/payment/page.js`)

Scaffold sudah siap: membaca donasi dari `GET /donations/{ref}`, menampilkan nominal dan status.
**Yang belum ada:** UI instruksi pembayaran (virtual account, QRIS, dsb.).

Langkah:
1. Pilih dan integrasi payment gateway (Midtrans / Xendit / dll.)
2. Tambahkan komponen UI di dalam blok `{/* PLACEHOLDER */}` di `payment/page.js`
3. Tambahkan polling atau webhook handler untuk update status donasi

### ⏳ Konfirmasi & Success Page

Route `/confirm` dan `/success` ada di `constants/routes.js` tapi belum punya halaman.
Perlu dibuat sesuai flow payment gateway yang dipilih.

---

## 5. Cara Kerja Mock Mode

Mock mode aktif ketika `NEXT_PUBLIC_API_URL` kosong (development) atau `NEXT_PUBLIC_ENABLE_MOCKS=true`.

| File mock | Dipakai oleh |
|---|---|
| `src/data/mockAccount.js` | `accountService.getAccount` |
| `src/data/mockCreator.js` | `creatorService.getCreator` |
| `src/data/mockCampaigns.js` | `creatorService.getCampaigns` |
| `src/data/mockDashboard.js` | `dashboardService.*` |
| `src/data/mockDonationCampaign.js` | `donationService.getDonation` |

Mock profile (registrasi & edit) disimpan di `localStorage` via `src/lib/mockProfileStore.js`.

---

## 6. Validasi Input (Shared)

Semua validasi ada di `src/lib/validators.js` — dipakai di client form **dan** server page.

| Fungsi | Dipakai di |
|---|---|
| `validateSlug(slug)` | `RegisterForm`, `app/[slug]/page.js`, `app/ready/page.js` |
| `sanitizeSlugInput(value)` | Input slug real-time |
| `normalizeHandle(raw)` | Form social media |
| `validateContact(raw)` | Form donasi (WhatsApp/email) |
| `isValidReference(value)` | `app/payment/page.js`, `donationService.js` |

---

## 7. Environment Variables

Lihat [`.env.example`](.env.example) untuk daftar lengkap dengan penjelasan.

| Variabel | Wajib produksi | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | URL backend tanpa trailing slash |
| `NEXT_PUBLIC_SITE_URL` | ✅ | URL app untuk share link & metadata |
| `NEXT_PUBLIC_LOGIN_URL` | ✅ | Redirect saat 401 dari API |
| `NEXT_PUBLIC_CS_WHATSAPP_URL` | ❌ | Tombol bantuan disembunyikan jika kosong |
