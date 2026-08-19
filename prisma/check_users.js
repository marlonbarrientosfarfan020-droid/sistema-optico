const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  // Update all accounts with name Marlon Barrientos Farfan or email marlon
  const updated = await prisma.user.updateMany({
    where: {
      OR: [
        { name: { contains: "Marlon", mode: "insensitive" } },
        { email: { contains: "marlon", mode: "insensitive" } },
      ],
    },
    data: {
      passwordHash: "1234",
    },
  });

  console.log("Usuarios actualizados a contraseña 1234:", updated);
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
