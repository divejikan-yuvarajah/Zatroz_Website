# Alert runbook (Step 62)

Thresholds are **tunable starting points**, not calibrated pages. No external alert destination is configured. Local signal checks do not notify people.

Owner for the first response: the site operator. There is no on-call rota in this repository.

| Signal               | Window        | Starting threshold                                 | Severity | Recovery                                                  | First response                                                                              |
| -------------------- | ------------- | -------------------------------------------------- | -------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `server-error-rate`  | 15 minutes    | At least 20 requests and at least 5% server errors | Page     | Error rate back under the threshold for one window        | Read redacted server logs. Do not treat enquiry validation errors as this signal.           |
| `database-timeouts`  | 15 minutes    | 3 timeouts                                         | Page     | New requests complete without timeout                     | Check Atlas status separately. The public `/api/health` route does not query Atlas.         |
| `challenge-failures` | 15 minutes    | 10 verification failures                           | Ticket   | Failures fall under the threshold                         | Confirm Turnstile configuration. Do not bypass verification.                                |
| `notification-age`   | Point in time | Oldest pending intent at least 60 minutes          | Ticket   | Intent leaves pending by send, rejection, or owner review | This is not a lost enquiry.                                                                 |
| `lease-failures`     | 15 minutes    | 3 lease failures                                   | Ticket   | A worker claims and finishes without a lease error        | Do not start a second sender for the same intent.                                           |
| `delivery-uncertain` | Point in time | Any exhausted or uncertain notification            | Ticket   | Owner review resolves the intent                          | Missing email is not a lost enquiry. Accepted enquiries can exceed delivered notifications. |

External uptime checks are not set up. Remaining step: choose a monitor, point it at `GET /api/health`, and expect `{ "ok": true }` with no secrets. Do not add a database query to that route.
