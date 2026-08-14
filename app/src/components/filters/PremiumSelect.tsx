import type { SelectHTMLAttributes } from "react";

type PremiumSelectOption<Value extends string> = {
  label: string;
  value: Value;
};

type PremiumSelectProps<Value extends string> = Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> & {
  label: string;
  options: readonly PremiumSelectOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
};

export function PremiumSelect<Value extends string>({
  label,
  options,
  value,
  onChange,
  id,
  ...props
}: PremiumSelectProps<Value>) {
  const controlId = id ?? `filter-${label.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <label htmlFor={controlId} className="grid gap-1 text-sm font-normal text-black">
      {label}
      <select
        {...props}
        id={controlId}
        value={value}
        onChange={(event) => onChange(event.target.value as Value)}
        className="rounded-md border border-black/10 bg-white px-4 py-3 text-base font-normal text-black outline-none transition-colors hover:border-black/20 focus:border-[#EE6C4D] focus:ring-1 focus:ring-[#EE6C4D] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}