export default function Input({
  onChange,
  className,
  value,
  placeholder,
  name,
  label,
  type,
}: {
  onChange: any;
  className?: string;
  value: string;
  placeholder?: string;
  name?: string;
  label?: string;
  type?: string;
}) {
  return (
    <div className="flex gap-2 py-1 items-center">
      {label && <label className="text-lg min-w-36">{label}</label>}
      <input
        type={type}
        className={`bg-bg text-text border-2 border-primary rounded p-3 text-base ${className}`}
        id={value}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
