import Link from "next/link"

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-6 mx-auto h-screen">
      <h2 className="font-bold text-xl">No se encontró el turno</h2>
      <div className="text-sm">El turno que solicitaste no existe</div>
      <Link href="/appurntments">Volver</Link>
    </div>
  )
}

export default NotFound
