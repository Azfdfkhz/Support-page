"use client";

import SupportForm from "@/components/support/SupportForm";
import ProfileHeader from "./ProfileHeader";
import ProfileSkeleton from "./ProfileSkeleton";
import { useMockProfile } from "./useMockProfile";

/**
 * Body of the public support page: header, support form and (when there are any) the campaigns.
 * `children` is the campaigns section; the server only passes it when the creator has campaigns.
 *
 * In demo mode (no API) the page created in this browser replaces the placeholder creator, and a
 * brand-new page shows no campaigns. With a real API this is a plain pass-through.
 */
export default function ProfileView({ slug, creator, children }) {
  const local = useMockProfile(slug);
  if (local === undefined) return <ProfileSkeleton />;

  const view = local ?? creator;
  return (
    <>
      <ProfileHeader creator={view} slug={slug} />
      <SupportForm creatorName={view.name} creatorSlug={slug} />
      {local ? null : children}
    </>
  );
}
