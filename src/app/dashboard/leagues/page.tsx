import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Trophy, Users, Plus, Hash } from "lucide-react"
import { LeaguesClient } from "./LeaguesClient"
import { MotionDiv, staggerContainer, fadeUpVariant } from "@/components/ui/motion-wrapper"

export default async function LeaguesPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Fetch leagues where the user is a member or owner
  const leagues = await prisma.league.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id
        }
      }
    },
    include: {
      owner: true,
      _count: {
        select: { members: true }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Mis Ligas</h1>
          <p className="text-muted-foreground">Compite con tus amigos y demuestra quién sabe más de fútbol.</p>
        </div>
        
        {/* Actions for Creating / Joining (Handled in Client Component) */}
        <LeaguesClient />
      </div>

      {leagues.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center border border-white/5 mt-8">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-polla-neon">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-4">No perteneces a ninguna liga</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Crea tu propia liga para invitar a tus amigos, o únete a una existente usando un código de invitación.
          </p>
        </div>
      ) : (
        <MotionDiv 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
        >
          {leagues.map((league) => (
            <MotionDiv 
              key={league.id} 
              variants={fadeUpVariant}
              className="glass rounded-2xl p-6 border border-white/5 relative group hover:border-polla-neon/30 transition-all"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy className="w-20 h-20" />
              </div>
              
              <h3 className="text-xl font-bold mb-2">{league.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Creada por {league.owner.id === session.user.id ? "ti" : league.owner.name}
              </p>
              
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <Users className="w-4 h-4 text-polla-blue" />
                  <span>{league._count.members} Miembros</span>
                </div>
                
                {league.ownerId === session.user.id && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <Hash className="w-4 h-4 text-polla-neon" />
                    <span className="font-mono">{league.inviteCode}</span>
                  </div>
                )}
              </div>
            </MotionDiv>
          ))}
        </MotionDiv>
      )}
    </div>
  )
}
