import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SupportForm from "@/components/support/SupportForm";
import CampaignListSection from "@/components/campaign/CampaignListSection";
import PageSkeleton from "@/components/onboarding/PageSkeleton";
import { validateSlug } from "@/lib/validators";
import { getCreator } from "@/services/creatorService";

export const metadata = { title: "Support Page" };

async function CreatorContent({ params }) {
  const { slug } = await params;
  // Invalid or reserved slugs (e.g. /robots.txt) are a plain 404.
  if (validateSlug(slug)) notFound();

  const creator = await getCreator(slug);
  if (!creator) notFound();

  return (
    <>
      <ProfileHeader creator={creator} />
      <SupportForm creatorName={creator.name} creatorSlug={slug} />
      <Suspense fallback={null}>
        <CampaignListSection slug={slug} />
      </Suspense>
    </>
  );
}

export default function CreatorPage({ params }) {
  return (
    <main className="app-shell bg-surface md:border-x md:border-[#E5F5FF] md:shadow-[0_0_40px_rgba(9,31,64,0.08)]">
      <Suspense fallback={<PageSkeleton />}>
        <CreatorContent params={params} />
      </Suspense>
    </main>
  );
}
