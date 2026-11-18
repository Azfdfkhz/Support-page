import CampaignCard from "./CampaignCard";

export default function CampaignList({ campaigns }) {
  return (
    <section aria-labelledby="campaign-title" className="mt-6 px-4 pb-10">
      <h2 id="campaign-title" className="text-center text-[1.0625rem] font-bold text-ink">
        Campaign
      </h2>
      {campaigns?.length ? (
        <ul className="mt-2 divide-y divide-line">
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <CampaignCard {...campaign} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-center text-sm text-muted">Belum ada campaign aktif.</p>
      )}
    </section>
  );
}
