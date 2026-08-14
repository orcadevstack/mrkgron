"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type FilterValue = string;
type FilterValues = Record<string, FilterValue>;

type FilterContextValue = {
  values: FilterValues;
  setValue: (name: string, value: FilterValue) => void;
};

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children, initialValues = {} }: { children: ReactNode; initialValues?: FilterValues }) {
  const [values, setValues] = useState<FilterValues>(initialValues);

  const value = useMemo<FilterContextValue>(() => ({
    values,
    setValue: (name, nextValue) => setValues((current) => ({ ...current, [name]: nextValue })),
  }), [values]);

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilterValue(name: string, fallback = "") {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error("useFilterValue must be used within a FilterProvider.");
  }

  return [context.values[name] ?? fallback, (value: FilterValue) => context.setValue(name, value)] as const;
}