export default function FormGroupHeader({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <h2 className="flex items-center mb-6 font-semibold text-foreground text-xl">
      {children}
    </h2>
  );
}
