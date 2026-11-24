import { useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type OAuthAuthorizationPayload = {
  redirect_url?: string;
  redirect_to?: string;
  client?: { name?: string };
  redirect_uri?: string;
  scope?: string;
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

function readOAuthPayload(value: unknown): OAuthAuthorizationPayload {
  const source = asRecord(value);
  if (!source) return {};

  const payload: OAuthAuthorizationPayload = {};
  const redirectUrl = source["redirect_url"];
  const redirectTo = source["redirect_to"];
  const redirectUri = source["redirect_uri"];
  const scope = source["scope"];
  if (typeof redirectUrl === "string") payload.redirect_url = redirectUrl;
  if (typeof redirectTo === "string") payload.redirect_to = redirectTo;
  if (typeof redirectUri === "string") payload.redirect_uri = redirectUri;
  if (typeof scope === "string") payload.scope = scope;

  const rawClient = asRecord(source["client"]);
  if (rawClient) {
    const client: { name?: string } = {};
    if (typeof rawClient["name"] === "string") client.name = rawClient["name"];
    payload.client = client;
  }
  return payload;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    authorization_id:
      typeof search["authorization_id"] === "string" ? search["authorization_id"] : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("This connection request is missing its identifier.");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/login", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id");
    if (!authorizationId) throw new Error("This connection request is missing its identifier.");

    const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
    if (error) throw new Error("This connection request could not be loaded.");
    const details = readOAuthPayload(data);
    const immediate = details.redirect_url ?? details.redirect_to;
    if (immediate && !details.client) throw redirect({ href: immediate });

    const { data: sessionData } = await supabase.auth.getSession();
    return { details, email: sessionData.session?.user.email ?? null };
  },
  head: () => ({
    meta: [
      { title: "Review assistant access — Shift Insight AI" },
      { name: "description", content: "Review and approve an assistant's requested access to Shift Insight AI." },
      { property: "og:title", content: "Review assistant access — Shift Insight AI" },
      { property: "og:description", content: "Review and approve an assistant's requested access to Shift Insight AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  errorComponent: ConsentLoadError,
  component: ConsentPage,
});

function ConsentLoadError() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-md rounded-md border border-border bg-card p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Connection request unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This request may have expired. Start a new connection from your assistant.
        </p>
        <Link to="/" className="mt-5 inline-block text-sm font-medium text-primary hover:underline">
          Return to Shift Insight AI
        </Link>
      </section>
    </main>
  );
}

function ConsentPage() {
  const { authorization_id: authorizationId } = Route.useSearch();
  const { details, email } = Route.useLoaderData();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientName = details?.client?.name ?? "An external assistant";
  const redirectUri = details?.redirect_uri ?? null;
  const scopes =
    typeof details?.scope === "string" ? details.scope.split(/\s+/).filter(Boolean) : [];

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    try {
      const result = approve
        ? await supabase.auth.oauth.approveAuthorization(authorizationId)
        : await supabase.auth.oauth.denyAuthorization(authorizationId);
      if (result.error) throw result.error;
      const response = readOAuthPayload(result.data);
      const target = response.redirect_url ?? response.redirect_to;
      if (!target) throw new Error("No return address was provided.");
      window.location.assign(target);
    } catch {
      setError(approve ? "We couldn't approve this connection. Try again." : "We couldn't cancel this connection. Try again.");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-xl rounded-md border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6 sm:p-8">
          <Link to="/" className="text-sm font-semibold text-primary hover:underline">
            FISDAP · Shift Insight AI
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase text-muted-foreground">Connection request</p>
          <h1 className="mt-2 text-2xl font-semibold">Connect {clientName} to Shift Insight AI</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This lets {clientName} use this app's enabled tools while you are signed in.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div>
            <h2 className="text-sm font-semibold">Signed-in account</h2>
            <p className="mt-1 text-sm text-muted-foreground">{email ?? "Signed-in account"}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Assistant destination</h2>
            <p className="mt-1 break-all text-sm text-muted-foreground">
              {redirectUri ?? "Verified by the authorization service"}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Requested account details</h2>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {scopes.length > 0 ? scopes.map((scope) => (
                <li key={scope}>
                  {scope === "openid" ? "Confirm your sign-in" : scope === "email" ? "Share your email address" : scope === "profile" ? "Share your basic profile" : `Additional permission requested: ${scope}`}
                </li>
              )) : <li>Basic account identity</li>}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Tools this connection can use</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>View the instructor shift queue</li>
              <li>Read an approved student feedback report</li>
              <li>Check a student's clinical requirements</li>
            </ul>
          </div>

          <p className="rounded-md bg-muted px-3 py-2 text-xs leading-5 text-muted-foreground">
            These read-only tools return built-in prototype data; they do not access live patient records.
          </p>

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <Button type="button" disabled={busy} onClick={() => void decide(true)}>
              {busy ? "Please wait…" : "Approve connection"}
            </Button>
            <Button type="button" variant="outline" disabled={busy} onClick={() => void decide(false)}>
              Cancel connection
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}