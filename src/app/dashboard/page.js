import { redirect } from "next/navigation";
import { DASHBOARD_SUMMARY_PATH } from "@/constants/routes";

// /dashboard has no page of its own: it opens the summary.
export default function DashboardIndexPage() {
  redirect(DASHBOARD_SUMMARY_PATH);
}
