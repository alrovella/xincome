import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const countCompanyCategories = await prisma.companyCategory.count();
  if (countCompanyCategories === 0) {
    await prisma.companyCategory.createMany({
      data: [
        {
          name: "Salud y Bienestar",
          description:
            "Clínicas, consultorios médicos, psicología, odontología, fisioterapia, spa.",
          helpText: `Ejemplos de Nombres para Agendas:
  Agenda de Consultas Generales: Para horarios destinados a consultas médicas de rutina.
  Agenda de Especialistas: Si cuentas con varios médicos especialistas, utiliza este nombre para agrupar sus horarios.
  Agenda de Emergencias: Para servicios disponibles para atender situaciones urgentes.
  Agenda de Control de Pacientes Crónicos: Para seguimiento de pacientes con condiciones de salud a largo plazo.
  Ejemplos de Nombres para Servicios:
  Consulta Médica General: Para consultas con el médico de cabecera.
  Consulta de Pediatría: Servicio específico para atención de niños.
  Consulta de Psicología: Para sesiones con un psicólogo.
  Consulta Odontológica: Servicio para atención dental.
  Chequeo Anual: Exámenes médicos de rutina que se realizan una vez al año.
  Exámenes de Laboratorio: Servicio que incluye análisis de sangre y otros estudios.
  Consejos Generales:
  Sé Claro y Preciso: Asegúrate de que el nombre del servicio indique exactamente qué tipo de atención se brinda.
  Utiliza Términos Comunes: Nombres que sean comprensibles para todos los pacientes.
  Manten Consistencia: Usa un formato uniforme en todos los nombres de tus servicios y agendas para facilitar la búsqueda.
  Siguiendo estas recomendaciones, podrás organizar tu consultorio médico de manera más efectiva y ayudar a tus pacientes a seleccionar los servicios que necesitan.`,
        },
        {
          name: "Moda y Belleza",
          description:
            "Peluquerías, barberías, salones de belleza, servicios de maquíllaje.",
          helpText: `Ejemplos de Nombres para Agendas:
  Agenda de Lunes a Viernes: Utiliza este nombre si deseas crear una agenda que cubra todos los días hábiles de la semana.
  Agenda de Fines de Semana: Ideal para horarios especiales los sábados y domingos.
  Agenda de Horarios Especiales: Para aquellos días con horarios diferentes, como feriados o eventos especiales.
  Ejemplos de Nombres para Servicios:
  Corte de Cabello Masculino: Para servicios de corte específicamente dirigidos a hombres.
  Corte de Cabello Femenino: Para servicios de corte para mujeres.
  Peinado de Fiesta: Para peinados más elaborados y con estilo.
  Coloración Completa: Para un servicio de coloración de cabello en toda la cabeza.
  Consejos Generales:
  Sé Específico: Asegúrate de que el nombre del servicio refleje claramente lo que ofreces.
  Usa Términos Comunes: Utiliza términos que tus clientes entenderán fácilmente.
  Consistencia: Mantén un estilo y formato coherente en todos los nombres de tus servicios y agendas.
  Siguiendo estas recomendaciones, podrás organizar tu peluquería de manera más efectiva y facilitar a tus clientes la selección de servicios.`,
        },
        {
          name: "Veterinaria y Cuidado de Mascotas",
          description:
            "Veterinarias y centros de grooming (corte, baño y estética de mascotas).",
          helpText: `Ejemplos de Nombres para Agendas:
  Agenda de Consultas Veterinarias: Para horarios dedicados a consultas generales con veterinarios.
  Agenda de Urgencias: Para atención inmediata en casos de emergencia animal.
  Agenda de Vacunación: Horarios específicos para la administración de vacunas a mascotas.
  Agenda de Grooming: Para servicios de peluquería y cuidado estético de mascotas.
  Ejemplos de Nombres para Servicios:
  Consulta Veterinaria General: Servicio para evaluación y tratamiento de la salud de las mascotas.
  Consulta de Especialista: Para atención específica, como dermatología o cardiología veterinaria.
  Vacunación: Servicio que incluye la administración de vacunas para perros, gatos y otros animales.
  Desparasitaciones: Tratamientos para eliminar parásitos internos y externos.
  Baño y Corte de Pelo: Servicio de grooming que incluye el lavado y corte de pelo de mascotas.
  Corte de Uñas: Servicio específico para el cuidado de las patas de las mascotas.
  Consulta de Comportamiento: Evaluaciones y asesoramiento sobre problemas de comportamiento en mascotas.
  Consejos Generales:
  Sé Claro y Descriptivo: El nombre del servicio debe reflejar con claridad el tipo de atención que se ofrece.
  Usa Términos Reconocibles: Prefiere nombres que sean familiares para los dueños de mascotas.
  Mantén Consistencia: Utiliza un formato uniforme en todos los nombres de tus servicios y agendas para facilitar la navegación.
  Siguiendo estas pautas, podrás organizar eficientemente tu veterinaria o centro de grooming y ayudar a los dueños de mascotas a encontrar los servicios adecuados para sus animales.`,
        },
        {
          name: "Servicios Profesionales",
          description:
            "Abogados, contadores, asesores financieros, arquitectos.",
          helpText: `Ejemplos de Nombres para Agendas:
  Agenda de Consultas Legales: Para programar y registrar las consultas iniciales con clientes.
  Agenda de Audiencias: Para coordinar fechas y horarios de las audiencias judiciales.
  Agenda de Reuniones de Mediación: Para organizar las sesiones de mediación entre partes.
  Agenda de Asesorías: Para agendar asesorías legales en diversas áreas del derecho.
  Agenda de Seguimiento de Casos: Para llevar un control de los casos abiertos y su evolución.
  Ejemplos de Nombres para Servicios:
  Consulta Legal Inicial: Para ofrecer una primera consulta sobre cualquier tema legal.
  Asesoría en Derecho de Familia: Para brindar servicios relacionados con divorcios, custodia de hijos, y pensiones alimenticias.
  Asesoría en Derecho Laboral: Para ayudar con problemas laborales, despidos y contratos de trabajo.
  Asesoría en Derecho Penal: Para representar a clientes en casos penales y proporcionar defensa legal.
  Redacción de Contratos: Para ofrecer servicios de redacción y revisión de contratos legales.
  Gestión de Herencias: Para asesorar sobre la planificación patrimonial y la gestión de herencias.
  Defensa en Juicios: Para representar a los clientes en procedimientos judiciales.
  Consejos Generales:
  Sé Claro y Descriptivo: Utiliza nombres que sean fáciles de entender y que reflejen con precisión los servicios ofrecidos.
  Especifica el Área de Práctica: Incluye términos que indiquen el tipo de derecho que se está tratando, para que los clientes sepan a qué acudir.
  Mantén Consistencia: Utiliza un formato uniforme en todos los nombres para facilitar la identificación y organización.
  Con estas sugerencias, podrás gestionar de manera eficiente las operaciones de tu consultorio legal, mejorando la experiencia de tus clientes y facilitando la administración de tus servicios.`,
        },
        {
          name: "Educación y Capacitación",
          description:
            "Clases individuales, asesorías académicas, sesiones de coaching.",
          helpText: `Ejemplos de Nombres para Agendas:
  Agenda de Clases de Música: Para programar y llevar un registro de las clases de música individuales.
  Agenda de Clases de Idiomas: Para coordinar las clases de idiomas como inglés, español, francés, etc.
  Agenda de Clases de Arte: Para agendar clases de dibujo, pintura o escultura.
  Agenda de Clases de Matemáticas: Para organizar sesiones de tutoría y clases individuales de matemáticas.
  Agenda de Clases de Programación: Para gestionar horarios de clases de programación y desarrollo de software.
  Agenda de Clases de Fitness: Para agendar entrenamientos personales o clases individuales de fitness y bienestar.
  Ejemplos de Nombres para Servicios:
  Lecciones de Guitarra: Para ofrecer clases específicas de guitarra.
  Clases de Canto: Para sesiones individuales de técnica vocal y canto.
  Clases de Matemáticas Personalizadas: Para ofrecer tutorías individuales adaptadas al nivel del estudiante.
  Clases de Fotografía: Para enseñar técnicas de fotografía en sesiones individuales.
  Entrenamiento Personalizado de Fitness: Para sesiones de entrenamiento adaptadas a las necesidades del cliente.
  Clases de Cocina: Para ofrecer clases prácticas de cocina sobre diferentes tipos de cocina o técnicas culinarias.
  Clases de Baile: Para ofrecer lecciones de baile en estilos específicos como salsa, tango, o hip-hop.
  Consejos Generales:
  Sé Claro y Descriptivo: Asegúrate de que los nombres sean fáciles de entender y reflejen exactamente lo que ofreces.
  Usa Términos Específicos: Incluye el área de estudio o actividad en el nombre para que los estudiantes identifiquen rápidamente el servicio.
  Mantén Consistencia: Usa un formato y estilo uniforme en todos los nombres para facilitar la identificación y organización.
  Con estas sugerencias, podrás gestionar eficazmente las operaciones de tus clases individuales, mejorando la experiencia de tus estudiantes y facilitando la administración de tus servicios.`,
        },
        {
          name: "Automotriz",
          description:
            "Talleres mecánicos, servicios de mantenimiento y reparación, concesionarias para pruebas de manejo.",
          helpText: `Ejemplos de Nombres para Agendas:
  Agenda de Reparaciones: Para programar y llevar un registro de las reparaciones de vehículos.
  Agenda de Mantenimiento: Para coordinar servicios de mantenimiento preventivo y correctivo.
  Agenda de Citas de Inspección: Para agendar inspecciones de vehículos según normativas locales.
  Agenda de Pruebas de Diagnóstico: Para programar pruebas y diagnósticos de problemas mecánicos o eléctricos.
  Ejemplos de Nombres para Servicios:
  Servicio de Cambio de Aceite: Para ofrecer el cambio de aceite y filtros de motor.
  Reparación de Transmisiones: Para abordar problemas relacionados con la transmisión del vehículo.
  Frenos y Suspensión: Para servicios de revisión y reparación de sistemas de frenos y suspensión.
  Diagnóstico Electrónico: Para la evaluación de fallas eléctricas y electrónicas del vehículo.
  Alineación y Balanceo: Para ofrecer servicios de alineación y balanceo de ruedas.
  Reparación de Sistemas de Escape: Para arreglos relacionados con el sistema de escape del vehículo.
  Mantenimiento de Sistemas de Climatización: Para servicios de revisión y reparación de aires acondicionados y calefacción.
  Consejos Generales:
  Sé Claro y Descriptivo: Asegúrate de que los nombres sean fáciles de entender y reflejen exactamente lo que ofreces.
  Usa Términos Técnicos Comprensibles: Utiliza términos que tus clientes puedan reconocer y entender, evitando jerga excesiva.
  Mantén Consistencia: Usa un formato y estilo uniforme en todos los nombres para facilitar la identificación y organización.
  Con estas sugerencias, podrás gestionar eficazmente las operaciones de tu taller mecánico, mejorando la experiencia de tus clientes y facilitando la administración de tus servicios.`,
        },
        {
          name: "Tecnología y Soporte Técnico",
          description:
            "Reparación de dispositivos, atención técnica en centros de servicio.",
          helpText: `Ejemplos de Nombres para Agendas:
  Agenda de Reparaciones: Para programar y llevar un registro de las reparaciones de computadoras.
  Agenda de Recogidas y Entregas: Para coordinar la recolección y entrega de dispositivos reparados.
  Agenda de Consultas Técnicas: Para agendar reuniones o consultas sobre problemas técnicos con los clientes.
  Agenda de Mantenimiento Preventivo: Para gestionar los servicios de mantenimiento regular ofrecidos a los clientes.
  Ejemplos de Nombres para Servicios:
  Servicio de Diagnóstico de PC: Para evaluar problemas y ofrecer soluciones específicas.
  Reparación de Hardware: Para servicios relacionados con la reparación de componentes físicos como discos duros, placas madre, etc.
  Reparación de Software: Para solucionar problemas de software, como virus, fallos de sistema o configuraciones.
  Servicio de Optimización: Para mejorar el rendimiento del PC mediante limpieza de software, ajustes de configuración, etc.
  Actualización de Componentes: Para ofrecer servicios de actualización de hardware, como RAM, tarjetas gráficas, etc.
  Soporte Técnico Remoto: Para brindar asistencia técnica a distancia a través de software de control remoto.
  Consejos Generales:
  Sé Claro y Descriptivo: Asegúrate de que los nombres sean fáciles de entender y reflejen exactamente lo que ofreces.
  Usa Términos Técnicos Comprensibles: Aunque es un campo técnico, utiliza términos que tus clientes puedan reconocer y entender.
  Mantén Consistencia: Usa un formato y estilo uniforme en todos los nombres para facilitar la identificación y organización.
  Con estas sugerencias, podrás gestionar eficazmente las operaciones de tu negocio de reparaciones de PC, mejorando la experiencia de tus clientes y facilitando la administración de tus servicios.`,
        },
        {
          name: "Arte y Entretenimiento",
          description: "Clases individuales de arte, música, fotografía.",
          helpText: `Ejemplos de Nombres para Agendas:
  Agenda de Clases de Guitarra: Para programar sesiones específicas de enseñanza de guitarra.
  Agenda de Clases de Piano: Para gestionar horarios de clases dedicadas al piano.
  Agenda de Clases de Canto: Para programar sesiones de enseñanza vocal.
  Agenda de Clases de Teoría Musical: Para organizar sesiones donde se enseñará la teoría detrás de la música.
  Ejemplos de Nombres para Servicios:
  Clase de Guitarra Acústica: Servicio que ofrece lecciones para aprender a tocar la guitarra acústica.
  Clase de Piano para Principiantes: Servicio dirigido a principiantes que desean aprender piano desde cero.
  Clase de Canto para Niños: Servicio diseñado especialmente para clases de canto para niños.
  Clase de Teoría Musical Avanzada: Servicio que ofrece lecciones de teoría musical para estudiantes avanzados.
  Clase de Composición Musical: Servicio que ayuda a los estudiantes a escribir y componer su propia música.
  Clase de Improvisación Jazz: Servicio que enseña técnicas de improvisación en el estilo de jazz.
  Clase de Instrumentos de Cuerda: Servicio que abarca la enseñanza de varios instrumentos de cuerda, como el violín o el bajo.
  Consejos Generales:
  Sé Claro y Descriptivo: Asegúrate de que el nombre del servicio indique claramente lo que ofreces.
  Usa Términos Reconocibles: Escoge nombres que sean comprensibles y familiares para tus estudiantes.
  Mantén Consistencia: Utiliza un formato uniforme en todos los nombres de tus servicios y agendas para una mejor organización.
  Al seguir estas recomendaciones, podrás estructurar eficientemente tus clases de música, facilitando a tus alumnos encontrar las lecciones que desean tomar y mejorar su experiencia de aprendizaje musical.`,
        },
        {
          name: "Alquiler de Canchas Deportivas",
          description:
            "Fútbol, tenis, pádel, básquet, entre otros deportes que requieren reservar un espacio exclusivo por turno.",
          helpText: `Ejemplos de Nombres para Agendas:
  Agenda de Canchas de Fútbol 5: Para organizar las reservas de canchas de fútbol 5.
  Agenda de Canchas de Fútbol 11: Para programar las reservas de canchas de fútbol 11.
  Agenda de Torneos de Fútbol: Para gestionar las fechas y horarios de los torneos organizados en tus canchas.
  Agenda de Entrenamientos: Para reservar horarios específicos para entrenamientos de equipos.
  Ejemplos de Nombres para Servicios:
  Alquiler de Cancha de Fútbol 5: Servicio que permite a los usuarios alquilar una cancha de fútbol 5 por un período específico.
  Alquiler de Cancha de Fútbol 11: Servicio destinado al alquiler de canchas de fútbol 11.
  Alquiler de Cancha con Iluminación: Servicio que ofrece la opción de alquilar canchas con iluminación para jugar en la noche.
  Paquete de Alquiler por Horas: Servicio que ofrece un descuento por el alquiler de la cancha durante varias horas consecutivas.
  Alquiler de Cancha para Eventos: Servicio que permite reservar canchas para eventos especiales o partidos amistosos.
  Consejos Generales:
  Sé Claro y Descriptivo: Asegúrate de que el nombre del servicio indique claramente lo que ofreces.
  Usa Términos Reconocibles: Utiliza nombres que sean comprensibles y familiares para tus clientes.
  Mantén Consistencia: Usa un formato uniforme en todos los nombres de tus servicios y agendas para una mejor organización.
  Con estas sugerencias, podrás gestionar eficientemente las reservas de tus canchas de fútbol, mejorando la experiencia de tus clientes y facilitando la administración de tu negocio.`,
        },
        {
          name: "Otros",
          description: "Otros Servicios",
          visibleInWeb: false,
          helpText: `Ejemplos de Nombres para Agendas:
  Agenda de Citas: Para programar las citas de tus clientes de manera general.
  Agenda de Consultas: Para gestionar las consultas y reuniones con tus clientes.
  Agenda de Talleres y Eventos: Para organizar y programar talleres o eventos especiales que ofreces.
  Agenda de Reservas: Para facilitar la gestión de reservas en tu negocio.
  Ejemplos de Nombres para Servicios:
  Servicio de Atención al Cliente: Para brindar asistencia y resolver consultas de tus clientes.
  Servicio de Asesoría: Para ofrecer consultas o asesorías personalizadas sobre tus productos o servicios.
  Servicio de Entrega: Para gestionar las entregas de productos a tus clientes.
  Servicio de Mantenimiento: Para ofrecer mantenimiento o soporte post-venta de los productos o servicios que ofreces.
  Paquete Promocional: Servicio que combina varios productos o servicios a un precio especial.
  Consejos Generales:
  Sé Claro y Descriptivo: Asegúrate de que los nombres de los servicios y agendas sean fáciles de entender y reflejen lo que ofreces.
  Usa Términos Reconocibles: Opta por nombres que sean familiares y comprensibles para tus clientes.
  Mantén Consistencia: Usa un formato y estilo uniforme en todos los nombres para una mejor organización y claridad.
  Con estas sugerencias, podrás gestionar eficientemente las operaciones de tu negocio, mejorando la experiencia de tus clientes y facilitando la administración de tus servicios.`,
        },
      ],
    });
  }

  const countCompanyPlans = await prisma.companyPlan.count();
  if (countCompanyPlans === 0) {
    await prisma.companyPlan.createMany({
      data: [
        {
          name: "Gratuito",
          price: 0,
          maxSchedules: 1,
          maxSppointmentsPerSchedule: 50,
          payments: false,
          analytics: false,
          multipleBusinessHours: false,
        },
        {
          name: "Básico",
          price: 9.99,
          maxSchedules: 3,
          maxSppointmentsPerSchedule: 99,
          payments: false,
          analytics: false,
          multipleBusinessHours: false,
        },
        {
          name: "Profesional",
          price: 19.99,
          maxSchedules: 50,
          maxSppointmentsPerSchedule: 999,
          payments: true,
          analytics: false,
          multipleBusinessHours: true,
        },
        {
          name: "Premium",
          price: 24.99,
          maxSchedules: 50,
          maxSppointmentsPerSchedule: 999,
          payments: true,
          analytics: true,
          multipleBusinessHours: true,
        },
      ],
    });
  }
  if (countCompanyPlans === 1) {
    await prisma.companyPlan.createMany({
      data: [
        {
          name: "Básico",
          price: 9.99,
          maxSchedules: 3,
          maxSppointmentsPerSchedule: 99,
          payments: false,
          analytics: false,
          multipleBusinessHours: false,
        },
        {
          name: "Profesional",
          price: 19.99,
          maxSchedules: 50,
          maxSppointmentsPerSchedule: 999,
          payments: true,
          analytics: false,
          multipleBusinessHours: true,
        },
        {
          name: "Premium",
          price: 24.99,
          maxSchedules: 50,
          maxSppointmentsPerSchedule: 999,
          payments: true,
          analytics: true,
          multipleBusinessHours: true,
        },
      ],
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
