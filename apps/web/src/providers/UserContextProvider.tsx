"use client";

import type { LoggedUser } from "@/types/entities/user";
import { createContext, type ReactNode, useContext } from "react";

const UserContext = createContext<LoggedUser | null>(null);

export const UserContextProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: LoggedUser | null;
}) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAppUser = () => {
  const appUser = useContext(UserContext);
  if (!appUser) {
    throw new Error("Debes usar el proveedor UserContext");
  }
  return appUser;
};
