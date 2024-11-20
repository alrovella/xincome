"use client";

import { askAIForHelp } from "@/server/queries/ai";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/ui/alert-dialog";
import { Button } from "@repo/ui/components/ui/button";
import { HelpCircle, LoaderCircle } from "lucide-react";
import { useState } from "react";

export function HelpDialog({ prompt }: Readonly<{ prompt: string }>) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [help, setHelp] = useState<string>("");

  const handleHelp = async () => {
    setOpen(true);
    setLoading(true);
    setHelp(await askAIForHelp(prompt));
    setLoading(false);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-1" onClick={handleHelp}>
          <HelpCircle className="size-4" /> Ayuda
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ayuda AI</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-2 py-4">
            {loading && (
              <div className="flex flex-col gap-4 item-center w-full">
                <div className="flex justify-center text-lg">
                  Generando ayuda...
                </div>
                <div className="flex justify-center">
                  <LoaderCircle className="animate-spin size-16" />
                </div>
              </div>
            )}

            {help ? (
              <div className="h-64 overflow-auto scrollbar">
                <div className="whitespace-pre-line">{help ?? ""}</div>
              </div>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            OK
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
