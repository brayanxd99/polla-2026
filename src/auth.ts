import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const cleanEmail = (credentials.email as string).trim().toLowerCase()
        const user = await prisma.user.findUnique({
          where: { email: cleanEmail }
        })

        if (!user || !user.password) return null

        const cleanPassword = (credentials.password as string).trim()
        const passwordsMatch = await bcrypt.compare(
          cleanPassword,
          user.password
        )

        if (passwordsMatch) return user

        return null
      }
    })
  ],
})
