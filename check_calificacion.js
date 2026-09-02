const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_eOmRH9wjbM2u@ep-purple-sunset-apjmqkap.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
  });
  
  await client.connect();
  
  const query = `
    SELECT calificacion, COUNT(*) as c
    FROM "SurveyResponse"
    WHERE ficha = '3160042' AND salon = '402'
    GROUP BY calificacion
  `;
  
  const res = await client.query(query);
  console.log(res.rows);
  
  await client.end();
}

main().catch(console.error);
