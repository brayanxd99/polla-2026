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
        'Novedad / Detalles': novedadStr
      }
    });

    // Generate Summary Data
    const droppedCount = data.filter(r => r.seHaCaido).length;
    const intermitenteCount = data.filter(r => r.intermitencia).length;
    const buenaCount = data.filter(r => r.calificacion === 'Bueno' || r.calificacion === 'Buena' || r.calificacion === 'Excelente').length;
    const regularCount = data.filter(r => r.calificacion === 'Regular').length;
    const malaCount = data.filter(r => r.calificacion === 'Mala' || r.calificacion === 'Muy mala' || r.calificacion === 'Malo').length;
    const sinNovedadCount = data.filter(r => !r.seHaCaido && !r.intermitencia && (r.calificacion === 'Bueno' || r.calificacion === 'Buena' || r.calificacion === 'Excelente') && !r.novedad).length;

    const summaryData = [
      { 'Métrica': 'Total Encuestas', 'Cantidad': data.length },
      { 'Métrica': 'Calidad: Buena', 'Cantidad': buenaCount },
      { 'Métrica': 'Calidad: Regular', 'Cantidad': regularCount },
      { 'Métrica': 'Calidad: Mala', 'Cantidad': malaCount },
      { 'Métrica': 'Sin Novedad (OK)', 'Cantidad': sinNovedadCount },
      { 'Métrica': 'Con Intermitencias', 'Cantidad': intermitenteCount },
      { 'Métrica': 'Con Caídas', 'Cantidad': droppedCount }
    ];

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create Summary Worksheet
    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Resumen General");

    // Create Data Worksheet
    const dataWorksheet = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(workbook, dataWorksheet, "Datos Completos");

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
