const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.surveyResponse.count();
  console.log('Total encuestas:', count);
  const all = await prisma.surveyResponse.findMany();
  console.log(all);
}

main().finally(() => prisma.$disconnect());
