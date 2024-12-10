export default function FormGroupSection({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="border-gray-200 pb-8 border-b">{children}</section>
  );
}
