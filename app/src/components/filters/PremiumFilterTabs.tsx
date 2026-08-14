"use client";

type PremiumFilterOption<Value extends string> = {
  label: string;
  value: Value;
};

type PremiumFilterTabsProps<Value extends string> = {
  ariaLabel: string;
  options: readonly PremiumFilterOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
};

export function PremiumFilterTabs<Value extends string>({
  ariaLabel,
  options,
  value,
  onChange,
}: PremiumFilterTabsProps<Value>) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={selected}
            className={`whitespace-nowrap rounded-md border px-4 py-3 text-base font-normal transition-colors active:translate-y-px disabled:opacity-40 ${
              selected
                ? "border-[#EE6C4D] bg-white text-black"
                : "border-black/10 bg-white text-black hover:border-black/20"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}