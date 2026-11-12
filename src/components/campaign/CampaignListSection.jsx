import { getCampaigns } from "@/services/campaignService";
import CampaignList from "./CampaignList";

// Server component: loads campaigns (API later) and hands them to the list.
export default async function CampaignListSection() {
  const campaigns = await getCampaigns();
  return <CampaignList campaigns={campaigns} />;
}
