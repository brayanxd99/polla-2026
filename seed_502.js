const { Client } = require('pg');
const { randomUUID } = require('crypto');

const names = [
  "DAVID SANTIAGO SANTAMARIA GONZALEZ",
  "PAULA LORENA NOVOA FARFAN",
  "JHON HEIDER CUADROS OLIVEROS",
  "ANDY NELSON TITUAÑA VEGA",
  "JESUS DAVID PASTRAN GONZALEZ",
  "KAREN NATALIA GARZON CASTILLO",
  "JUAN CAMILO CANTOR ACEVEDO",
  "MARILIN THAMAR HERRERA CAICEDO",
  "LUIS FELIPE PASTO MURCIA",
  "JUAN DAVID TIBAMBRE CASTILLO",
  "ESTEBAN ROMERO MURILLO",
  "ELSA LILIANA BELLO HERREÑO",
  "JONNY YESID SANCHEZ RIVERA",
  "SAIDY CHARIT ESPINOSA PINTO",
  "JAVIER DAVID TERNERA MERCADO",
  "ANDRES DAVID MARTINEZ BAENA",
  "YEISON ANDRES ALVIS POVEDA"
];

function generateEmail(name) {
  const parts = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ');
  const apellido1 = parts[0];
  const nombre1 = parts.length > 2 ? parts[2] : parts[1];
  
  if (nombre1 && apellido1) {
    return `${nombre1[0]}${apellido1}@sena.edu.co`;
  }
  return `${parts[0]}@sena.edu.co`;
}

// Fisher-Yates Shuffle to distribute statuses randomly
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_eOmRH9wjbM2u@ep-purple-sunset-apjmqkap.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
  });
  
  await client.connect();
  
  // We need 17 profiles. 
  // 6 will be "Buena" and MUST NOT have any novedad (no caida, no intermitencia)
  // 11 will be "Regular". 
  // Among those 11 Regular, we need exactly 9 intermitencias and 2 caidas.
  // Wait, can they overlap? The user said "intermitencias unos 9, caidas 2".
  // Let's just distribute them among the 11 Regulars.
  // We have 11 slots for Regular. 
  // Let's make 2 of them "caida = true, intermitencia = true"
  // Let's make 7 of them "caida = false, intermitencia = true"
  // That gives 9 intermitencias and 2 caidas.
  // The remaining 2 Regulars can just be "Regular" without caida/intermitencia.
  
  let configs = [];
  
  // 6 Buenas
  for(let i=0; i<6; i++) {
    configs.push({ calificacion: 'Buena', seHaCaido: false, intermitencia: false, novedad: '' });
  }
  
  // 2 Regulars with Caida AND Intermitencia
  for(let i=0; i<2; i++) {
    configs.push({ calificacion: 'Regular', seHaCaido: true, intermitencia: true, novedad: 'Se cayó y estuvo inestable' });
  }
  
  // 7 Regulars with Intermitencia only
  for(let i=0; i<7; i++) {
    configs.push({ calificacion: 'Regular', seHaCaido: false, intermitencia: true, novedad: 'Estaba bastante intermitente' });
  }
  
  // 2 Regulars without either
  for(let i=0; i<2; i++) {
    configs.push({ calificacion: 'Regular', seHaCaido: false, intermitencia: false, novedad: 'Un poco lento' });
  }
  
  configs = shuffle(configs);
  
  let inserted = 0;
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const email = generateEmail(name);
    const conf = configs[i];
    const id = randomUUID();
    
    const query = `
      INSERT INTO "SurveyResponse" 
      (id, "createdAt", ficha, instructor, aprendiz, correo, salon, network, "seHaCaido", calificacion, intermitencia, novedad)
      VALUES 
      ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;
    
    await client.query(query, [
      id,
      "353328",
      "jefry gonzalez",
      name,
      email,
      "502",
      "SENA",
      conf.seHaCaido,
      conf.calificacion,
      conf.intermitencia,
      conf.novedad
    ]);
    inserted++;
  }
  
  console.log(`Inserted ${inserted} rows.`);
  await client.end();
}

main().catch(console.error);
