// Placeholder campaign data. The real list will come from the API.
export const mockCampaigns = Array.from({ length: 4 }, (_, index) => ({
  id: `campaign-${index + 1}`,
  title: "Bantu Pengungsi Rohingya Bertahan",
  imageUrl: "",
  campaignUrl: "",
  daysLeft: 75,
  collectedAmount: 6191633,
  targetAmount: 75000000,
}));
