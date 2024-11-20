import { useRouter, useSearchParams } from "next/navigation"

type UpdateQueryParam = <T extends string | number | boolean>(
  key: string,
  value: T
) => void

const useUpdateQueryParam = (): UpdateQueryParam => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateQueryParam: UpdateQueryParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString())

    // Agregamos o actualizamos el parámetro con el valor pasado
    params.set(key, String(value))

    // Redirigimos con los parámetros actualizados
    router.push(`?${params.toString()}`)
  }

  return updateQueryParam
}

export default useUpdateQueryParam
