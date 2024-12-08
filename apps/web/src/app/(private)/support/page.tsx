import { Container } from "@repo/ui/components/ui/container";

export default function Page() {
  return (
    <Container title="Soporte">
      <h2 className="mb-4 font-semibold text-2xl">¿Necesitas ayuda técnica?</h2>
      <p className="mb-6 text-gray-600">
        Estamos aquí para ayudarte con cualquier problema técnico que encuentres
        en nuestra aplicación. Nuestro equipo de soporte está disponible para
        asistirte y resolver tus dudas lo más pronto posible. Por favor,
        describe detalladamente el problema que estás experimentando,
        incluyendo:
      </p>
      <ul className="mb-6 text-gray-600 text-left list-disc list-inside">
        <li>Qué estabas intentando hacer</li>
        <li>Qué error o problema encontraste</li>
        <li>En qué dispositivo y navegador ocurrió</li>
        <li>Si es posible, incluye capturas de pantalla</li>
      </ul>
      <a
        href={`mailto:${process.env.NEXT_PUBLIC_APP_EMAIL}`}
        className="inline-block bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg text-white transition-colors"
      >
        Contactar Soporte Técnico
      </a>
    </Container>
  );
}
