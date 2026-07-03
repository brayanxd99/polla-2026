import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // 1. Añadir la nueva columna de cuartos de final a los equipos
    await prisma.$executeRawUnsafe(`ALTER TABLE "Team" ADD COLUMN IF NOT EXISTS "advancedToQF" BOOLEAN NOT NULL DEFAULT false;`)
    
    // 2. Crear la tabla de pronósticos de cuartos de final
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "QFPrediction" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "teamId" TEXT NOT NULL,
          "pointsEarned" INTEGER,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "QFPrediction_pkey" PRIMARY KEY ("id")
      );
    `)

    // 3. Crear el índice único de seguridad para evitar dobles votaciones
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "QFPrediction_userId_teamId_key" ON "QFPrediction"("userId", "teamId");
    `)

    return NextResponse.json({ success: true, message: "¡Base de datos parchada y actualizada con éxito!" })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
