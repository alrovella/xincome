import Link from "next/link"

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-6 mx-auto h-screen">
      <h2 className="font-bold text-xl">No se encontró al cliente</h2>
      <div className="text-sm">El cliente que solicitaste no existe</div>
      <Link href="/customers">Volver</Link>
    </div>
  )
}

export default NotFound
