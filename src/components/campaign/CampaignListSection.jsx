import { getCampaigns } from "@/services/creatorService";
import CampaignList from "./CampaignList";

// Server component: loads the creator's campaigns and hands them to the list.
// The list is secondary content, so a failing campaigns request hides the section
// instead of replacing the whole page with the error screen.
export default async function CampaignListSection({ slug }) {
  let campaigns = [];
  try {
    campaigns = await getCampaigns(slug);
  } catch (error) {
    console.error("Failed to load campaigns", { slug, code: error?.code, status: error?.status });
  }
  return <CampaignList campaigns={campaigns} />;
}
