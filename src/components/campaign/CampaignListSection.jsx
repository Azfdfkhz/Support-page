import { getCampaigns } from "@/services/creatorService";
import CampaignList from "./CampaignList";

// Server component: loads the creator's campaigns and hands them to the list.
export default async function CampaignListSection({ slug }) {
  const campaigns = await getCampaigns(slug);
  return <CampaignList campaigns={campaigns} />;
}
