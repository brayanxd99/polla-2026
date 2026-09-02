const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_eOmRH9wjbM2u@ep-purple-sunset-apjmqkap.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
  });
  
  await client.connect();
  
  const query = `
    UPDATE "SurveyResponse" 
    SET calificacion = 'Buena'
    WHERE id IN (
      SELECT id 
      FROM "SurveyResponse" 
      WHERE ficha = '3160042' AND salon = '402' AND calificacion = 'Regular'
      ORDER BY RANDOM()
      LIMIT 6
    )
  `;
  
  const res = await client.query(query);
  console.log(`Updated ${res.rowCount} rows to Buena.`);
  
  await client.end();
}

main().catch(console.error);
