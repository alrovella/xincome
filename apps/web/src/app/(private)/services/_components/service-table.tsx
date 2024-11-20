"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { Cog, PencilLine } from "lucide-react";
import Link from "next/link";
import { useGetServices } from "@/hooks/queries/useGetServices";
import EmptyStateAlert from "@/components/common/empty-state-alert";
import ListSkeleton from "@/components/common/skeletons/list-skeleton";
import SecondaryLink from "@/components/common/links/secondary-link";
import { formatPrice } from "@/util/utils";
import toast from "react-hot-toast";
import { deleteService } from "@/server/actions/services";
import DeleteAlertDialog from "@/components/common/delete-alert-dialog";

const ServiceTable = () => {
  const {
    data: dataServices,
    isLoading: loadingServices,
    refetch,
  } = useGetServices();

  const handleDelete = async (id: string) => {
    const data = await deleteService(id);

    if (data.error) {
      toast.error(data.message);
    } else {
      toast.success(data.message);
      refetch();
    }
  };

  return (
    <>
      {loadingServices ? (
        <ListSkeleton />
      ) : (
        <>
          {dataServices?.length === 0 ? (
            <EmptyStateAlert>
              <Cog className="size-16" />
              <h2 className="font-bold text-xl">
                Todavía no tenés servicios registrados
              </h2>
              <div className="text-sm">
                Para poder crear turnos, tenés que tener al menos un servicio
                creado.
              </div>
              <div className="flex gap-1">
                Creá uno haciendo
                <Link href="/services/new" className="font-bold">
                  click aquí
                </Link>
              </div>
            </EmptyStateAlert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataServices?.map((service) => (
                  <TableRow key={service.id} className="hover:bg-background">
                    <TableCell>{service.name}</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(service.price ?? 0)}
                    </TableCell>
                    <TableCell>{service.durationInMinutes} minutos</TableCell>
                    <TableCell className="flex justify-end items-center gap-2">
                      <SecondaryLink href={`/services/edit/${service.id}`}>
                        <PencilLine className="size-4" />
                      </SecondaryLink>
                      <DeleteAlertDialog
                        description="Seguro de eliminar el servicio?"
                        onDelete={() => handleDelete(service.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </>
  );
};

export default ServiceTable;
