import { Resend } from "resend";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  const response = await resend.emails.send({
    from: "Turnia <onboarding@resend.dev>",
    to: ["alrovella@gmail.com"],
    subject: "Prueba desde el CRON vercel",
    text: "Prueba desde el CRON vercel",
  });

  if (response.error) {
    return new Response(response.error.message, {
      status: 500,
    });
  }

  return new Response("OK", { status: 200 });
}
