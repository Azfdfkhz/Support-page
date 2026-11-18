import { Suspense } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SupportForm from "@/components/support/SupportForm";
import CampaignListSection from "@/components/campaign/CampaignListSection";
import CampaignListSkeleton from "@/components/campaign/CampaignListSkeleton";
import { mockCreator } from "@/data/mockCreator";

const MOCK_SLUG = "naya";

export const metadata = {
  title: `Support ${mockCreator.name}`,
  description: `Dukung ${mockCreator.name} melalui Sharing Happiness. ${mockCreator.bio ?? ""}`.trim(),
};

export default function SupportPage() {
  const creator = mockCreator;

  return (
    <main className="app-shell bg-surface md:border-x md:border-[#E5F5FF] md:shadow-[0_0_40px_rgba(9,31,64,0.08)]">
      <ProfileHeader creator={creator} slug={MOCK_SLUG} />
      <SupportForm creatorName={creator.name} creatorSlug={MOCK_SLUG} />
      <Suspense fallback={<CampaignListSkeleton />}>
        <CampaignListSection slug={MOCK_SLUG} />
      </Suspense>
    </main>
  );
}
