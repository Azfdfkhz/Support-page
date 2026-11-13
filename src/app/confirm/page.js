import { Suspense } from "react";
import { redirect } from "next/navigation";
import Shell from "@/components/onboarding/Shell";
import PageSkeleton from "@/components/onboarding/PageSkeleton";
import ConfirmForm from "@/components/confirm/ConfirmForm";
import { INTRO_PATH, creatorPath } from "@/constants/routes";
import { MAX_SUPPORT_AMOUNT, MIN_SUPPORT_AMOUNT } from "@/constants/supportAmounts";
import { validateSlug } from "@/lib/validators";

export const metadata = { title: "Pilih Opsi Pembayaran", robots: { index: false } };

async function ConfirmContent({ searchParams }) {
  const { creator, amount, message } = await searchParams;

  // Without a valid creator and amount the user did not come from a creator page.
  if (typeof creator !== "string" || validateSlug(creator)) redirect(INTRO_PATH);
  const value = typeof amount === "string" && /^\d{1,10}$/.test(amount) ? Number(amount) : 0;
  if (value < MIN_SUPPORT_AMOUNT || value > MAX_SUPPORT_AMOUNT) redirect(creatorPath(creator));

  return (
    <ConfirmForm
      creatorSlug={creator}
      amount={value}
      initialPrayer={typeof message === "string" ? message.slice(0, 500) : ""}
    />
  );
}

export default function ConfirmPage({ searchParams }) {
  return (
    <Shell>
      <Suspense fallback={<PageSkeleton />}>
        <ConfirmContent searchParams={searchParams} />
      </Suspense>
    </Shell>
  );
}
