/**
 * Build / configure / integrate decision guide plus a labelled system map.
 * Accessible HTML — not a live product, vendor logo wall, or case study.
 */
export function CustomSoftwareGuide() {
  const rows = [
    {
      approach: "Configure an existing product",
      fit: "The product already covers most of the workflow with settings and permissions.",
      tradeoffs:
        "You accept the vendor’s model and limits. Unusual rules may still need workarounds.",
      needed:
        "Product name, current plan limits, admin access for assessment, and the gaps that remain.",
    },
    {
      approach: "Integrate existing tools",
      fit: "Several tools each do part of the job and can exchange data through available APIs or exports.",
      tradeoffs:
        "Reliability depends on each vendor’s API. Failures and rate limits need handling.",
      needed:
        "Authorized access, API or export docs, and which system remains the source of truth.",
    },
    {
      approach: "Develop a tailored application",
      fit: "Requirements need behaviour that configuration and light integration cannot support well.",
      tradeoffs:
        "More discovery and ownership responsibility. Not automatically cheaper or faster.",
      needed:
        "Workflow examples, roles, constraints, acceptance criteria, and decision makers.",
    },
  ] as const;

  return (
    <div className="mt-8 space-y-10">
      <div>
        <h3 className="ds-h3 m-0">Build, configure, integrate, or buy</h3>
        <p className="mt-2 m-0 text-sm text-text-muted">
          Parallel comparison for discussion — not scored rankings or price
          bands.
        </p>

        <div className="mt-4 hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Comparison of configuring a product, integrating tools, and
              developing tailored software
            </caption>
            <thead>
              <tr className="border-b border-border-subtle">
                <th scope="col" className="py-2 pr-4 font-semibold text-ink">
                  Approach
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold text-ink">
                  Fit
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold text-ink">
                  Trade-offs
                </th>
                <th scope="col" className="py-2 font-semibold text-ink">
                  Information needed
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.approach}
                  className="border-b border-border-subtle align-top"
                >
                  <th scope="row" className="py-3 pr-4 font-medium text-ink">
                    {row.approach}
                  </th>
                  <td className="py-3 pr-4 text-text-body">{row.fit}</td>
                  <td className="py-3 pr-4 text-text-body">{row.tradeoffs}</td>
                  <td className="py-3 text-text-body">{row.needed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-6 grid list-none gap-4 p-0 lg:hidden">
          {rows.map((row) => (
            <li
              key={`stack-${row.approach}`}
              className="border-t border-border-subtle pt-4"
            >
              <p className="m-0 font-semibold text-ink">{row.approach}</p>
              <p className="mt-2 m-0 text-sm text-text-body">
                <span className="font-medium text-ink">Fit. </span>
                {row.fit}
              </p>
              <p className="mt-2 m-0 text-sm text-text-body">
                <span className="font-medium text-ink">Trade-offs. </span>
                {row.tradeoffs}
              </p>
              <p className="mt-2 m-0 text-sm text-text-body">
                <span className="font-medium text-ink">
                  Information needed.{" "}
                </span>
                {row.needed}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="ds-h3 m-0">Illustrative system relationship</h3>
        <p className="mt-2 m-0 text-sm text-text-muted">
          Integrations depend on available APIs and access. No vendor logos or
          certifications shown.
        </p>

        <ol className="mt-4 grid list-none gap-3 p-0 md:grid-cols-3">
          <li className="rounded-md border border-border-subtle bg-canvas p-4">
            <p className="m-0 text-xs font-medium text-text-muted">
              Approved existing system
            </p>
            <p className="mt-2 m-0 font-semibold text-ink">Source records</p>
            <p className="mt-1 m-0 text-sm text-text-body">
              Sample: orders or tickets you already keep elsewhere.
            </p>
          </li>
          <li className="rounded-md border border-border-subtle bg-canvas p-4">
            <p className="m-0 text-xs font-medium text-text-muted">
              Tailored application
            </p>
            <p className="mt-2 m-0 font-semibold text-ink">Agreed workflow</p>
            <p className="mt-1 m-0 text-sm text-text-body">
              Sample: apply your rules, then pause for a person when needed.
            </p>
          </li>
          <li className="rounded-md border border-border-subtle bg-canvas p-4">
            <p className="m-0 text-xs font-medium text-text-muted">
              Reporting or notification
            </p>
            <p className="mt-2 m-0 font-semibold text-ink">Destination</p>
            <p className="mt-1 m-0 text-sm text-text-body">
              Sample: a report view or message your team agreed to receive.
            </p>
          </li>
        </ol>

        <p className="mt-4 m-0 rounded-md border border-border-subtle bg-surface-muted px-4 py-3 text-sm text-text-body">
          <span className="font-semibold text-ink">Human review. </span>
          Where an automated update would be risky, a named person confirms
          before the destination changes. This diagram does not call any live
          API.
        </p>
      </div>
    </div>
  );
}
