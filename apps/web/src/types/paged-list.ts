export type PagedList<T> = {
  data: T[]; // Array de elementos de tipo genérico
  page: number; // Página actual
  limit: number; // Cantidad de elementos por página
  totalCount: number; // Total de elementos en la colección completa
  totalPages: number; // Total de páginas disponibles
};
