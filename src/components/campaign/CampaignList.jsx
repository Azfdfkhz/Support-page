import CampaignCard from "./CampaignCard";

export default function CampaignList({ campaigns }) {
  if (!campaigns?.length) return null;

  return (
    <section aria-labelledby="campaign-title" className="mt-6 px-4 pb-10">
      <h2 id="campaign-title" className="text-center text-[17px] font-bold text-ink">
        Campaign
      </h2>
      <ul className="mt-2 divide-y divide-line">
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            <CampaignCard {...campaign} />
          </li>
        ))}
      </ul>
    </section>
  );
}
