import * as React from "react";
import { Input } from "../ui/input";

export interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export function DatePicker({ label = "Select Date", value, onChange }: DatePickerProps) {
  return <Input label={label} type="date" value={value} onChange={(e) => onChange(e.target.value)} />;
}