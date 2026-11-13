import { Suspense } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SupportForm from "@/components/support/SupportForm";
import CampaignListSection from "@/components/campaign/CampaignListSection";
import { mockCreator } from "@/data/mockCreator";

export default function SupportPage() {
  const creator = mockCreator;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[414px] bg-surface md:border-x md:border-[#E5F5FF] md:shadow-[0_0_40px_rgba(9,31,64,0.08)]">
      <ProfileHeader creator={creator} />
      <SupportForm creatorName={creator.name} />
      <Suspense fallback={null}>
        <CampaignListSection />
      </Suspense>
    </main>
  );
}
