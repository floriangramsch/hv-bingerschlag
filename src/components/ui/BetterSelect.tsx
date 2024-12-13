import { TItem } from "@/app/helpers/types";
import { useState, useEffect, useRef } from "react";

type BetterSelectProps = {
  id: number;
  options: TItem[];
  onChange: (e: TItem) => any;
  defaultValue: TItem | undefined;
};

export default function BetterSelect(props: BetterSelectProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState(props.defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeValue = (option: { value: string; label: string }) => {
    setOpen(false);
    props.onChange(option);
    setValue(option);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`cursor-pointer border-2 border-primary w-36 p-2 rounded flex items-center ${
          open ? "ring-1 ring-primary" : ""
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {value ? value?.label : "Select.."}

        <i aria-hidden className="fa-solid fa-caret-down absolute right-2" />
      </div>
      <div
        className={`absolute bg-bg border-2 border-primary z-10 mt-1 rounded shadow w-full py-1 cursor-pointer 
        transform transition-all duration-300 ease-in-out ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {props.options.map((option) => {
          return (
            <div
              key={props.id + option.value}
              onClick={() => changeValue(option)}
              className={`${
                option.value === value?.value ? "bg-bg-lighter" : ""
              } w-full h-full p-2`}
            >
              {option.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
