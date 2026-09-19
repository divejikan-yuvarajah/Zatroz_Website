"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { TextInput } from "@/components/forms/text-input";
import { InlineStatus } from "@/components/forms/inline-status";
import { authClient } from "@/lib/auth-client";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(
          result.error.message?.trim() ||
            "Sign-in failed. Check your email and password.",
        );
        return;
      }

      const data = result.data as { twoFactorRedirect?: boolean } | null;
      if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
        router.push("/admin/mfa");
        router.refresh();
        return;
      }

      // Password-only session — MFA enrollment required before content admin.
      router.push("/admin/mfa");
      router.refresh();
    } catch {
      setError("Sign-in is temporarily unavailable. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="mx-auto flex w-full max-w-md flex-col gap-6"
      onSubmit={onSubmit}
      noValidate
    >
      <FormField id="admin-email" label="Work email" required>
        {(control) => (
          <TextInput
            {...control}
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        )}
      </FormField>

      <FormField id="admin-password" label="Password" required>
        {(control) => (
          <TextInput
            {...control}
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={12}
          />
        )}
      </FormField>

      {error ? <InlineStatus tone="error">{error}</InlineStatus> : null}

      <Button type="submit" loading={loading} loadingLabel="Signing in">
        Sign in
      </Button>
    </form>
  );
}
