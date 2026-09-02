'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function SurveyCharts({ data }: { data: any[] }) {
  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend />
          <Bar dataKey="sinNovedad" name="Sin Novedad (OK)" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
          <Bar dataKey="buenas" name="Buenas" stackId="a" fill="#22C55E" radius={[0, 0, 0, 0]} />
          <Bar dataKey="regulares" name="Regulares" stackId="a" fill="#F97316" radius={[0, 0, 0, 0]} />
          <Bar dataKey="malas" name="Malas" stackId="a" fill="#DC2626" radius={[0, 0, 0, 0]} />
          <Bar dataKey="intermitencia" name="Intermitencias" stackId="a" fill="#EAB308" radius={[0, 0, 0, 0]} />
          <Bar dataKey="caidas" name="Caídas" stackId="a" fill="#991B1B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
