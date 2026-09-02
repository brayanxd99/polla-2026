const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_eOmRH9wjbM2u@ep-purple-sunset-apjmqkap.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
  });
  
  await client.connect();
  
  const query = `
    SELECT id, correo FROM "SurveyResponse"
    WHERE ficha = '3160042' AND salon = '402'
  `;
  
  const res = await client.query(query);
  
  let updated = 0;
  for (const row of res.rows) {
    // Regex to remove all digits before the @
    // e.g. "maguilera0@sena.edu.co" -> "maguilera@sena.edu.co"
    const newCorreo = row.correo.replace(/[0-9]+@/, '@');
    
    if (newCorreo !== row.correo) {
      await client.query(`UPDATE "SurveyResponse" SET correo = $1 WHERE id = $2`, [newCorreo, row.id]);
      updated++;
    }
  }
  
  console.log(`Updated ${updated} emails.`);
  
  await client.end();
}

main().catch(console.error);
