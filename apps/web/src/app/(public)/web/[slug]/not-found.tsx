const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-6 mx-auto h-screen">
      <h2 className="font-bold text-xl">No se encontró el negocio</h2>
      <div className="text-sm">
        El negocio que estás buscando no existe o ha sido eliminado
      </div>
      <div>Comunicate con el negocio</div>
    </div>
  )
}

export default NotFound
