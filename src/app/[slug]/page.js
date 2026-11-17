import { Suspense } from "react";
import { notFound } from "next/navigation";
import CampaignListSection from "@/components/campaign/CampaignListSection";
import CampaignListSkeleton from "@/components/campaign/CampaignListSkeleton";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ProfileView from "@/components/profile/ProfileView";
import { validateSlug } from "@/lib/validators";
import { getCreator } from "@/services/creatorService";

export const metadata = { title: "Support Page" };

async function CreatorContent({ params }) {
  const { slug } = await params;
  // Invalid or reserved slugs (e.g. /robots.txt) are a plain 404.
  if (validateSlug(slug)) notFound();

  const creator = await getCreator(slug);
  if (!creator) notFound();

  // The campaign section only exists for creators that have campaigns. When the API does not say
  // (no campaignCount), it is rendered and hides itself if the list comes back empty.
  const hasCampaigns = creator.campaignCount === undefined || creator.campaignCount > 0;

  return (
    <ProfileView slug={slug} creator={creator}>
      {hasCampaigns ? (
        <Suspense fallback={<CampaignListSkeleton />}>
          <CampaignListSection slug={slug} />
        </Suspense>
      ) : null}
    </ProfileView>
  );
}

export default function CreatorPage({ params }) {
  return (
    <main className="app-shell bg-surface md:border-x md:border-[#E5F5FF] md:shadow-[0_0_2.5rem_rgba(9,31,64,0.08)]">
      <Suspense fallback={<ProfileSkeleton />}>
        <CreatorContent params={params} />
      </Suspense>
    </main>
  );
}
