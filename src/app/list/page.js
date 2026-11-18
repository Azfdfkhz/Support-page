import { Suspense } from "react";
import Shell from "@/components/onboarding/Shell";
import PageSkeleton from "@/components/onboarding/PageSkeleton";
import RegisterForm from "@/components/onboarding/RegisterForm";
import { getAccount } from "@/services/accountService";

export const metadata = { title: "Daftar Support Page", robots: { index: false } };

async function RegisterContent() {
  const account = await getAccount();
  return <RegisterForm account={account} />;
}

export default function RegisterPage() {
  return (
    <Shell>
      <Suspense fallback={<PageSkeleton />}>
        <RegisterContent />
      </Suspense>
    </Shell>
  );
}
