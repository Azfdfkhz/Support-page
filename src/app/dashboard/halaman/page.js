import PageSettingsView from "@/components/dashboard/PageSettingsView";
import { pageSlug } from "@/lib/slug";
import { redirect } from "next/navigation";
import { REGISTER_PATH } from "@/constants/routes";
import { USE_MOCKS } from "@/lib/config";
import { getAccount } from "@/services/accountService";
import { getCreator } from "@/services/creatorService";

export const metadata = { title: "Halaman" };

export default async function DashboardPageSettingsPage() {
  const account = await getAccount();
  const slug = pageSlug(account);
  const creator = slug ? await getCreator(slug) : null;
  // With the API, an account without a support page goes to registration (demo mode keeps its page in the browser).
  if (!USE_MOCKS && !creator) redirect(REGISTER_PATH);

  const initial = {
    bio: creator?.bio ?? "",
    socials: creator?.socials ?? { instagram: "", tiktok: "", facebook: "" },
    coverImageUrl: creator?.coverImageUrl ?? "",
  };

  return (
    <div className="mx-auto w-full max-w-[60rem] md:mx-0">
      <h1 className="text-[1.75rem] font-bold leading-tight text-ink md:text-[2rem]">Halaman</h1>
      <p className="mt-1 text-base text-muted">Kelola Support Page kamu.</p>
      <PageSettingsView account={account} slug={slug} serverInitial={initial} />
    </div>
  );
}
