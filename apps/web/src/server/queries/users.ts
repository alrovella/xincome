"use server";
import "use-server";

import db, { WebServicesVisibility } from "@repo/database/client";
import { currentUser } from "@clerk/nextjs/server";
import type { LoggedUser } from "@/types/entities/user";
import { createSlug } from "@/util/utils";

export async function getLoggedInUser(): Promise<LoggedUser | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  let appUser = await db.user.findFirst({
    where: {
      clerkId: clerkUser.id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      clerkId: true,
      company: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          address: true,
          city: true,
          province: true,
          country: true,
          phoneNumber: true,
          logo: true,
          website: true,
          instagram: true,
          facebook: true,
          whatsapp: true,
          slug: true,
          welcomeText: true,
          mercadoPagoPreApprovalId: true,
          headerImage: true,
          active: true,
          companyPlanId: true,
          companyCategoryId: true,
          services: true,
          companyPlan: true,
          schedules: true,
          options: true,
        },
      },
      createdAt: true,
    },
  });

  if (!appUser) {
    let freePlan = await db.companyPlan.findFirst({
      where: {
        price: 0,
      },
    });

    if (!freePlan) {
      freePlan = await db.companyPlan.create({
        data: {
          name: "Gratuito",
          price: 0,
          maxSchedules: 5,
          maxSppointmentsPerSchedule: 50,
        },
      });
    }

    appUser = await db.user.create({
      data: {
        clerkId: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        company: {
          create: {
            companyPlanId: freePlan?.id,
            slug: createSlug(
              clerkUser.fullName ??
                clerkUser.emailAddresses[0]?.emailAddress ??
                ""
            ),
            name: clerkUser.fullName
              ? `${clerkUser.fullName}`
              : (clerkUser.emailAddresses[0]?.emailAddress ?? ""),
            options: {
              create: {
                webPayments: false,
                webReservations: false,
                webServicesVisibility: WebServicesVisibility.NO_MOSTRAR,
                showPersonInChargeReservation: false,
                canCreatePastAppointments: false,
              },
            },
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        clerkId: true,
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            address: true,
            city: true,
            province: true,
            country: true,
            phoneNumber: true,
            logo: true,
            website: true,
            instagram: true,
            facebook: true,
            whatsapp: true,
            slug: true,
            welcomeText: true,
            mercadoPagoPreApprovalId: true,
            headerImage: true,
            active: true,
            companyPlanId: true,
            companyCategoryId: true,
            services: true,
            companyPlan: true,
            schedules: true,
            options: true,
          },
        },
        createdAt: true,
      },
    });
  }

  return appUser;
}
