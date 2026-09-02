import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { WifiOff, AlertTriangle, Users, Activity, List } from "lucide-react"
import { SurveyCharts } from "@/components/admin/SurveyCharts"
import { ExportExcelButton } from "@/components/admin/ExportExcelButton"

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  try {
    const session = await auth()
    
    // Since we deleted the role check, just ensure they are logged in.
    if (!session?.user) {
      redirect("/login")
    }

    // Use Colombia timezone for "today" by default
    const nowBogota = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Bogota"}));
    const defaultDateStr = nowBogota.toISOString().split('T')[0]
    
    const params = await searchParams || {};
    const targetDateStr = params.date || defaultDateStr; // e.g. '2026-09-01'
    
    // Create UTC boundaries for the Bogota target date
    // 00:00:00 Bogota = 05:00:00 UTC
    // 23:59:59 Bogota = 04:59:59 UTC next day
    const startDate = new Date(`${targetDateStr}T00:00:00.000-05:00`)
    const endDate = new Date(`${targetDateStr}T23:59:59.999-05:00`)

    const responses = await prisma.surveyResponse.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Filter current day stats
    const todayResponses = responses.filter(r => r.createdAt >= startDate && r.createdAt <= endDate)
    
    const droppedCount = todayResponses.filter(r => r.seHaCaido).length
    const intermitenteCount = todayResponses.filter(r => r.intermitencia).length
    const buenaCount = todayResponses.filter(r => r.calificacion === 'Bueno' || r.calificacion === 'Buena' || r.calificacion === 'Excelente').length
    const regularCount = todayResponses.filter(r => r.calificacion === 'Regular').length
    const malaCount = todayResponses.filter(r => r.calificacion === 'Mala' || r.calificacion === 'Muy mala' || r.calificacion === 'Malo').length
    const sinNovedadCount = todayResponses.filter(r => !r.seHaCaido && !r.intermitencia && (r.calificacion === 'Bueno' || r.calificacion === 'Buena' || r.calificacion === 'Excelente') && !r.novedad).length

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
        caidas: dayResponses.filter(r => r.seHaCaido).length,
        intermitencia: dayResponses.filter(r => r.intermitencia).length,
        buenas: dayResponses.filter(r => r.calificacion === 'Bueno' || r.calificacion === 'Buena' || r.calificacion === 'Excelente').length,
        regulares: dayResponses.filter(r => r.calificacion === 'Regular').length,
        malas: dayResponses.filter(r => r.calificacion === 'Mala' || r.calificacion === 'Muy mala' || r.calificacion === 'Malo').length,
        sinNovedad: dayResponses.filter(r => !r.seHaCaido && !r.intermitencia && (r.calificacion === 'Bueno' || r.calificacion === 'Buena' || r.calificacion === 'Excelente') && !r.novedad).length,
        total: dayResponses.length
      })
    }

    // Group by salon to find the most intermittent ones (ONLY count those with failures)
    const failedResponses = responses.filter(r => r.seHaCaido || r.intermitencia || r.calificacion === 'Malo' || r.calificacion === 'Mala' || r.calificacion === 'Muy mala' || r.calificacion === 'Regular' || r.novedad);
    const salonGroups = failedResponses.reduce((acc: any, r: any) => {
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
              defaultValue={targetDateStr}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors">
              Filtrar
            </button>
          </form>
        </div>

        {/* Stats Grid for Today */}
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Resumen del Día Seleccionado</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <div className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-blue-400"><Users className="w-12 h-12" /></div>
            <p className="text-xs font-medium text-gray-400 mb-2">Total</p>
            <p className="text-3xl font-bold text-white">{todayResponses.length}</p>
          </div>
          <div className="glass rounded-2xl p-6 border border-green-500/20 relative overflow-hidden group bg-gradient-to-br from-green-500/5 to-transparent">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-green-500"><Activity className="w-12 h-12" /></div>
            <p className="text-xs font-medium text-gray-400 mb-2">Buena</p>
            <p className="text-3xl font-bold text-white">{buenaCount}</p>
          </div>
          <div className="glass rounded-2xl p-6 border border-orange-500/20 relative overflow-hidden group bg-gradient-to-br from-orange-500/5 to-transparent">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-orange-500"><Activity className="w-12 h-12" /></div>
            <p className="text-xs font-medium text-gray-400 mb-2">Regular</p>
            <p className="text-3xl font-bold text-white">{regularCount}</p>
          </div>
          <div className="glass rounded-2xl p-6 border border-red-500/20 relative overflow-hidden group bg-gradient-to-br from-red-500/5 to-transparent">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-red-500"><AlertTriangle className="w-12 h-12" /></div>
            <p className="text-xs font-medium text-gray-400 mb-2">Mala</p>
            <p className="text-3xl font-bold text-white">{malaCount}</p>
          </div>
          <div className="glass rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden group bg-gradient-to-br from-emerald-500/5 to-transparent">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-emerald-500"><Users className="w-12 h-12" /></div>
            <p className="text-xs font-medium text-gray-400 mb-2">Sin Novedad</p>
            <p className="text-3xl font-bold text-white">{sinNovedadCount}</p>
          </div>
          <div className="glass rounded-2xl p-6 border border-yellow-500/20 relative overflow-hidden group bg-gradient-to-br from-yellow-500/5 to-transparent">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-yellow-500"><Activity className="w-12 h-12" /></div>
            <p className="text-xs font-medium text-gray-400 mb-2">Intermitencias</p>
            <p className="text-3xl font-bold text-white">{intermitenteCount}</p>
          </div>
          <div className="glass rounded-2xl p-6 border border-red-500/20 relative overflow-hidden group bg-gradient-to-br from-red-500/5 to-transparent">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-red-500"><WifiOff className="w-12 h-12" /></div>
            <p className="text-xs font-medium text-gray-400 mb-2">Caídas</p>
            <p className="text-3xl font-bold text-white">{droppedCount}</p>
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
                        <p className="text-xs text-blue-400">Red: {r.network} | Correo: {r.correo}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {r.createdAt.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded ${r.calificacion === 'Bueno' ? 'bg-green-500/20 text-green-400' : r.calificacion === 'Regular' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>Calidad: {r.calificacion}</span>
                      {r.seHaCaido && <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded">Caída</span>}
                      {r.intermitencia && <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">Intermitente</span>}
                      {!r.seHaCaido && !r.intermitencia && !r.novedad && r.calificacion === 'Bueno' && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-medium">Sin novedad (OK)</span>
                      )}
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

        {/* Excel Table Section */}
        <div className="glass rounded-2xl border border-white/5 p-6 overflow-x-auto mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white m-0">
              <List className="w-5 h-5 text-blue-400" />
              Tabla de Datos Completos
            </h2>
            <ExportExcelButton data={todayResponses} />
          </div>
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/10 text-gray-300">
                <th className="p-3 border border-white/10 font-medium">Fecha</th>
                <th className="p-3 border border-white/10 font-medium">Ficha</th>
                <th className="p-3 border border-white/10 font-medium">Salón</th>
                <th className="p-3 border border-white/10 font-medium">Red</th>
                <th className="p-3 border border-white/10 font-medium">Instructor</th>
                <th className="p-3 border border-white/10 font-medium">Aprendiz</th>
                <th className="p-3 border border-white/10 font-medium">Correo</th>
                <th className="p-3 border border-white/10 font-medium">Novedad</th>
              </tr>
            </thead>
            <tbody>
              {todayResponses.map(r => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors text-sm text-gray-300 border-b border-white/5">
                  <td className="p-3 border border-white/5">
                    {r.createdAt.toLocaleDateString('es-CO')}
                  </td>
                  <td className="p-3 border border-white/5">{r.ficha}</td>
                  <td className="p-3 border border-white/5 font-bold text-yellow-400">{r.salon}</td>
                  <td className="p-3 border border-white/5 text-blue-400">{r.network}</td>
                  <td className="p-3 border border-white/5">{r.instructor}</td>
                  <td className="p-3 border border-white/5">{r.aprendiz}</td>
                  <td className="p-3 border border-white/5 text-gray-400">{r.correo}</td>
                  <td className="p-3 border border-white/5 text-gray-400 italic">
                    {[r.seHaCaido ? 'CAÍDA' : '', r.intermitencia ? 'INTERMITENTE' : '', `Calidad: ${r.calificacion}`, r.novedad].filter(Boolean).join(' | ') || 'Sin novedad (OK)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  } catch (error: any) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-xl max-w-2xl w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-8 h-8" />
            Error en el Dashboard
          </h2>
          <div className="bg-black/50 p-4 rounded-lg overflow-x-auto text-gray-300 font-mono text-sm">
            {error.message || JSON.stringify(error)}
            {error.stack && (
              <pre className="mt-4 text-xs text-gray-500 overflow-x-auto whitespace-pre-wrap">{error.stack}</pre>
            )}
          </div>
        </div>
      </div>
    )
  }
}
