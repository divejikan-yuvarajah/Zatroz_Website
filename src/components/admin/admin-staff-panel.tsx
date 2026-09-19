"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { InlineStatus } from "@/components/forms/inline-status";
import type { StaffMemberSummary } from "@/server/admin/staff";
import {
  updateStaffRoleAction,
  type StaffRoleActionState,
} from "@/server/admin/staff-actions";

const initialState: StaffRoleActionState | null = null;

function StaffRoleForm({
  member,
  currentUserId,
}: {
  member: StaffMemberSummary;
  currentUserId: string | null;
}) {
  const [state, action, pending] = useActionState(
    updateStaffRoleAction,
    initialState,
  );

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="targetUserId" value={member.id} />
      <label className="text-sm">
        <span className="sr-only">Role for {member.email}</span>
        <select
          name="nextRole"
          defaultValue={member.staffRole}
          className="min-h-11 rounded-sm border border-border-control bg-surface px-3 text-ink"
          disabled={pending}
        >
          <option value="owner">Owner</option>
          <option value="editor">Editor</option>
        </select>
      </label>
      <Button
        type="submit"
        variant="secondary"
        size="compact"
        loading={pending}
      >
        Update role
      </Button>
      {member.id === currentUserId ? (
        <span className="text-sm text-text-muted">(you)</span>
      ) : null}
      {state ? (
        <InlineStatus tone={state.ok ? "success" : "error"}>
          {state.message}
        </InlineStatus>
      ) : null}
    </form>
  );
}

export type AdminStaffPanelProps = {
  members: readonly StaffMemberSummary[] | null;
  unavailableDetail: string | null;
  currentUserId: string | null;
};

export function AdminStaffPanel({
  members,
  unavailableDetail,
  currentUserId,
}: AdminStaffPanelProps) {
  if (unavailableDetail) {
    return (
      <div
        className="rounded-md border border-border-subtle bg-warning-soft p-4 text-warning"
        role="status"
      >
        <p className="font-medium">Staff list unavailable</p>
        <p className="mt-1 text-sm">{unavailableDetail}</p>
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <p className="ds-support">
        No staff accounts found. Use the owner bootstrap script to create the
        first owner, then enroll MFA.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border-subtle border-t border-border-subtle">
      {members.map((member) => (
        <li
          key={member.id}
          className="flex flex-col gap-4 py-5 lg:flex-row lg:items-start lg:justify-between"
        >
          <div className="min-w-0">
            <p className="font-medium text-ink">
              {member.name || member.email}
            </p>
            <p className="truncate text-sm text-text-muted">{member.email}</p>
            <p className="mt-1 text-sm text-text-muted">
              MFA: {member.twoFactorEnabled ? "enabled" : "not enrolled"}
            </p>
          </div>
          <StaffRoleForm member={member} currentUserId={currentUserId} />
        </li>
      ))}
    </ul>
  );
}
