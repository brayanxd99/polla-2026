const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_eOmRH9wjbM2u@ep-purple-sunset-apjmqkap.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
  });
  
  await client.connect();
  const res = await client.query('SELECT count(*) FROM "SurveyResponse";');
  console.log(res.rows);
  await client.end();
}

main().catch(console.error);
