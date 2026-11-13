import { Suspense } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import Shell from "@/components/onboarding/Shell";
import PageSkeleton from "@/components/onboarding/PageSkeleton";
import ProgressLine from "@/components/onboarding/ProgressLine";
import ReadyActions from "@/components/onboarding/ReadyActions";
import { REGISTER_PATH } from "@/constants/routes";
import { validateSlug } from "@/lib/validators";

export const metadata = { title: "Support Page siap!", robots: { index: false } };

async function ReadyContent({ searchParams }) {
  const { slug } = await searchParams;
  // Only reachable after registering; anything else goes back to the form.
  if (typeof slug !== "string" || validateSlug(slug)) redirect(REGISTER_PATH);

  return (
    <div className="flex flex-1 flex-col px-5 pb-8 pt-5">
      <ProgressLine progress={1} label="Langkah 2 dari 2" />

      <div className="mt-14 flex flex-col items-center text-center">
        <div className="relative size-[170px]">
          <Image src="/Support-success-card-with-gift.png" alt="" fill priority sizes="170px" className="object-contain" />
        </div>
        <h1 className="mt-10 text-[22px] font-bold leading-tight text-ink">
          Support Page siap! <span aria-hidden="true">🎉</span>
        </h1>
        <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-muted">
          Bagikan tautanmu agar lebih banyak orang menemukan halaman ini.
        </p>
      </div>

      <ReadyActions slug={slug} />
    </div>
  );
}

export default function ReadyPage({ searchParams }) {
  return (
    <Shell>
      <Suspense fallback={<PageSkeleton />}>
        <ReadyContent searchParams={searchParams} />
      </Suspense>
    </Shell>
  );
}
