"use client";
import type { ExtendedCompany } from "@/types/entities/companies";
import type React from "react";
import { createContext, useContext } from "react";

const CompanyPublicContext = createContext<ExtendedCompany | null>(null);

export const CompanyPublicContextProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ExtendedCompany;
}) => {
  return (
    <CompanyPublicContext.Provider value={value}>
      {children}
    </CompanyPublicContext.Provider>
  );
};

export const useCompanyPublic = () => {
  const context = useContext(CompanyPublicContext);
  if (!context) {
    throw new Error(
      "para usar los datos del negocio debes usar el proveedor CompanyPublicContext"
    );
  }
  return context;
};
