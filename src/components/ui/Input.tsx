export default function Input({
  onChange,
  className,
  value,
  placeholder,
  name,
  label,
  type,
  hidden,
}: {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  value: string;
  placeholder?: string;
  name?: string;
  label?: string;
  type?: string;
  hidden?: boolean;
}) {
  return (
    <div className="flex gap-2 items-center">
      {label && <label className="text-lg min-w-36">{label}</label>}
      <input
        type={type}
        className={`bg-bg text-text border-2 border-primary rounded p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        id={value}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        hidden={hidden}
      />
    </div>
  );
}
