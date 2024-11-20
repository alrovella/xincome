import { Container } from "@repo/ui/components/ui/container";

export default async function Page() {
  return (
    <Container title="Feedback">
      <h2 className="mb-4 font-semibold text-2xl">
        ¡Nos encantaría escuchar tu opinión!
      </h2>
      <p className="mb-6 text-gray-600">
        Tus comentarios y sugerencias son muy importantes para nosotros. Nos
        ayudan a mejorar nuestros servicios y tu experiencia. Si tienes alguna
        idea, sugerencia o has encontrado algún problema, por favor no dudes en
        contactarnos.
      </p>
      <a
        href={`mailto:${process.env.NEXT_PUBLIC_APP_EMAIL}`}
        className="inline-block bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg text-white transition-colors"
      >
        Enviar Feedback
      </a>
    </Container>
  );
}
