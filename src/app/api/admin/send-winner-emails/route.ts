import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Falta configurar RESEND_API_KEY en .env" }, { status: 500 })
    }

    // Get top 3 users
    const topUsersRaw = await prisma.user.findMany({
      where: { role: 'USER' },
      orderBy: [
        { totalPoints: "desc" },
        { exactMatches: "desc" },
      ],
      select: {
        id: true,
        name: true,
        email: true,
        totalPoints: true,
      }
    });

    const uniqueTopUsers = [];
    const seenNames = new Set();
    for (const user of topUsersRaw) {
      const key = user.name || user.id;
      if (!seenNames.has(key)) {
        seenNames.add(key);
        uniqueTopUsers.push(user);
      }
    }
    const top3 = uniqueTopUsers.slice(0, 3)

    if (top3.length === 0) {
      return NextResponse.json({ error: "No hay usuarios para premiar" }, { status: 400 })
    }

    const emailsToSend = top3.map((user, index) => {
      const place = index + 1
      const medalColor = place === 1 ? '#FFD700' : place === 2 ? '#C0C0C0' : '#CD7F32'
      const placeText = place === 1 ? '¡CAMPEÓN!' : place === 2 ? 'SUBCAMPEÓN' : 'TERCER LUGAR'

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #333;">
          
          <div style="background: linear-gradient(135deg, ${medalColor} 0%, #1a1a1a 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 900; text-transform: uppercase; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
              ¡Felicidades, ${user.name}!
            </h1>
            <p style="color: #ffffff; opacity: 0.9; margin-top: 10px; font-size: 18px;">
              Eres parte de la historia del Mundial 2026.
            </p>
          </div>

          <div style="padding: 40px 30px; text-align: center; background-color: #1a1a1a;">
            
            <div style="display: inline-block; background-color: #2a2a2a; border: 3px solid ${medalColor}; border-radius: 50%; width: 100px; height: 100px; line-height: 100px; text-align: center; font-size: 48px; font-weight: bold; margin-bottom: 20px; box-shadow: 0 0 20px ${medalColor}66;">
              ${place}
            </div>

            <h2 style="color: ${medalColor}; margin-top: 0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">
              ${placeText}
            </h2>
            
            <p style="font-size: 18px; line-height: 1.6; color: #dddddd;">
              La <strong>Corporación Universitaria Asturias</strong> te felicita enormemente por tu excelente desempeño, análisis y pasión durante la Polla del Mundial 2026.
            </p>

            <div style="background-color: #2a2a2a; border-radius: 12px; padding: 20px; margin-top: 30px; display: inline-block;">
              <p style="margin: 0; font-size: 14px; color: #aaaaaa; text-transform: uppercase;">Puntaje Final</p>
              <p style="margin: 5px 0 0 0; font-size: 36px; font-weight: 900; color: #CCFF00;">${user.totalPoints} pts</p>
            </div>
            
            <p style="font-size: 16px; margin-top: 30px; color: #888888; font-style: italic;">
              "Un estratega siempre tiene una visión más allá del campo."
            </p>

          </div>

          <div style="background-color: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #333;">
            <p style="margin: 0; font-size: 12px; color: #666666;">
              © 2026 Corporación Universitaria Asturias.<br/>
              Este correo es generado automáticamente por el sistema de Pronósticos.
            </p>
          </div>

        </div>
      `

      // Check if user has an email, if not, skip (though we shouldn't fail the whole loop)
      if (!user.email) return null

      return resend.emails.send({
        // In production, 'from' needs to be a verified domain on Resend (e.g. info@tu-dominio.com)
        // Since this is likely a test/free tier, Resend allows sending FROM onboarding@resend.dev TO the verified email only.
        // Wait, for testing, if the user doesn't have a verified domain, they can only send to their OWN email address registered in Resend.
        // I will use 'onboarding@resend.dev' as the default sender for testing purposes.
        from: 'Mundial 2026 <onboarding@resend.dev>',
        to: user.email,
        subject: `🏆 ¡Felicidades! Eres el ${placeText} del Mundial 2026`,
        html: htmlContent
      })
    }).filter(Boolean)

    if (emailsToSend.length === 0) {
      return NextResponse.json({ error: "Ninguno de los ganadores tiene un correo registrado." }, { status: 400 })
    }

    await Promise.all(emailsToSend)

    return NextResponse.json({ success: true, count: emailsToSend.length })

  } catch (error: any) {
    console.error("Error sending emails:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
