"use client";

import { Button, type ButtonProps } from "@repo/ui/components/ui/button";
import { Check, Copy, X } from "lucide-react";
import { useState } from "react";

type CopyState = "idle" | "copied" | "error";

const CopyAppointmentButton = ({
  appointmentId,
  clerkUserId,
  ...buttonProps
}: Omit<ButtonProps, "children" | "onClick"> & {
  appointmentId: string;
  clerkUserId: string;
}) => {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const CopyIcon = getCopyIcon(copyState);

  return (
    <Button
      {...buttonProps}
      onClick={() => {
        navigator.clipboard
          .writeText(`${location.origin}/book/${clerkUserId}/${appointmentId}`)
          .then(() => {
            setCopyState("copied");
            setTimeout(() => setCopyState("idle"), 4000);
          })
          .catch(() => {
            setCopyState("error");
            setTimeout(() => setCopyState("idle"), 4000);
          });
      }}
    >
      <CopyIcon className="mr-2 size-4" />
      {getChildren(copyState)}
    </Button>
  );
};

export default CopyAppointmentButton;

function getCopyIcon(state: CopyState) {
  switch (state) {
    case "idle":
      return Copy;
    case "copied":
      return Check;
    case "error":
      return X;
  }
}

function getChildren(copyState: CopyState) {
  switch (copyState) {
    case "idle":
      return "Copiar Link";
    case "copied":
      return "Copiado!";
    case "error":
      return "Error";
  }
}
