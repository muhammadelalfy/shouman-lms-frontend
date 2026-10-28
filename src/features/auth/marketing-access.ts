import "server-only";
import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/auth/session";
import { getCurrentUser } from "@/features/account/api";
import { isApiError } from "@/lib/api/errors";
import { marketingHref, type MarketingPageId } from "@/features/marketing/routes";

const protectedDiscovery = new Set<string>(["orientation", "tracks", "challenges", "scholarships"]);
/** Gate the four landing discoveries on the server, including direct URL requests. */
export async function verifyMarketingAccess(id: string): Promise<"available" | "unavailable" | "forbidden"> {
  if (!protectedDiscovery.has(id)) return "available";
  const login = `/auth/login?redirectTo=${encodeURIComponent(marketingHref(id as MarketingPageId))}`;
  const token = await getSessionToken();
  if (!token) redirect(login);
  try {
    await getCurrentUser(token);
  } catch (error) {
    if (isApiError(error) && error.status === 401) redirect(`${login}&expired=1`);
    return isApiError(error) && error.status === 403 ? "forbidden" : "unavailable";
  }
  return "available";
}
