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
  
  const query = `
    SELECT calificacion, count(*) 
    FROM "SurveyResponse" 
    WHERE "createdAt" >= $1 AND "createdAt" <= $2
    GROUP BY calificacion
  `;
  
  const res = await client.query(query, [start, end]);
  console.log("Today stats:");
  console.log(res.rows);
  
  await client.end();
}

main().catch(console.error);
