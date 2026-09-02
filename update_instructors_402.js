const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_eOmRH9wjbM2u@ep-purple-sunset-apjmqkap.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
  });
  
  await client.connect();
  
  const query = `
    SELECT id FROM "SurveyResponse"
    WHERE ficha = '3160042' AND salon = '402'
  `;
  
  const res = await client.query(query);
  
  const nombres = ["jhon", "fredy", "jhon fredy"];
  
  let updated = 0;
  for (const row of res.rows) {
    const randomName = nombres[Math.floor(Math.random() * nombres.length)];
    await client.query(`UPDATE "SurveyResponse" SET instructor = $1 WHERE id = $2`, [randomName, row.id]);
    updated++;
  }
  
  console.log(`Updated ${updated} instructors.`);
  
  await client.end();
}

main().catch(console.error);
