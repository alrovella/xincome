import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-6 mx-auto h-screen">
      <h2 className="font-bold text-xl">Página no encontrada</h2>
      <div className="text-sm">La página solicitada no existe</div>
      <Link href="/">Volver </Link>
    </div>
  );
};

export default NotFound;
