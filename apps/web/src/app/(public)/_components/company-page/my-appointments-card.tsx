"use client"

import { CalendarDays, CalendarMinus } from "lucide-react"

const MyAppointmentsCard = () => {
  return (
    <div>
      <h2 className="flex justify-start items-center font-bold text-xl">
        <CalendarDays className="w-6 h-6" />
        Mis turnos
      </h2>
      <div className="mx-auto p-8 max-w-md text-center">
        <div className="inline-block relative mb-6 p-4">
          <CalendarMinus className="w-16 h-16 text-destructive" />
        </div>
        <h2 className="mb-2 font-bold text-3xl">No hay turnos</h2>
        <div className="text-xl">No tenés turnos registrados</div>
      </div>
    </div>
  )
}

export default MyAppointmentsCard
