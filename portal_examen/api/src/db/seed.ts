import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createPool } from './pool';
import { ensureSchema } from './schema';

// Tablas de dominio (en orden inverso de dependencias para el DROP ... CASCADE).
const DOMAIN_TABLES = [
  'puntuacion',
  'resultado_vocabulario',
  'respuesta',
  'aplicacion_test',
  'configuracion_examen',
  'entrada_baremo',
  'tabla_normas',
  'opcion',
  'item',
  'forma_vocabulario',
  'evaluado',
];

// Reinicia por completo el esquema de dominio y vuelve a cargar el examen de prueba.
// No toca las tablas internas de OpenXava.
async function main(): Promise<void> {
  const pool = createPool();
  try {
    console.log('1/3  Eliminando tablas de dominio (reset limpio)...');
    await pool.query(`DROP TABLE IF EXISTS ${DOMAIN_TABLES.join(', ')} CASCADE;`);

    console.log('2/3  Recreando el esquema...');
    await ensureSchema(pool);

    console.log('3/3  Cargando datos del examen (seed.sql)...');
    const seedPath = path.resolve(__dirname, '..', '..', 'seed.sql');
    await pool.query(readFileSync(seedPath, 'utf8'));

    console.log('Listo. La base quedo limpia y con el examen cargado.');
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Error al aplicar el seed:', err);
  process.exit(1);
});
