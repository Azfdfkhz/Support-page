import { Suspense } from "react";
import Shell from "@/components/onboarding/Shell";
import PageSkeleton from "@/components/onboarding/PageSkeleton";
import ReadyClient from "./ReadyClient";

export const metadata = { title: "Support Page siap!", robots: { index: false } };

export default function ReadyPage() {
  return (
    <Shell>
      <Suspense fallback={<PageSkeleton />}>
        <ReadyClient />
      </Suspense>
    </Shell>
  );
}
