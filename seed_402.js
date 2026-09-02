const { Client } = require('pg');
const { randomUUID } = require('crypto');

const names = [
  "AGUILERA VALBUENA MIGUEL ÁNGEL",
  "ARCE PABÓN JUAN DAVID",
  "ARIAS RIVERA ANGEL FELIPE",
  "BALDOVINO RONCANCIO DEIVY ANDRES",
  "CALDERÓN CAPERA LIZETH ALEJANDRA",
  "CASTELLANOS CABRERA ANA SOFÍA",
  "CASTILLO REY SANTIAGO",
  "CUBILLOS RODRÍGUEZ DEIVI ALEJANDRO",
  "DUQUE GUTIERREZ LUIS ALEJANDRO",
  "GALINDO MAYORGA JUAN ANDRES",
  "GIL PRIETO JERSON MIGUEL",
  "GOMEZ RODRIGUEZ ANGELICA MARIA",
  "GONZALES ARIAS BRANDON STIVEN",
  "GONZALEZ CIFUENTES DENNIS CAMILA",
  "HERRERA GONZÁLEZ YENNYFER DAIMAR",
  "JIMÉNEZ DE LA PEÑA JONATHAN SMITH",
  "MARTÍNEZ GÓMEZ JESÚS SANTIAGO",
  "MENDEZ MARTIN KALETH DANIEL",
  "MENDOZA CONTRERAS JUAN MIGUEL",
  "MIRANDA RAYO LAURA VALENTINA",
  "MORENO OSPINA DANA VALENTINA",
  "PÁEZ SOTO ANDRÉS FELIPE",
  "QUEVEDO VEGA JOSEPH EMMANUEL",
  "ROCHA VERA DYLAN RICARDO",
  "RODRIGUEZ NAVARRETE BRANDON SCHNEIDER",
  "TORO RAMIREZ KEVIN ALEJANDRO",
  "TUNUBALA CAMAYO JORGE OVEIMAR",
  "VANEGAS BARRERA MARIA ALEJANDRA",
  "VIVAS VILLAMIZAR JOHN JAIRO"
];

function generateEmail(name) {
  const parts = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ');
  // first letter of first name + first surname
  const first = parts[parts.length > 2 ? 2 : 0]; // assuming structure: surname1 surname2 name1 name2
  // Actually standard in Colombia list: Apellido1 Apellido2 Nombre1 Nombre2
  const apellido1 = parts[0];
  const nombre1 = parts.length > 2 ? parts[2] : parts[1];
  
  if (nombre1 && apellido1) {
    return `${nombre1[0]}${apellido1}@sena.edu.co`;
  }
  return `${parts[0]}@sena.edu.co`;
}

async function main() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_eOmRH9wjbM2u@ep-purple-sunset-apjmqkap.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
  });
  
  await client.connect();
  
  // Pick 4 random indices for "caída"
  const caidaIndices = [];
  while (caidaIndices.length < 4) {
    const r = Math.floor(Math.random() * names.length);
    if (!caidaIndices.includes(r)) caidaIndices.push(r);
  }
  
  let inserted = 0;
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    
    // Ensure emails are unique by adding index if needed, but normally just base
    const email = generateEmail(name).replace('@', `${i}@`); 
    
    const seHaCaido = caidaIndices.includes(i);
    const calificacion = Math.random() > 0.5 ? 'Buena' : 'Regular';
    
    const id = randomUUID();
    
    const query = `
      INSERT INTO "SurveyResponse" 
      (id, "createdAt", ficha, instructor, aprendiz, correo, salon, network, "seHaCaido", calificacion, intermitencia, novedad)
      VALUES 
      ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, false, '')
    `;
    
    await client.query(query, [
      id,
      "3160042",
      "Jhon Ferney C",
      name,
      email,
      "402",
      "SENA",
      seHaCaido,
      calificacion
    ]);
    inserted++;
  }
  
  console.log(`Inserted ${inserted} rows.`);
  await client.end();
}

main().catch(console.error);
