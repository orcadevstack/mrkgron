import { useEffect, useState } from "react";

const DEFAULT_DELAY_MS = 200;

export function useDebouncedValue<Value>(value: Value, delay = DEFAULT_DELAY_MS) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
}