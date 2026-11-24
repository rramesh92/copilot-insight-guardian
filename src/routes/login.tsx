import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { oauthReturnPath } from "@/lib/oauth-return-path";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search["next"] === "string" ? search["next"] : "/",
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Shift Insight AI" },
      { name: "description", content: "Sign in to review an assistant's requested access to Shift Insight AI." },
      { property: "og:title", content: "Sign in — Shift Insight AI" },
      { property: "og:description", content: "Sign in to review an assistant's requested access to Shift Insight AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { next } = Route.useSearch();
  const nextPath = oauthReturnPath(next);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) window.location.replace(nextPath);
    });
    return () => {
      active = false;
    };
  }, [nextPath]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        window.location.replace(nextPath);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: new URL(nextPath, window.location.origin).href,
        },
      });
      if (signUpError) throw signUpError;
      if (data.session) {
        window.location.replace(nextPath);
        return;
      }

      setNotice("Check your email to confirm your account. This request will reopen after confirmation.");
    } catch {
      setError(
        mode === "signin"
          ? "We couldn't sign you in. Check your email and password, then try again."
          : "We couldn't create the account. Check the details and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-md rounded-md border border-border bg-card p-6 shadow-sm sm:p-8">
        <Link to="/" className="text-sm font-semibold text-primary hover:underline">
          FISDAP · Shift Insight AI
        </Link>
        <h1 className="mt-6 text-2xl font-semibold">Connect your account</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Sign in to review and approve an assistant connection request.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2" role="tablist" aria-label="Account access">
          <Button
            type="button"
            variant={mode === "signin" ? "default" : "outline"}
            role="tab"
            aria-selected={mode === "signin"}
            onClick={() => {
              setMode("signin");
              setError(null);
              setNotice(null);
            }}
          >
            Sign in
          </Button>
          <Button
            type="button"
            variant={mode === "signup" ? "default" : "outline"}
            role="tab"
            aria-selected={mode === "signup"}
            onClick={() => {
              setMode("signup");
              setError(null);
              setNotice(null);
            }}
          >
            Create account
          </Button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          {notice && <p className="text-sm text-success" role="status">{notice}</p>}

          <Button className="w-full" type="submit" disabled={busy}>
            {busy ? "Please wait…" : mode === "signin" ? "Continue" : "Create account"}
          </Button>
        </form>

        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          Account confirmation is required for new registrations. Your assistant request will return after confirmation.
        </p>
      </section>
    </main>
  );
}