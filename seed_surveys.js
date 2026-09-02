const { Client } = require('pg');

const data = [
  ["DAVID SANTIAGO SANTAMARIA GONZALEZ", "santiagozk8gonzalez@sena.edu.co"],
  ["PAULA LORENA NOVOA FARFAN", "paulanovoafarfan25@sena.edu.co"],
  ["JHON HEIDER CUADROS OLIVEROS", "jhon.cuadroscd@sena.edu.co"],
  ["ANDY NELSON TITUAÑA VEGA", "andytituana69@sena.edu.co"],
  ["JESUS DAVID PASTRAN GONZALEZ", "jesusdavidpastrangonzalez228@sena.edu.co"],
  ["KAREN NATALIA GARZON CASTILLO", "garzoncastillokaren17@sena.edu.co"],
  ["JUAN CAMILO CANTOR ACEVEDO", "juancamilocantoracevedo27@sena.edu.co"],
  ["MARILIN THAMAR HERRERA CAICEDO", "marilinherrera287@sena.edu.co"],
  ["LUIS FELIPE PASTO MURCIA", "luis.pasto.mu@sena.edu.co"],
  ["JUAN DAVID TIBAMBRE CASTILLO", "tibambrejuandavid7@sena.edu.co"],
  ["ESTEBAN ROMERO MURILLO", "estebanromerotrab@sena.edu.co"],
  ["ELSA LILIANA BELLO HERREÑO", "elsa_bello@sena.edu.co"],
  ["JONNY YESID SANCHEZ RIVERA", "jonnyyesids3@sena.edu.co"],
  ["SAIDY CHARIT ESPINOSA PINTO", "saidyespinosa10@sena.edu.co"],
  ["JAVIER DAVID TERNERA MERCADO", "javierdavid798@sena.edu.co"]
];

async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_eOmRH9wjbM2u@ep-purple-sunset-apjmqkap.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
  });
  
  await client.connect();
  
  for (let i = 0; i < data.length; i++) {
    const name = data[i][0];
    const email = data[i][1];
    
    // Randomize Buena or Regular
    const isBuena = Math.random() > 0.4;
    const calificacion = isBuena ? 'Buena' : 'Regular';
    
    // We create UUID for the id
    const { randomUUID } = require('crypto');
    const id = randomUUID();
    
    const query = `
      INSERT INTO "SurveyResponse" 
      (id, "createdAt", ficha, instructor, aprendiz, correo, salon, network, "seHaCaido", calificacion, intermitencia, novedad)
      VALUES 
      ($1, NOW(), $2, $3, $4, $5, $6, $7, false, $8, false, '')
    `;
    
    await client.query(query, [
      id,
      "353328",
      "Instructor Asignado",
      name,
      email,
      "504",
      "SENA",
      calificacion
    ]);
    console.log(`Inserted ${name}`);
  }
  
  await client.end();
}

main().catch(console.error);
