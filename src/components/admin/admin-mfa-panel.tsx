"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { TextInput } from "@/components/forms/text-input";
import { InlineStatus } from "@/components/forms/inline-status";
import { extractTotpSecretFromUri } from "@/lib/admin/totp-uri";
import { authClient } from "@/lib/auth-client";

type MfaMode = "loading" | "challenge" | "enroll" | "signed-out";

export function AdminMfaPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<MfaMode>("loading");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [enrollCode, setEnrollCode] = useState("");
  const [password, setPassword] = useState("");
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const totpSecret = useMemo(
    () => (totpUri ? extractTotpSecretFromUri(totpUri) : null),
    [totpUri],
  );

  async function copySecret() {
    if (!totpSecret) return;
    try {
      await navigator.clipboard.writeText(totpSecret);
      setCopyHint("Secret copied. Paste it into the Key field in your app.");
    } catch {
      setCopyHint("Copy failed — select the secret text manually.");
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const session = await authClient.getSession();
      if (cancelled) return;

      if (session.error || !session.data?.session) {
        // No full session — likely mid-2FA challenge after password sign-in.
        setMode("challenge");
        return;
      }

      const user = session.data.user as { twoFactorEnabled?: boolean };
      if (user.twoFactorEnabled) {
        setMode("challenge");
        setInfo(
          "MFA is already enabled on this account. Enter a code only if you were redirected mid sign-in; otherwise continue to the dashboard after verifying.",
        );
        return;
      }

      setMode("enroll");
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function verifyTotp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await authClient.twoFactor.verifyTotp({
        code: totpCode.trim(),
      });
      if (result.error) {
        setError(
          result.error.message?.trim() ||
            "That code was not accepted. Try again.",
        );
        return;
      }
      setInfo("MFA verified. Opening the admin dashboard…");
      setTotpCode("");
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Verification is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyBackup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await authClient.twoFactor.verifyBackupCode({
        code: backupCode.trim(),
      });
      if (result.error) {
        setError(
          result.error.message?.trim() || "That backup code was not accepted.",
        );
        return;
      }
      setInfo("Backup code accepted. Opening the admin dashboard…");
      setBackupCode("");
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Verification is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  async function startEnrollment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await authClient.twoFactor.enable({
        password,
        method: "totp",
      });
      if (result.error) {
        setError(
          result.error.message?.trim() ||
            "Could not start MFA enrollment. Check your password.",
        );
        return;
      }

      const data = result.data as {
        totpURI?: string;
        backupCodes?: string[];
      } | null;

      setTotpUri(data?.totpURI ?? null);
      setBackupCodes(Array.isArray(data?.backupCodes) ? data.backupCodes : []);
      setInfo(
        "Add the authenticator entry, then verify one code below to finish enrollment. Store backup codes offline — they are shown once.",
      );
      setPassword("");
    } catch {
      setError("MFA enrollment is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmEnrollment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await authClient.twoFactor.verifyTotp({
        code: enrollCode.trim(),
      });
      if (result.error) {
        setError(
          result.error.message?.trim() || "Enrollment code was not accepted.",
        );
        return;
      }
      setInfo("MFA is enabled. Opening the admin dashboard…");
      setEnrollCode("");
      setMode("challenge");
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Could not confirm enrollment.");
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setLoading(true);
    try {
      await authClient.signOut();
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (mode === "loading") {
    return <p className="ds-support">Checking session…</p>;
  }

  if (mode === "signed-out") {
    return (
      <InlineStatus tone="pending">
        Sign in first, then return to complete MFA.
      </InlineStatus>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      {info ? <InlineStatus tone="success">{info}</InlineStatus> : null}
      {error ? <InlineStatus tone="error">{error}</InlineStatus> : null}

      {mode === "challenge" ? (
        <>
          <form
            className="flex flex-col gap-6"
            onSubmit={verifyTotp}
            noValidate
          >
            <FormField
              id="mfa-totp"
              label="Authenticator code"
              hint="Six-digit code from your authenticator app."
              required
            >
              {(control) => (
                <TextInput
                  {...control}
                  name="totp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={totpCode}
                  onChange={(event) => setTotpCode(event.target.value)}
                  required
                />
              )}
            </FormField>
            <Button type="submit" loading={loading} loadingLabel="Verifying">
              Verify authenticator code
            </Button>
          </form>

          <form
            className="flex flex-col gap-6"
            onSubmit={verifyBackup}
            noValidate
          >
            <FormField
              id="mfa-backup"
              label="Backup code"
              hint="Use a one-time backup code if you cannot open your authenticator."
            >
              {(control) => (
                <TextInput
                  {...control}
                  name="backup"
                  autoComplete="off"
                  value={backupCode}
                  onChange={(event) => setBackupCode(event.target.value)}
                />
              )}
            </FormField>
            <Button
              type="submit"
              variant="secondary"
              loading={loading}
              loadingLabel="Verifying"
            >
              Verify backup code
            </Button>
          </form>
        </>
      ) : null}

      {mode === "enroll" ? (
        <>
          {!totpUri ? (
            <form
              className="flex flex-col gap-6"
              onSubmit={startEnrollment}
              noValidate
            >
              <FormField
                id="mfa-enroll-password"
                label="Confirm password"
                hint="Required to begin authenticator enrollment."
                required
              >
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
              <Button type="submit" loading={loading} loadingLabel="Starting">
                Start authenticator setup
              </Button>
            </form>
          ) : (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-medium text-ink">
                  Setup key (manual entry)
                </h2>
                <p className="ds-support mt-2">
                  In your authenticator app choose{" "}
                  <strong className="font-medium text-ink">
                    Enter a setup key
                  </strong>
                  . Paste <em>only</em> this key — not the full{" "}
                  <code className="text-xs">otpauth://</code> URI. Account name
                  can be “Zatroz Admin”. Type: Time based.
                </p>
                {totpSecret ? (
                  <>
                    <pre className="mt-3 overflow-x-auto rounded-md border border-border-subtle bg-surface-muted p-3 font-mono text-sm break-all whitespace-pre-wrap text-ink">
                      {totpSecret}
                    </pre>
                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="secondary"
                        size="compact"
                        onClick={() => void copySecret()}
                      >
                        Copy setup key
                      </Button>
                    </div>
                    {copyHint ? (
                      <p className="ds-support mt-2" role="status">
                        {copyHint}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="mt-3 text-sm text-warning" role="status">
                    Could not read the setup key from the authenticator URI.
                    Copy the value after <code>secret=</code> in the URI below.
                  </p>
                )}
              </div>

              <div>
                <h2 className="font-medium text-ink">Full authenticator URI</h2>
                <p className="ds-support mt-2">
                  Optional. Some apps open this link directly. Do not paste this
                  whole string into a “Key” field — that causes “key too short”.
                </p>
                <pre className="mt-3 overflow-x-auto rounded-md border border-border-subtle bg-surface-muted p-3 text-xs break-all whitespace-pre-wrap text-text-body">
                  {totpUri}
                </pre>
              </div>

              {backupCodes.length > 0 ? (
                <div>
                  <h2 className="font-medium text-ink">Backup codes</h2>
                  <p className="ds-support mt-2">
                    Store these offline. Each code works once.
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 font-mono text-sm">
                    {backupCodes.map((backupCode) => (
                      <li key={backupCode}>{backupCode}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <form
                className="flex flex-col gap-6"
                onSubmit={confirmEnrollment}
                noValidate
              >
                <FormField
                  id="mfa-enroll-code"
                  label="Confirm with a code"
                  required
                >
                  {(control) => (
                    <TextInput
                      {...control}
                      name="enrollCode"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={enrollCode}
                      onChange={(event) => setEnrollCode(event.target.value)}
                      required
                    />
                  )}
                </FormField>
                <Button
                  type="submit"
                  loading={loading}
                  loadingLabel="Confirming"
                >
                  Finish MFA enrollment
                </Button>
              </form>
            </div>
          )}
        </>
      ) : null}

      <div>
        <Button
          type="button"
          variant="quiet"
          loading={loading}
          onClick={() => void signOut()}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
