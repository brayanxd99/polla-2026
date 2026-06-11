import 'dotenv/config'
import * as xlsx from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

async function inspectExcel() {
  const dir = path.join(__dirname, '..')
  const files = fs.readdirSync(dir)
  const excelFile = files.find(f => f.includes('1-117') && f.endsWith('.xlsx'))

  if (!excelFile) {
    console.error("Excel file not found!")
    return
  }

  console.log("Reading file:", excelFile)
  const workbook = xlsx.readFile(path.join(dir, excelFile))
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  
  // Convert sheet to JSON array
  const data = xlsx.utils.sheet_to_json(sheet)
  
  console.log(`Found ${data.length} rows.`)
  if (data.length > 0) {
    console.log("First row:", data[0])
    console.log("Second row:", data[1])
  }
}

inspectExcel().catch(console.error)
