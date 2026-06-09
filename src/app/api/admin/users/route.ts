import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    // Solo ADMIN puede crear usuarios desde aquí
    const adminUser = await prisma.user.findUnique({
      where: { id: session?.user?.id }
    })

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Ya existe un usuario con este correo electrónico" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 12)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ success: true, message: "Usuario creado exitosamente" })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
