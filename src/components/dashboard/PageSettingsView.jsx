"use client";

import { useMockProfile } from "@/components/profile/useMockProfile";
import { extractHandle } from "@/lib/socials";
import PageSettingsForm from "./PageSettingsForm";

function FormSkeleton() {
  return (
    <div aria-busy="true" className="mt-6 space-y-5 md:mt-8">
      <div className="h-24 animate-pulse rounded-[1.25rem] bg-skeleton" />
      <div className="h-64 animate-pulse rounded-[1.25rem] bg-skeleton" />
    </div>
  );
}

/**
 * In demo mode (no API) the page registered in this browser is what the settings form shows and
 * edits, exactly like the public page does. With a real API it passes `serverInitial` straight through.
 */
export default function PageSettingsView({ account, slug, serverInitial }) {
  const local = useMockProfile(slug);
  if (local === undefined) return <FormSkeleton />;

  const source = local ? { bio: local.bio, socials: local.socials, coverImageUrl: local.coverImageUrl } : serverInitial;
  // The form edits usernames; the API may have stored full profile links.
  const initial = {
    ...source,
    socials: {
      instagram: extractHandle(source.socials.instagram),
      tiktok: extractHandle(source.socials.tiktok),
      facebook: extractHandle(source.socials.facebook),
    },
  };
  return <PageSettingsForm account={account} slug={slug} initial={initial} />;
}
