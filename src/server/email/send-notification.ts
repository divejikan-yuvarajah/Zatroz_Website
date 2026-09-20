/**
 * Server-only transactional notification sender.
 * Not wired to enquiry form submission (that is Step 51).
 */

import "server-only";

import { Resend } from "resend";
import {
  sendNotification as sendNotificationCore,
  type ResendEmailsClient,
  type SendNotificationOptions as CoreSendOptions,
} from "@/lib/email/send-notification";

export {
  buildTeamNotificationRequest,
  type ResendEmailsClient,
} from "@/lib/email/send-notification";

export type SendNotificationOptions = Omit<
  CoreSendOptions,
  "createResendClient"
>;

function createResendClient(apiKey: string): ResendEmailsClient {
  return new Resend(apiKey) as unknown as ResendEmailsClient;
}

/**
 * Send one internal notification through capture or Resend.
 * Callers must supply a fully rendered, allowlisted request.
 */
export async function sendNotification(
  request: Parameters<typeof sendNotificationCore>[0],
  options: SendNotificationOptions = {},
) {
  return sendNotificationCore(request, {
    ...options,
    createResendClient: options.resendClient ? undefined : createResendClient,
  });
}
