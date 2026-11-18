import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Shell from "@/components/onboarding/Shell";
import PageSkeleton from "@/components/onboarding/PageSkeleton";
import ShareCampaignButton from "@/components/success/ShareCampaignButton";
import CampaignProgress from "@/components/campaign/CampaignProgress";
import VerifiedIcon from "@/components/icons/VerifiedIcon";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { INTRO_PATH, creatorPath } from "@/constants/routes";
import { CS_WHATSAPP_URL, SITE_URL } from "@/lib/config";
import { isValidReference, validateSlug } from "@/lib/validators";
import { getDonation } from "@/services/donationService";
import { formatCurrency } from "@/utils/formatCurrency";

export const metadata = { title: "Pembayaran donasi berhasil", robots: { index: false } };

async function SuccessContent({ searchParams }) {
  const { ref, creator, amount } = await searchParams;
  if (!isValidReference(ref) || typeof creator !== "string" || validateSlug(creator)) redirect(INTRO_PATH);

  // The amount in the URL is only used in mock mode; with an API the server value is shown.
  const mockAmount = typeof amount === "string" && /^\d{1,10}$/.test(amount) ? Number(amount) : 0;
  const donation = await getDonation(ref, mockAmount);
  if (!donation) notFound();

  const { campaign } = donation;
  const percent = campaign.targetAmount > 0 ? (campaign.collectedAmount / campaign.targetAmount) * 100 : 0;
  const shareUrl = `${SITE_URL}${creatorPath(creator)}`;

  return (
    <>
      <section className="flex min-h-[15.625rem] items-start justify-between overflow-hidden pl-5">
        <div className="pt-12">
          <h1 className="text-[1.375rem] font-semibold leading-tight text-ink">
            Pembayaran donasi
            <br />
            berhasil
          </h1>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
            Terima kasih, donasi
            <br />
            Anda telah kami terima.
          </p>
        </div>
        <div className="relative mt-16 h-[6.25rem] w-[12.25rem] shrink-0">
          <Image src="/success.png" alt="" fill priority sizes="196px" className="object-contain object-right-bottom" />
        </div>
      </section>

      <section aria-labelledby="detail-title" className="bg-[#F5F7FA] px-4 py-4">
        <h2 id="detail-title" className="text-sm font-semibold text-ink">Detail transaksi</h2>
        <dl className="mt-3 space-y-3 text-[0.8125rem]">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Nominal</dt>
            <dd className="text-2xl font-semibold leading-none text-ink">{formatCurrency(donation.amount, { spaced: true })}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">No. donasi</dt>
            <dd className="break-all text-right font-medium text-ink">{donation.reference}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Pembayaran via</dt>
            <dd className="font-medium text-ink">{donation.paymentLabel}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted">Status</dt>
            <dd className="rounded-full bg-emerald-50 px-3.5 py-1 font-medium text-[#059669]">Berhasil</dd>
          </div>
        </dl>
      </section>

      <div className="px-5 pt-4">
        <ShareCampaignButton title={campaign.title} url={shareUrl} />
        <Link href={INTRO_PATH} className="mt-3 block text-center text-sm font-semibold text-brand">
          Kembali ke Beranda
        </Link>

        <section className="mt-4 rounded-2xl border border-[#a8d8bb] bg-white p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
              <path d="m5 12.5 4.5 4.5L19 7" />
            </svg>
            Terima kasih, Teman Berbagi!
          </h2>
          {campaign.thanksText ? <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted">{campaign.thanksText}</p> : null}
          <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted">
            Simpan nomor donasi Anda. Jika membutuhkan bantuan, silakan hubungi CS.
          </p>
        </section>

        <div className={`mt-3 grid gap-3 ${CS_WHATSAPP_URL ? "grid-cols-[1fr_1.5fr]" : "grid-cols-1"}`}>
          {CS_WHATSAPP_URL ? (
            <a
              href={CS_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#3D9A52] bg-white text-[0.9375rem] font-semibold text-[#3D9A52]"
            >
              <WhatsAppIcon className="size-5" />
              Kontak CS
            </a>
          ) : null}
          <Link href={creatorPath(creator)} className="flex h-12 items-center justify-center rounded-xl bg-brand text-[0.9375rem] font-semibold text-white">
            Halaman Campaign
          </Link>
        </div>

        <article className="mt-4 flex gap-3">
          <div className="relative size-[5.5rem] shrink-0 overflow-hidden rounded-md bg-slate-200">
            {campaign.thumbnailUrl ? <Image src={campaign.thumbnailUrl} alt="" fill unoptimized sizes="88px" className="object-cover" /> : null}
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Image src="/play.png" alt="" width={34} height={34} className="size-[2.125rem] opacity-80" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span className="truncate">{campaign.organizer}</span>
              {campaign.isOrganizerVerified ? <VerifiedIcon className="size-3.5 shrink-0 text-[#059669]" /> : null}
            </p>
            <h3 className="mt-1 text-[0.9375rem] leading-snug text-ink">{campaign.title}</h3>
          </div>
        </article>

        <div className="mt-3 pb-8">
          <CampaignProgress percent={percent} />
          <dl className="mt-2.5 flex justify-between">
            <div>
              <dt className="text-xs text-muted">Sisa Waktu</dt>
              <dd className="text-sm font-semibold text-ink">{campaign.daysLeft} hari</dd>
            </div>
            <div className="text-right">
              <dt className="text-xs text-muted">Terkumpul</dt>
              <dd className="text-sm font-semibold text-ink">{formatCurrency(campaign.collectedAmount, { spaced: true })}</dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}

export default function PaymentSuccessPage({ searchParams }) {
  return (
    <Shell>
      <Suspense fallback={<PageSkeleton />}>
        <SuccessContent searchParams={searchParams} />
      </Suspense>
    </Shell>
  );
}
