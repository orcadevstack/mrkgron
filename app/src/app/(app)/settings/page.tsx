export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="app-surface p-8 lg:p-10">
        <p className="page-eyebrow">Workspace Controls</p>
        <h2 className="page-title">Settings and operator preferences</h2>
        <p className="page-copy">
          Configure the defaults that shape how your team uses Mrkgron day to day, from notifications to workspace governance.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="app-panel p-6 xl:col-span-2">
          <h3 className="text-lg font-bold text-brand-dark">Notification defaults</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Campaign delivery summaries",
              "Order and fulfillment alerts",
              "API and integration health",
              "High-priority insight digests",
            ].map((item, index) => (
              <label key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <span>{item}</span>
                <span className={`h-6 w-11 rounded-full p-1 transition ${index < 3 ? "bg-brand-accent" : "bg-slate-300"}`}>
                  <span className={`block h-4 w-4 rounded-full bg-white transition ${index < 3 ? "translate-x-5" : "translate-x-0"}`} />
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="app-panel p-6">
          <h3 className="text-lg font-bold text-brand-dark">Brand stance</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Mrkgron uses a controlled navy, blue, and gold palette throughout the workspace to preserve visual continuity and readability.
          </p>
          <div className="mt-5 grid gap-3">
            {[
              "High contrast text",
              "Consistent layout spacing",
              "Unified action hierarchy",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}