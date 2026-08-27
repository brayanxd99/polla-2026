import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { WifiOff, AlertTriangle, Users, Activity } from "lucide-react"
import { SurveyCharts } from "@/components/admin/SurveyCharts"

export default async function DashboardPage({ searchParams }: { searchParams: { date?: string } }) {
  const session = await auth()
  
  // Since we deleted the role check, just ensure they are logged in.
  if (!session?.user) {
    redirect("/login")
  }

  // Parse date filter
  const today = new Date()
  let startDate = new Date(today.setHours(0, 0, 0, 0))
  let endDate = new Date(today.setHours(23, 59, 59, 999))
  
  if (searchParams.date) {
    const selected = new Date(searchParams.date)
    startDate = new Date(selected.setHours(0, 0, 0, 0))
    endDate = new Date(selected.setHours(23, 59, 59, 999))
  }

  const responses = await prisma.surveyResponse.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Filter current day stats
  const todayResponses = responses.filter(r => r.createdAt >= startDate && r.createdAt <= endDate)
  
  const droppedCount = todayResponses.filter(r => r.hasDropped).length
  const issuesCount = todayResponses.filter(r => r.hasIssues).length
  const slowCount = todayResponses.filter(r => r.isSlow).length

  // Build weekly chart data (last 7 days)
  const chartData = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const start = new Date(d.setHours(0, 0, 0, 0))
    const end = new Date(d.setHours(23, 59, 59, 999))
    
    const dayResponses = responses.filter(r => r.createdAt >= start && r.createdAt <= end)
    
    chartData.push({
      name: d.toLocaleDateString('es-CO', { weekday: 'short' }),
      caidas: dayResponses.filter(r => r.hasDropped).length,
      lento: dayResponses.filter(r => r.isSlow).length,
      novedad: dayResponses.filter(r => r.hasIssues).length,
      total: dayResponses.length
    })
  }

  // Group by salon to find the most intermittent ones
  const salonGroups = responses.reduce((acc: any, r: any) => {
    if (!acc[r.salon]) acc[r.salon] = 0;
    acc[r.salon]++;
    return acc;
  }, {});

  const topSalones = Object.entries(salonGroups)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5); // Top 5 worst

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Monitor de Internet</h1>
          <p className="text-gray-400">Panel administrativo de reportes de red.</p>
        </div>
        
        {/* Simple Date Filter */}
        <form className="flex items-center gap-2">
          <input 
            type="date" 
            name="date"
            defaultValue={searchParams.date || new Date().toISOString().split('T')[0]}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors">
            Filtrar
          </button>
        </form>
      </div>

      {/* Stats Grid for Today */}
      <h2 className="text-xl font-bold text-white mt-8 mb-4">Resumen del Día Seleccionado</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 text-blue-400"><Users className="w-12 h-12" /></div>
          <p className="text-sm font-medium text-gray-400 mb-2">Total Reportes</p>
          <p className="text-4xl font-bold text-white">{todayResponses.length}</p>
        </div>
        <div className="glass rounded-2xl p-6 border border-red-500/20 relative overflow-hidden group bg-gradient-to-br from-red-500/5 to-transparent">
          <div className="absolute top-0 right-0 p-4 opacity-20 text-red-500"><WifiOff className="w-12 h-12" /></div>
          <p className="text-sm font-medium text-gray-400 mb-2">Caídas Totales</p>
          <p className="text-4xl font-bold text-white">{droppedCount}</p>
        </div>
        <div className="glass rounded-2xl p-6 border border-yellow-500/20 relative overflow-hidden group bg-gradient-to-br from-yellow-500/5 to-transparent">
          <div className="absolute top-0 right-0 p-4 opacity-20 text-yellow-500"><Activity className="w-12 h-12" /></div>
          <p className="text-sm font-medium text-gray-400 mb-2">Internet Lento</p>
          <p className="text-4xl font-bold text-white">{slowCount}</p>
        </div>
        <div className="glass rounded-2xl p-6 border border-blue-500/20 relative overflow-hidden group bg-gradient-to-br from-blue-500/5 to-transparent">
          <div className="absolute top-0 right-0 p-4 opacity-20 text-blue-500"><AlertTriangle className="w-12 h-12" /></div>
          <p className="text-sm font-medium text-gray-400 mb-2">Otras Novedades</p>
          <p className="text-4xl font-bold text-white">{issuesCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Charts & Ranking */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-2xl border border-white/5 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-yellow-400" />
              Tendencia Semanal
            </h2>
            <SurveyCharts data={chartData} />
          </div>

          <div className="glass rounded-2xl border border-white/5 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Salones con más fallas (Histórico)
            </h2>
            <div className="space-y-4">
              {topSalones.length === 0 ? (
                <div className="text-gray-500 text-sm">No hay reportes suficientes.</div>
              ) : (
                topSalones.map((item, i) => (
                  <div key={item[0]} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-gray-400">#{i + 1}</span>
                      <span className="text-lg text-white font-medium">{item[0]}</span>
                    </div>
                    <span className="text-yellow-400 font-bold bg-yellow-400/10 px-3 py-1 rounded-full">
                      {item[1]} reportes
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Latest Comments */}
        <div className="glass rounded-2xl border border-white/5 p-6 flex flex-col h-full max-h-[800px]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Últimos Reportes (Día)
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {todayResponses.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-8">No hay reportes hoy.</div>
            ) : (
              todayResponses.map(r => (
                <div key={r.id} className="bg-white/5 border border-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-yellow-400 text-sm">Salón: {r.salon}</span>
                      <p className="text-xs text-gray-400">Ficha: {r.ficha} | Inst: {r.instructor}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {r.createdAt.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 mb-2">
                    {r.hasDropped && <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded">Caída</span>}
                    {r.isSlow && <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">Lento</span>}
                    {r.hasIssues && <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">Novedad</span>}
                  </div>
                  
                  {r.novedad && (
                    <p className="text-sm text-gray-300 bg-black/20 p-2 rounded italic">"{r.novedad}"</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
