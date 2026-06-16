import { Pool } from 'pg';

export async function ensureSchema(pool: Pool): Promise<void> {
  const createSql = `
    CREATE TABLE IF NOT EXISTS evaluado (
      id_evaluado SERIAL    PRIMARY KEY,
      primer_apellido       VARCHAR(50) NOT NULL,
      segundo_apellido      VARCHAR(50) NULL,
      nombre                VARCHAR(50) NOT NULL,
      fecha_nacimiento      DATE,
      sexo                  CHAR(1),
      estudios              VARCHAR(100)
    );
    CREATE TABLE IF NOT EXISTS forma_vocabulario (
      id_forma              SERIAL PRIMARY KEY,
      tipo                  CHAR(1)      NOT NULL,  -- 'A' o 'B'
      titulo                VARCHAR(100) NOT NULL,
      tiempo_limite_seg     INT,
      item_inicial          INT,
      item_final            INT,
      instrucciones         TEXT
    );
    CREATE TABLE IF NOT EXISTS item (
      id_item               SERIAL PRIMARY KEY,
      id_forma              INT NOT NULL REFERENCES forma_vocabulario(id_forma),
      numero                INT NOT NULL,
      palabra_estimulo      VARCHAR(100),
      respuesta_correcta    CHAR(1)
    );
    CREATE TABLE IF NOT EXISTS opcion (
      id_opcion             SERIAL PRIMARY KEY,
      id_item               INT NOT NULL REFERENCES item(id_item),
      letra                 CHAR(1) NOT NULL,  -- A, B, C, D, E
      texto                 VARCHAR(150)
    );
    CREATE TABLE IF NOT EXISTS tabla_normas (
      id_normas             SERIAL PRIMARY KEY,
      version               VARCHAR(50) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS entrada_baremo (
      id_entrada            SERIAL PRIMARY KEY,
      id_normas             INT NOT NULL REFERENCES tabla_normas(id_normas),
      factor                VARCHAR(10),
      pd_min                INT,
      pd_max                INT,
      percentil             INT
    );
    CREATE TABLE IF NOT EXISTS configuracion_examen (
      id_config             SERIAL PRIMARY KEY,
      nombre                VARCHAR(100) NOT NULL,
      id_forma_a            INT NOT NULL REFERENCES forma_vocabulario(id_forma),
      id_forma_b            INT NOT NULL REFERENCES forma_vocabulario(id_forma),
      id_normas             INT NOT NULL REFERENCES tabla_normas(id_normas),
      activa                BOOLEAN NOT NULL DEFAULT false
    );
    CREATE TABLE IF NOT EXISTS aplicacion_test (
      id_aplicacion         SERIAL PRIMARY KEY,
      id_evaluado           INT NOT NULL REFERENCES evaluado(id_evaluado),
      id_forma_a            INT NOT NULL REFERENCES forma_vocabulario(id_forma),
      id_forma_b            INT NOT NULL REFERENCES forma_vocabulario(id_forma),
      id_normas             INT NOT NULL REFERENCES tabla_normas(id_normas),
      fecha_examen          DATE,
      finalidad             VARCHAR(200),
      estado                VARCHAR(20) NOT NULL DEFAULT 'ASIGNADO'
    );
    CREATE TABLE IF NOT EXISTS respuesta (
      id_respuesta          SERIAL PRIMARY KEY,
      id_aplicacion         INT NOT NULL REFERENCES aplicacion_test(id_aplicacion),
      id_item               INT NOT NULL REFERENCES item(id_item),
      letra_marcada         CHAR(1),
      es_correcta           BOOLEAN
    );
    CREATE TABLE IF NOT EXISTS resultado_vocabulario (
      id_resultado          SERIAL PRIMARY KEY,
      id_aplicacion         INT NOT NULL UNIQUE REFERENCES aplicacion_test(id_aplicacion),
      texto_interpretativo  TEXT
    );
    CREATE TABLE IF NOT EXISTS puntuacion (
      id_puntuacion         SERIAL PRIMARY KEY,
      id_resultado          INT NOT NULL REFERENCES resultado_vocabulario(id_resultado),
      factor                VARCHAR(10),  -- VOC1 | VOC2 | VOCT
      puntuacion_directa    INT,
      puntuacion_tipica     INT
    );
  `;
  await pool.query(createSql);
}
