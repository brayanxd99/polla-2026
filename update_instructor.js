const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_eOmRH9wjbM2u@ep-purple-sunset-apjmqkap.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
  });
  
  await client.connect();
  
  const query = `
    UPDATE "SurveyResponse" 
    SET instructor = 'Jeffry Gonzalez'
    WHERE ficha = '353328' AND salon = '504'
  `;
  
  const res = await client.query(query);
  console.log(`Updated ${res.rowCount} rows.`);
  
  await client.end();
}

main().catch(console.error);
