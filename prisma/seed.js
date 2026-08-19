const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando semillero de datos (Seed) para Sistema Óptico...");

  // 1. Crear Sucursal
  const branch = await prisma.branch.upsert({
    where: { code: "SEDE-MIRAFLORES" },
    update: {},
    create: {
      name: "Sede Principal Miraflores",
      code: "SEDE-MIRAFLORES",
      address: "Av. Larco 1045, Miraflores, Lima",
      phone: "+51 1 445-8920",
      email: "miraflores@opticacore.com",
    },
  });

  // 2. Crear Usuarios (Optometrista, Vendedor, Laboratorio)
  const optometrist = await prisma.user.upsert({
    where: { email: "dr.reyes@opticacore.com" },
    update: {},
    create: {
      name: "Dr. Alejandro Reyes",
      email: "dr.reyes@opticacore.com",
      passwordHash: "demo123456", // En producción usar bcrypt
      role: "OPTOMETRIST",
      phone: "+51 998 765 432",
      branchId: branch.id,
    },
  });

  // 3. Crear Categorías y Marcas
  const catFrames = await prisma.category.upsert({
    where: { slug: "monturas" },
    update: {},
    create: { name: "Monturas Oftálmicas", slug: "monturas", description: "Armazones de acetato, metal y titanio" },
  });

  const catLenses = await prisma.category.upsert({
    where: { slug: "cristales" },
    update: {},
    create: { name: "Cristales y Lunas", slug: "cristales", description: "Lunas monofocales, bifocales y progresivos" },
  });

  const brandRayBan = await prisma.brand.upsert({
    where: { slug: "ray-ban" },
    update: {},
    create: { name: "Ray-Ban", slug: "ray-ban" },
  });

  const brandOakley = await prisma.brand.upsert({
    where: { slug: "oakley" },
    update: {},
    create: { name: "Oakley", slug: "oakley" },
  });

  // 4. Crear Productos
  const frame1 = await prisma.product.upsert({
    where: { sku: "FRM-RB5154-BLK" },
    update: {},
    create: {
      sku: "FRM-RB5154-BLK",
      barcode: "71313200101",
      name: "Ray-Ban Clubmaster RB5154",
      description: "Montura clásica estilo Clubmaster color negro con detalles dorados",
      category: "FRAME",
      categoryId: catFrames.id,
      brandId: brandRayBan.id,
      branchId: branch.id,
      frameModel: "RB5154",
      frameColor: "Negro / Dorado",
      frameMaterial: "Acetato / Metal",
      frameEyeSize: 51,
      frameBridge: 21,
      frameTemple: 145,
      costPrice: 85.0,
      salePrice: 180.0,
      stock: 8,
      minStock: 2,
    },
  });

  const lensProgressive = await prisma.product.upsert({
    where: { sku: "LNS-PROG-FREE-167" },
    update: {},
    create: {
      sku: "LNS-PROG-FREE-167",
      name: "Progresivo Digital Freeform 1.67 Blue Block",
      description: "Lente progresivo personalizado de alto índice con filtro de luz azul",
      category: "OPHTHALMIC_LENS",
      categoryId: catLenses.id,
      costPrice: 90.0,
      salePrice: 220.0,
      stock: 25,
      minStock: 5,
    },
  });

  // 5. Crear Paciente de Prueba
  const patient = await prisma.patient.upsert({
    where: {
      documentType_documentId: {
        documentType: "DNI",
        documentId: "47891234",
      },
    },
    update: {},
    create: {
      documentType: "DNI",
      documentId: "47891234",
      firstName: "Carlos",
      lastName: "Mendoza Silva",
      email: "carlos.mendoza@email.com",
      phone: "+51 987 654 321",
      address: "Calle Los Pinos 340, Dpto 402, Miraflores",
      gender: "MALE",
      occupation: "Ingeniero de Software",
      medicalHistory: {
        hasDiabetes: false,
        hasHypertension: false,
        hasGlaucoma: false,
        allergies: "Ninguna",
        notes: "Fatiga visual por uso constante de pantallas.",
      },
      branchId: branch.id,
    },
  });

  // 6. Crear Receta Optométrica de Prueba
  const prescription = await prisma.prescription.upsert({
    where: { code: "REC-2026-0001" },
    update: {},
    create: {
      code: "REC-2026-0001",
      patientId: patient.id,
      optometristId: optometrist.id,
      branchId: branch.id,
      odSphere: -1.75,
      odCylinder: -0.75,
      odAxis: 90,
      odAddition: 1.5,
      odVisualAcuityFar: "20/20",
      odVisualAcuityNear: "20/20",

      osSphere: -2.0,
      osCylinder: -0.5,
      osAxis: 85,
      osAddition: 1.5,
      osVisualAcuityFar: "20/20",
      osVisualAcuityNear: "20/20",

      pupillaryDistance: 63.0,
      npdFarOD: 31.5,
      npdFarOS: 31.5,
      pupilHeightOD: 19.0,
      pupilHeightOS: 19.0,

      lensType: "PROGRESSIVE",
      lensMaterial: "HIGH_INDEX_1_67",
      treatments: ["ANTIREFLECTIVE", "BLUE_BLOCK", "UV400"],
      usage: "Trabajo en Computadora y Permanente",
      notes: "Adaptación a lentes progresivos con tratamiento antirreflejo y filtro azul.",
    },
  });

  console.log("Seed completado exitosamente:");
  console.log(`- Sucursal: ${branch.name}`);
  console.log(`- Paciente: ${patient.firstName} ${patient.lastName}`);
  console.log(`- Receta: ${prescription.code}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
