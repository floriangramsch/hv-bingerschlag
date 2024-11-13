interface SelectProps {
  name: string;
  options: { value: number; label: string }[];
  change: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  class?: string;
  value?: string;
  children?: React.ReactNode;
}

export default function Select(data: SelectProps) {
  return (
    <select
      name={data.name}
      className={`${data.class} bg-bg border-2 border-primary p-2 rounded text-white text-lg`}
      onChange={data.change}
      value={data.value || ""}
    >
      <option value="" disabled={data.value !== undefined}>
        {data.children}
      </option>
      {data.options?.map((d) => (
        <option key={d.value} value={d.value}>
          {d.label}
        </option>
      ))}
    </select>
  );
}
