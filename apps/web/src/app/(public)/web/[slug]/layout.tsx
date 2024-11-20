/* eslint-disable @next/next/no-img-element */
import { getCompanyBySlug } from "@/server/queries/companies";
import NotFound from "./not-found";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import genericHeaderImage from "@/assets/images/generic-header-image.jpg";
import ButtonsNav from "../../_components/company-page/buttons-nav";
import type { Metadata } from "next";
import { CompanySlugContextProvider } from "@/providers/company-public-provider";
import { getInitials } from "@/util/utils";

export const generateMetadata = async (
  props: LayoutProps
): Promise<Metadata> => {
  const params = await props.params;
  const company = await getCompanyBySlug(params.slug);

  if (!company) return { title: process.env.NEXT_PUBLIC_APP_NAME };
  return {
    title: `${company.name} | ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description: company.welcomeText,
  };
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

const PublicLayout = async (props: LayoutProps) => {
  const params = await props.params;

  const { children } = props;

  const company = await getCompanyBySlug(params.slug);
  if (!company) return NotFound();

  return (
    <CompanySlugContextProvider value={company}>
      <div className="bg-white mx-auto rounded-lg w-full max-w-3xl h-screen">
        <div className="relative">
          <img
            src={
              company.headerImage && company.headerImage?.length > 0
                ? company.headerImage
                : genericHeaderImage.src
            }
            alt={company.name}
            className="w-full h-48 object-cover"
          />
          <Avatar className="bottom-0 left-4 absolute border-4 border-white w-32 h-32 transform translate-y-1/2">
            <AvatarImage src={company.logo ?? ""} alt={company.name} />
            <AvatarFallback>{getInitials(company.name)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-16 px-2">
          <div className="flex justify-between items-start">
            <h1 className="font-bold text-2xl">{company.name}</h1>
            <div className="flex justify-end items-center gap-2">
              <ButtonsNav />
            </div>
          </div>
          {company.welcomeText ? (
            <div className="my-4 text-balance text-sm sm:text-pretty">
              {company.welcomeText}
            </div>
          ) : null}

          <div className="justify-between items-center grid grid-cols-1 sm:grid-cols-2 mt-2 text-gray-500">
            {company.address && company.city && company.province ? (
              <Link
                className="flex items-center text-sm"
                href={`https://www.google.com/maps/search/?api=1&query=${company.address},${company.city},${company.province}`}
                target="_blank"
              >
                <MapPin className="mr-1 w-4 h-4" />
                {company.address}, {company.city}, {company.province}
              </Link>
            ) : null}
            <div className="flex items-center text-sm">
              <CalendarDays className="mr-1 w-4 h-4" />
              <span className="mr-1">Se unió en </span>
              {format(new Date(company.createdAt), "LLLL yyyy", { locale: es })}
            </div>
          </div>
        </div>
        <hr className="my-2" />
        <div className="mt-4 px-2">{children}</div>
      </div>
    </CompanySlugContextProvider>
  );
};

export default PublicLayout;
