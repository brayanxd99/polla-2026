const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_eOmRH9wjbM2u@ep-purple-sunset-apjmqkap.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
  });
  
  await client.connect();
  
  // Get date range for today Bogota time
  const nowBogota = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Bogota"}));
  const dateStr = nowBogota.toISOString().split('T')[0];
  const start = new Date(`${dateStr}T00:00:00.000-05:00`);
  const end = new Date(`${dateStr}T23:59:59.999-05:00`);
  
  // Convert 3 Buena to Mala
  const updateToMala = `
    UPDATE "SurveyResponse" 
    SET calificacion = 'Mala'
    WHERE id IN (
      SELECT id FROM "SurveyResponse"
      WHERE "createdAt" >= $1 AND "createdAt" <= $2 AND calificacion IN ('Buena', 'Bueno')
      ORDER BY RANDOM()
      LIMIT 3
    )
  `;
  const res1 = await client.query(updateToMala, [start, end]);
  console.log(`Updated ${res1.rowCount} Buena -> Mala`);

  // Convert 9 Buena to Regular
  const updateToRegular = `
    UPDATE "SurveyResponse" 
    SET calificacion = 'Regular'
    WHERE id IN (
      SELECT id FROM "SurveyResponse"
      WHERE "createdAt" >= $1 AND "createdAt" <= $2 AND calificacion IN ('Buena', 'Bueno')
      ORDER BY RANDOM()
      LIMIT 9
    )
  `;
  const res2 = await client.query(updateToRegular, [start, end]);
  console.log(`Updated ${res2.rowCount} Buena -> Regular`);

  await client.end();
}

main().catch(console.error);
