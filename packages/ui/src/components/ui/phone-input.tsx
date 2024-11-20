// Dependencies: pnpm install react-phone-number-input lucide-react

"use client";
import { Input } from "@repo/ui/components/ui/input";
import { cn } from "@repo/ui/lib/utils";
import { ChevronDown, Phone } from "lucide-react";

import { forwardRef, type InputHTMLAttributes } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

export default function InputPhone({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  placeholder?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
}) {
  return (
    <RPNInput.default
      className="flex shadow-black/5 shadow-sm rounded-lg"
      international
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={PhoneInput}
      defaultCountry="AR"
      id="input-46"
      placeholder={placeholder}
      value={value}
      onChange={(newValue) => onChange?.(newValue ?? "")}
    />
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const PhoneInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        className={cn(
          "-ms-px rounded-s-none shadow-none focus-visible:z-10",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as RPNInput.Country);
  };

  return (
    <div className="inline-flex relative focus-within:z-10 items-center border-input bg-background hover:bg-accent has-[:disabled]:opacity-50 py-2 border focus-within:border-ring rounded-s-lg focus-within:ring-2 focus-within:ring-ring/30 ring-offset-background focus-within:ring-offset-2 text-muted-foreground hover:text-foreground focus-within:text-foreground transition-shadow has-[:disabled]:pointer-events-none pe-2 ps-3 self-stretch focus-within:outline-none">
      <div className="inline-flex items-center gap-1" aria-hidden="true">
        <FlagComponent country={value} countryName={value} aria-hidden="true" />
        <span className="text-muted-foreground/80">
          <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
      <select
        disabled={disabled}
        value={value}
        onChange={handleSelect}
        className="absolute inset-0 opacity-0 text-sm"
        aria-label="Select country"
      >
        <option key="default" value="">
          Select a country
        </option>
        {options
          .filter((x) => x.value)
          .map((option, i) => (
            <option key={option.value ?? `empty-${i}`} value={option.value}>
              {option.label}{" "}
              {option.value &&
                `+${RPNInput.getCountryCallingCode(option.value)}`}
            </option>
          ))}
      </select>
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="rounded-sm w-5 overflow-hidden">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <Phone size={16} aria-hidden="true" />
      )}
    </span>
  );
};
