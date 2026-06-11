import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { hash } from 'bcryptjs'

const usersCsv = `Martha Valeria Urrego Arrieta,1014234650,martha.urrego@asturias.edu.co
Alejandra Lopez Zambrano,1025520478,n.lopez@asturias.edu.co
Diana Marcela Gutierrez Rojas,1022428592,d.gutierrez@asturias.edu.co
Andres Forero Garcia,1024552492,analista.bi11@asturias.edu.co
Jeison Gerardo Molina Merchan,1026582909,j.merchan@asturias.edu.co
Diego Alejandro Huertas Urrea,1023956637,Helpdesk@asturias.edu.co
Jorge Luis Fuentes Rodriguez,1014180630,luis.fuentes@asturias.edu.co
Andrea Niño Ruiz,1140850367,andrea.ruiz@asturias.edu.co
Cristiam Rafael Mora,1022412234,c.mora@asturias.edu.co
Jhon Andersson Vanegas Castañeda,1021665442,developer@asturias.edu.co
Jesus Alberto Piedrahita Lorduy,1017210070,j.piedrahita@asturias.edu.co
Julian Florez Guevara,1001316500,c.guevara@asturias.edu.co
Mariana Moreno Suárez,35427904,acreditacion@asturias.edu.co
Maria José Barreto,1116279314,Maria.barreto@asturias.edu.co
Juan Diego Sanchez Medina,1014308566,d.medina@asturias.edu.co
Adriana Del Pilar Alfonso Leal,33366758,adriana.leal@asturias.edu.co
Joan Sebastian Rubiano Castro,1000603578,j.rubiano@asturias.edu.co
Natalia Wilches Contreras,1001300062,Asistente.bienestar@asturias.edu.co
Jhonathan Rodas Tobon,11306755999,j.rodas@asturias.edu.co
Yorks Briant Cuellar Robayo,1032407623,y.cuellar@asturias.edu.co
Diana Consuelo Gonzalez Pulido,52877929,DIANA.GONZALEZ@ASTURIAS.EDU.CO
Nicolas Machado,7731630,desarrollador.web@asturias.edu.co
Juan Sebastian Caballero Gualteros,1030653045,sebastian.caballero@asturias.edu.co
Juan Camilo Acevedo Castrillón,1024593076,auxiliar.administrativo@asturias.edu.co
Marcela Salas,1022396413,asistente.investigacion@asturias.edu.co
Henry Alexander Redondo Velandia,80224361,h.redondo@asturias.edu.co
Marcos Miguel Arias Diaz,7178135,marcos.arias@asturias.edu.co
Fanier Patricia Triana Arbelaez,52289676,p.arbelaez@asturias.edu.co
Lizeth Paola Alarcon Acevedo,1030617198,l.alarcon@asturias.edu.co
Jhon Alexis Sarmiento Valencia,1015466296,j.sarmiento@asturias.edu.co
Cesar Augusto Gonzalez Hernandez,1012334788,cesar.gonzalez@asturias.edu.co
Amanda Marcela Celis Rivera,52367573,a.celis@asturias.edu.co
Diana Paola Pérez,1032365929,auditordecalidad@asturias.edu.co
Hugo Alexis Hernandez Herreño,1096483766,h.hernandez@asturias.edu.co
Juan Andres Montenegro Herrera,1000938773,j.montenegro@asturias.edu.co
Richard Johann Reyes Vergara,1014179509,richard.reyes@iep.edu.es
Marisel Estevez Salaz,1022346431,m.salaz@asturias.edu.co
Tatiana Santacruz Pantoja,1001114781,tatiana.santacruz@summauniversity.edu.co
Nathalia Camila Molina Casallas,53037811,direccion.gestionhumana@asturias.edu.co
Alejandro Mario Torres Garay,19470890,alejandro.torres@asturias.edu.co
Marisol Forero,52040496,marisol.forero@asturias.edu.co
Daniel Arturo Leyva Santana,1030522033,d.leyva@asturias.edu.co
Diana Marcela Tirado Padilla,53120470,direccion.desarrollodocente@asturias.edu.co
Mauricio Calderon Ardila,1098653040,mauricio.calderon@asturias.edu.co
Andrés Felipe Tamayo Santos,1075233380,andres.tamayo@asturias.edu.co
Luz Esperanza Angel Torres,52094932,luz.angel@asturias.edu.co
Laila Brigith Chalarca Aranda,1233902594,l.chalarca@asturias.edu.co
Alexander Hernández Velásquez,79626451,alexander.hernandez@asturias.edu.co
Andrea Peña Rodriguez,52837237,andrea.rodriguez@asturias.edu.co
David Steeven Rodriguez Villalba,1021513239,ds.rodriguez@asturias.edu.co
Andres Esteban Gomez Garcia,1007497301,E.GOMEZ@ASTURIAS.EDU.CO
Andrea Liliana,1015431380,a.cruz@asturias.edu.co
Kevin Fernando Diaz Rodriguez,1026590386,f.diaz@asturias.edu.co
Luis Humberto Rojas Castro,1030588116,lh.rojas@asturias.edu.co
Juan Camilo Rojas Figueroa,1023860781,j.figueroa@asturias.edu.co
Jefferson Lopez,1018465041,a.lopez@asturias.edu.co
Fabio Antonio Sanchez Da Costa,1127950241,f.costa@asturias.edu.co
Cristian David Bautista Becerra,1013667925,c.bautista@asturias.edu.co
Martha Johana Gomez Velandia,1075666056,martha.gomez@asturias.edu.co
Marcela Guzmán Rincón,1072658510,marcela.guzman@asturias.edu.co
David Enrique Gaona Angel,1013651299,david.gaona@asturias.edu.co
Melissa Torres Ordóñez,36292987,melissa.torres@asturias.edu.co
Diana Katherine Acosta Contreras,28588359,diana.acosta@asturias.edu.co
Dayana Alejandra Méndez Chaparro,1015395235,dayana.mendez@asturias.edu.co
Olga Lucia Vasquez Estepa,51963792,Olga.vasquez@asturias.edu.co
Julian Camilo Ortega Gomez,1059600450,julian.ortega@asturias.edu.co
Jairo Augusto Zambrano Jimenez,80202825,jairo.zambrano@asturias.edu.co
Carlos Eduardo Castiblanco Sánchez,1032480008,carlos.castiblanco@asturias.edu.co
Daniel Alfredo Ramirez Zarama,1019003016,daniel.ramirez@asturias.edu.co
Maira Alejandra Usaquen Yepes,1069751781,alejandra.usaquen@asturias.edu.co
Jessica Villarreal,1032441579,Jessica.Villarreal@asturias.edu.co
Ingrid Carolina Vega Garcia,53036428,ingrid.vega@asturias.edu.co
Alirio Sanabria Mejía,80054308,alirio.sanabria@asturias.edu.co
Eliana Alejandra Paez Lugo,1101687397,eliana.paez@asturias.edu.co
Jaime Cubides,1010163807,jaime.cubides@asturias.edu.co
Sindy Johanna Ortiz Pascagaza,1012355882,coordinacion.docencia@asturias.edu.co
Camilo Palacios Palacios,80161188,camilo.palacios@asturias.edu.co
Richard Ardila,80747349,franco.richard@asturias.edu.co
Lorena Ocampo Giraldo,1013608557,contabilidad@asturias.edu.co
Jhon Correa Arias,1015470409,coordinacion.rse@asturias.edu.co
Milton Alejandro Cuesta Godoy,1014716790,m.cuesta@asturias.edu.co
Mateo Fernando Chaparro Vergara,1032796272,f.chaparro@asturias.edu.co
Daniel Felipe Zamudio Moyano,1001326346,dzamudio@asturias.edu.co
Santiago Jose Teusa,1006230188,santisena.27teusa@gmail.com
Nicolas Andres Fierro Zarabanda,1106788386,nicolas.fierro@asturias.edu.co
Elianys Morelo Luna,1030675018,e.luna@asturias.edu.co
Luisa Fernanda Córdoba Lozano,1013688416,luisa.cordoba@asturias.edu.co
Rafael Alfonso Urrego Berrio,79683933,rafael.urrego@asturias.edu.co
Karen Paola Vargas Rojas,1014279338,karen.vargas@asturias.edu.co
Andres Torres Mora,1002374261,A.TORRES@ASTURIAS.EDU.CO
Luisa Fernanda Figueroa Llanes,1057591130,fernanditha26@gmail.com
Maria Fernanda Diaz Mora,1000461021,maria.diaz@asturias.edu.co
Luisa Fernanda Romero Otalora,1019617676,calidad@asturias.edu.co
Danny Marcela Antivar Gonzalez,1031358501,d.antivar@asturias.edu.co
Luz Ángela Rodríguez,1012360106,luz.rodriguez@asturias.edu.co
Juan Diego Rodriguez Galindo,1014477510,juan.rodriguez@asturias.edu.co
Yedy Alejandra Solis Montaño,38143785,yedy.solis@asturias.edu.co
Nicol Tatiana Rojas Mendoza,1000687287,rojasnicoltatiana@gmail.com
Luis Francisco Velandia Venegas,79654982,luis.velandia@asturias.edu.co
Leidy Tatiana Caderia Martinez,1014254094,coordinacionryd@asturias.edu.co
Sebastian Barreto Gomez,1012317594,s.gomez@asturias.edu.co
Jose Julián Moyano Mancilla,1090511319,j.moyano@asturias.edu.co
Erica Iloana Cuevas Preciado,1019129225,e.cuevas@asturias.edu.co
Linda Sofia Valencia Lozano,1013259156,l.valencia@asturias.edu.co
Jose Manuel Rojas Algecira,1031806826,soporte@asturias.edu.co
Christian David Nieto Frasser,1020760543,c.nieto@asturias.edu.co
Leidy Andrea Castro Parraga,1012422306,l.parraga@asturias.edu.co
Juan David Morales,1019762693,jd.morales@asturias.edu.co
Mónica Montaño Martínez,52912152,monica.martinez@asturias.edu.co
Maria José Bocanegra Sanabria,1000270332,bienestaryegresados@asturias.edu.co
Jesús Antonio Pantoja Cueltán,1085664043,jesus.pantoja@asturias.edu.co
Diana Marcela González Calle,1037640578,diana.calle@asturias.edu.co
Juan Carlos Sánchez Celis,80172352,direccion.academica@asturias.edu.co
Carolina Castañeda Arias,30850191,carolina.arias@asturias.edu.co
Catherine Valencia Florez,1026561543,catherine.florez@asturias.edu.co
Andrea Stephanie Figueroa Ayala,1010243728,a.figueroa@asturias.edu.co
Natalia Mora,1069724575,coordinacion.bienestar@asturias.edu.co`

async function recreateBulkUsers() {
  const lines = usersCsv.trim().split('\n')
  console.log("Found " + lines.length + " users to create.")

  // First, delete all normal users
  const deleteResult = await prisma.user.deleteMany({
    where: {
      role: 'USER'
    }
  })
  console.log("Deleted " + deleteResult.count + " existing normal users.")

  for (const line of lines) {
    const [name, document, email] = line.split(',')
    if (!email || !name || !document) continue

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedName = name.trim()
    const password = document.trim()

    try {
      const hashedPassword = await hash(password, 10)
      
      await prisma.user.create({
        data: {
          email: trimmedEmail,
          name: trimmedName,
          password: hashedPassword,
          totalPoints: 0,
          exactMatches: 0,
          role: 'USER',
        }
      })
      console.log("Created: " + trimmedEmail)
    } catch (e) {
      console.error("Failed to create: " + trimmedEmail, e)
    }
  }

  console.log("Bulk creation completed.")
}

recreateBulkUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
