"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import PageSkeleton from "@/components/onboarding/PageSkeleton";
import ProgressLine from "@/components/onboarding/ProgressLine";
import ReadyActions from "@/components/onboarding/ReadyActions";
import { assetPath } from "@/lib/config";
import { REGISTER_PATH } from "@/constants/routes";
import { validateSlug } from "@/lib/validators";

export default function ReadyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const isValid = typeof slug === "string" && !validateSlug(slug);

  useEffect(() => {
    if (!isValid) {
      router.replace(REGISTER_PATH);
    }
  }, [isValid, router]);

  if (!isValid) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex flex-1 flex-col px-5 pb-8 pt-5">
      <ProgressLine progress={1} label="Langkah 2 dari 2" />

      <div className="mt-10 flex flex-col items-center text-center">
        <div className="relative size-[15rem]">
          <Image src={assetPath("/Support-success-card-with-gift.png")} alt="" fill priority sizes="240px" className="object-contain" />
        </div>
        <h1 className="mt-8 text-[1.5rem] font-bold leading-tight text-ink">
          Support Page siap! <span aria-hidden="true">🎉</span>
        </h1>
        <p className="mt-2 max-w-[18.75rem] text-sm leading-relaxed text-muted">
          Bagikan tautanmu agar lebih banyak orang menemukan halaman ini.
        </p>
      </div>

      <ReadyActions slug={slug} />
    </div>
  );
}
