export default function FormFieldContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">{children}</div>
  );
}
