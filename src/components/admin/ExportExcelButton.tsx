'use client'

import { Download } from "lucide-react"
import * as XLSX from "xlsx"

export function ExportExcelButton({ data }: { data: any[] }) {
  const handleExport = () => {
    // Transform data to match the table format
    const formattedData = data.map(r => {
      // Create a date string
      const dateStr = new Date(r.createdAt).toLocaleDateString('es-CO');
      
      // Calculate Novedad string (exactly as it appears in the table)
      const parts = [];
      if (r.seHaCaido) parts.push('CAÍDA');
      if (r.intermitencia) parts.push('INTERMITENTE');
      if (r.calificacion) parts.push(`Calidad: ${r.calificacion}`);
      if (r.novedad) parts.push(r.novedad);
      const novedadStr = parts.filter(Boolean).join(' | ') || 'Sin novedad (OK)';
      
      return {
        'Fecha': dateStr,
        'Ficha': r.ficha,
        'Salón': r.salon,
        'Red': r.network,
        'Instructor': r.instructor,
        'Aprendiz': r.aprendiz,
        'Correo': r.correo,
        'Novedad / Detalles': novedadStr
      }
    });

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes de Internet");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "Reporte_Internet_Horizonte.xlsx");
  }

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
    >
      <Download className="w-4 h-4" />
      Exportar a Excel
    </button>
  )
}
