const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_eOmRH9wjbM2u@ep-purple-sunset-apjmqkap.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
  });
  
  await client.connect();
  
  // Update exactly 4 random responses from this specific group to have intermitencia = true
  const query = `
    UPDATE "SurveyResponse"
    SET intermitencia = true
    WHERE id IN (
      SELECT id 
      FROM "SurveyResponse" 
      WHERE ficha = '3160042' AND salon = '402'
      ORDER BY RANDOM()
      LIMIT 4
    )
  `;
  
  const res = await client.query(query);
  console.log(`Updated ${res.rowCount} rows to have intermitencia.`);
  
  await client.end();
}

main().catch(console.error);
