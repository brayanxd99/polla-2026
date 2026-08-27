import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function GET() {
  try {
    const email = 'admin@encuestas.com'
    const password = await hash('870211', 10)

    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        password,
        role: 'ADMIN',
        name: 'Administrador',
      },
      create: {
        email,
        password,
        role: 'ADMIN',
        name: 'Administrador',
      },
    })

    return NextResponse.json({ success: true, message: "Admin created", email: admin.email })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
