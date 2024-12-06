"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@repo/ui/components/ui/table";
import EmptyStateAlert from "@/components/common/EmptyStateAlert";
import SecondaryLink from "@/components/common/links/SecondaryLink";
import { useBankAccounts } from "@/hooks/queries/useBankAccounts";
import ListSkeleton from "@/components/common/skeletons/ListSkeleton";
import { Landmark, Pencil } from "lucide-react";
import { deleteBankAccount } from "@/server/actions/bank-accounts";
import toast from "react-hot-toast";
import DeleteAlertDialog from "@/components/common/DeleteAlertDialog";
import { useTransition } from "react";

const BankAccountList = () => {
  const { data, refetch, fetchStatus } = useBankAccounts();
  const [isDeleting, deleteTransition] = useTransition();

  const handleDelete = async (id: number) => {
    deleteTransition(async () => {
      const data = await deleteBankAccount(id);

      if (data.error) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        refetch();
      }
    });
  };

  return (
    <>
      {fetchStatus === "fetching" || isDeleting ? (
        <ListSkeleton />
      ) : (
        <>
          {data?.length === 0 ? (
            <EmptyStateAlert>
              <Landmark className="mb-4 text-destructive size-12" />
              <h2 className="mb-2 font-semibold text-2xl">
                No hay cuentas bancarias disponibles
              </h2>
              <p className="text-sm">
                En este momento no hay cuentas bancarias registradas en el
                sistema.
              </p>
            </EmptyStateAlert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/0">
                  <TableHead className="w-1/3">Nombre</TableHead>
                  <TableHead>Alias</TableHead>
                  <TableHead className="hidden md:table-cell">
                    CBU/CVU
                  </TableHead>
                  <TableHead> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((bankAccount) => (
                  <TableRow key={bankAccount.id}>
                    <TableCell className="font-medium">
                      {bankAccount.name}
                    </TableCell>
                    <TableCell>{bankAccount.alias}</TableCell>
                    <TableCell className="hidden font-medium md:table-cell">
                      {bankAccount.cbu}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <SecondaryLink
                        href={`/bank-accounts/edit?id=${bankAccount.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </SecondaryLink>
                      <DeleteAlertDialog
                        description="Seguro de eliminar la cuenta bancaria?"
                        onDelete={() => handleDelete(bankAccount.id)}
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

export default BankAccountList;
