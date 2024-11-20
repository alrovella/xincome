import Link from "next/link"

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-6 mx-auto h-screen">
      <h2 className="font-bold text-xl">No se encontró la agenda</h2>
      <div className="text-sm">La agenda que solicitaste no existe</div>
      <Link href="/schedules">Volver</Link>
    </div>
  )
}

export default NotFound
