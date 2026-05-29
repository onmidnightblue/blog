import { forwardRef, InputHTMLAttributes, useState } from "react";
import SmallLoadingSpinner from "../loading/SmallLoadingSpinner";

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string | null;
  loading?: boolean;
  value?: string;
  onChange: (value: string) => void;
}

const InnerInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, loading, value = "", onChange, ...props }, ref) => {
    const [isTouched, setIsTouched] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setIsTouched(true);
      onChange(newValue);
    };

    const displayError = isTouched ? error : null;

    return (
      <div className="flex flex-col w-full">
        <div className="relative w-full text-sm">
          <input
            {...props}
            ref={ref}
            className={`
       px-1 py-0.5 w-full bg-gray-100 outline-none text-foreground
            ${displayError ? "border border-error" : "border-blue-200"}
            ${loading ? "pr-6 opacity-70" : ""}
          `}
            value={value}
            placeholder={label}
            onChange={handleChange}
            onBlur={() => setIsTouched(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
          />
          {loading && <SmallLoadingSpinner />}
        </div>
        {displayError && (
          <span className="mt-0.5 text-[10px] text-error font-medium leading-none">
            {displayError}
          </span>
        )}
      </div>
    );
  }
);

InnerInput.displayName = "InnerInput";

export default InnerInput;
