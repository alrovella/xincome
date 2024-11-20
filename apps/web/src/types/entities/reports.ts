export type AppointmentsByServiceReport = {
  aiText?: string;
  report: {
    serviceName: string;
    appointmentCount: number;
  }[];
};

export interface AppointmentTimelineReport {
  aiText?: string;
  report: {
    monthYear: string;
    confirmedAppointments: number;
    cancelledAppointments: number;
  }[];
}

export interface AppointmentPaymentsReport {
  aiText?: string;
  report: {
    monthYear: string;
    totalPayments: number;
  }[];
}
