import { Trophy } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-polla-neon" />
            <span className="text-xl font-bold tracking-tight">
              Polla<span className="text-polla-blue">26</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Polla Futbolera Mundial. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-sm font-medium text-muted-foreground">
            <span className="hover:text-white transition-colors">pocoyo :p</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
