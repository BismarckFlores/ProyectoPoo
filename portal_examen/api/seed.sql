-- Seed del examen de vocabulario (Forma A: sinonimos, Forma B: palabra distinta).
-- Ejecutar:  PGPASSWORD=tu_clave psql -h localhost -p 5432 -U tu_usuario -d proyecto_poo -f seed.sql
-- OJO: reinicia (TRUNCATE) los datos de dominio. No toca las tablas internas de OpenXava.
--
-- Estructura:
--   Forma A (sinonimos)        -> tiempo 5 min (300 s). Items 1-37. Ejemplos: 1 y 2 (fuera de puntaje).
--                                 Items puntuables: 3-37 (35 items)  -> item_inicial=3, item_final=37.
--   Forma B (palabra distinta) -> tiempo 6 min (360 s). Items 41-77. Ejemplos: 41 y 42 (fuera de puntaje).
--                                 Items puntuables: 43-77 (35 items) -> item_inicial=43, item_final=77.
--   En Forma B no hay palabra base: palabra_estimulo lleva la consigna ("Elige la palabra diferente")
--   para que el frontend tenga algo que mostrar, y las 5 opciones son el grupo de palabras.
--
-- NOTA sobre las respuestas correctas: el examen original no traia clave de respuestas.
-- Las opciones correctas se dedujeron (sinonimo / palabra distinta). Revisa los items marcados
-- con "(?)" mas abajo contra la clave oficial si la tienes.

TRUNCATE
  configuracion_examen, entrada_baremo, tabla_normas,
  opcion, item, forma_vocabulario,
  puntuacion, resultado_vocabulario, respuesta, aplicacion_test, evaluado
  RESTART IDENTITY CASCADE;

DO $$
DECLARE
  fa int; fb int; tn int; it int;
BEGIN
  ----------------------------------------------------------------------------
  -- FORMA A  (sinonimos, 5 minutos)
  ----------------------------------------------------------------------------
  INSERT INTO forma_vocabulario (tipo, titulo, tiempo_limite_seg, item_inicial, item_final, instrucciones)
  VALUES ('A', 'VOCABULARIO - Forma A', 300, 3, 37,
    'En cada ejercicio hay una palabra escrita en MAYÚSCULAS seguida de cinco opciones (A-E). '
    'Marque la opción que significa lo mismo que la palabra principal (sinónimo). '
    'Solo hay una respuesta correcta por ejercicio. Dispone de 5 minutos.')
  RETURNING id_forma INTO fa;

  -- Ejemplo 1
  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 1, 'GRAMA', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','pastizal'), (it,'B','césped'), (it,'C','hierba'), (it,'D','hortaliza'), (it,'E','naturaleza');

  -- Ejemplo 2
  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 2, 'LIVIANO', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','fino'), (it,'B','delgado'), (it,'C','ligero'), (it,'D','graso'), (it,'E','afinado');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 3, 'PERCUTIR', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','sumergir'), (it,'B','palpar'), (it,'C','agarrar'), (it,'D','golpear'), (it,'E','violentar');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 4, 'EXPONER', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','ordenar'), (it,'B','indicar'), (it,'C','parecer'), (it,'D','mostrar'), (it,'E','colocar');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 5, 'MAQUETA', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','mapamundi'), (it,'B','traje'), (it,'C','raqueta'), (it,'D','modelo'), (it,'E','construcción');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 6, 'LUCHAR', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','agredir'), (it,'B','competir'), (it,'C','instigar'), (it,'D','reprobar'), (it,'E','conquistar');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 7, 'CIMA', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','altura'), (it,'B','montículo'), (it,'C','apogeo'), (it,'D','altitud'), (it,'E','perigeo');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 8, 'PEDAGOGÍA', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','lectura'), (it,'B','demostración'), (it,'C','lección'), (it,'D','instrucción'), (it,'E','aprendizaje');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 9, 'ESQUELA', 'E') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','sobre'), (it,'B','dinero'), (it,'C','pluma'), (it,'D','banca'), (it,'E','misiva');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 10, 'BRUJO', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','simulacro'), (it,'B','mago'), (it,'C','fantasma'), (it,'D','espíritu'), (it,'E','ilusionista');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 11, 'ENFERMIZO', 'A') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','doliente'), (it,'B','perseguido'), (it,'C','vivaz'), (it,'D','comatoso'), (it,'E','herido');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 12, 'VACILAR', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','girar'), (it,'B','decidir'), (it,'C','balancear'), (it,'D','hostigar'), (it,'E','cabecear');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 13, 'CORROMPER', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','simular'), (it,'B','sobornar'), (it,'C','liberar'), (it,'D','administrar'), (it,'E','intervenir');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 14, 'VUELO', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','evolución'), (it,'B','viaje'), (it,'C','hurto'), (it,'D','episodio'), (it,'E','impulso');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 15, 'USO', 'E') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','utensilio'), (it,'B','obsequio'), (it,'C','género'), (it,'D','modo'), (it,'E','práctica');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 16, 'BRILLO', 'A') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','fulgor'), (it,'B','sol'), (it,'C','esplendor'), (it,'D','cólera'), (it,'E','incandescencia');

  -- (?) TRANQUILO: sinonimo discutible; se elige 'límpido' (sereno)
  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 17, 'TRANQUILO', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','glacial'), (it,'B','frío'), (it,'C','límpido'), (it,'D','frígido'), (it,'E','amortiguado');

  -- (?) AGRADABLE: sinonimo discutible; se elige 'atractivo'
  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 18, 'AGRADABLE', 'A') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','atractivo'), (it,'B','alegre'), (it,'C','comediante'), (it,'D','risueño'), (it,'E','extraño');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 19, 'SÓRDIDO', 'E') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','sorprendente'), (it,'B','polvoriento'), (it,'C','singular'), (it,'D','fétido'), (it,'E','sucio');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 20, 'GÉNERO', 'A') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','naturaleza'), (it,'B','música'), (it,'C','párrafo'), (it,'D','estatura'), (it,'E','abstracción');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 21, 'MINAR', 'E') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','romper'), (it,'B','quebrar'), (it,'C','arruinar'), (it,'D','explotar'), (it,'E','zapar');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 22, 'PRUEBA', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','guerra'), (it,'B','forma'), (it,'C','experiencia'), (it,'D','aventura'), (it,'E','revolución');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 23, 'HOSCO', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','tempestuoso'), (it,'B','malhumorado'), (it,'C','impetuoso'), (it,'D','taciturno'), (it,'E','villano');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 24, 'DESHONOR', 'A') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','oprobio'), (it,'B','sagacidad'), (it,'C','calamidad'), (it,'D','maldición'), (it,'E','desventura');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 25, 'ALTIVO', 'E') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','atento'), (it,'B','afectado'), (it,'C','avivado'), (it,'D','arreglado'), (it,'E','desdeñoso');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 26, 'ATREVIDO', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','entusiasmado'), (it,'B','osado'), (it,'C','átono'), (it,'D','vengador'), (it,'E','rápido');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 27, 'REPRESENTANTE', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','noble'), (it,'B','secretario'), (it,'C','mandatario'), (it,'D','elector'), (it,'E','caballero');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 28, 'GRABAR', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','impresionar'), (it,'B','estampar'), (it,'C','esbozar'), (it,'D','pintar'), (it,'E','implantar');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 29, 'DUBITACIÓN', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','presunción'), (it,'B','caducidad'), (it,'C','decisión'), (it,'D','perplejidad'), (it,'E','oscilación');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 30, 'INTERRUMPIR', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','intervenir'), (it,'B','suspender'), (it,'C','corromper'), (it,'D','intercalar'), (it,'E','morar');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 31, 'DENSO', 'E') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','rechoncho'), (it,'B','desparramado'), (it,'C','grueso'), (it,'D','pesado'), (it,'E','compacto');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 32, 'INNATO', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','vivo'), (it,'B','pueril'), (it,'C','indígena'), (it,'D','natural'), (it,'E','caracterizado');

  -- (?) IMPERIOSO: sinonimo discutible; se elige 'absoluto'
  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 33, 'IMPERIOSO', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','inmoderado'), (it,'B','vengativo'), (it,'C','imperialista'), (it,'D','absoluto'), (it,'E','conquistado');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 34, 'PARODIAR', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','cantar'), (it,'B','relegar'), (it,'C','plagiar'), (it,'D','identificar'), (it,'E','componer');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 35, 'CODICIA', 'A') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','avidez'), (it,'B','golosina'), (it,'C','liberalidad'), (it,'D','éxito'), (it,'E','advenimiento');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 36, 'REMINISCENCIA', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','amnesia'), (it,'B','recuerdo'), (it,'C','pensamiento'), (it,'D','imagen'), (it,'E','antigüedad');

  -- (?) CONCEDER: sinonimo discutible; se elige 'acordar' (otorgar)
  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fa, 37, 'CONCEDER', 'E') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','ofrecer'), (it,'B','atribuir'), (it,'C','presentar'), (it,'D','aceptar'), (it,'E','acordar');

  ----------------------------------------------------------------------------
  -- FORMA B  (palabra distinta del grupo, 6 minutos). Sin palabra base.
  ----------------------------------------------------------------------------
  INSERT INTO forma_vocabulario (tipo, titulo, tiempo_limite_seg, item_inicial, item_final, instrucciones)
  VALUES ('B', 'VOCABULARIO - Forma B', 360, 43, 77,
    'En cada ejercicio hay un grupo de cinco palabras (A-E). '
    'Marque la palabra cuyo significado es distinto al de las demás del grupo. '
    'Solo hay una respuesta correcta por ejercicio. Dispone de 6 minutos.')
  RETURNING id_forma INTO fb;

  -- Ejemplo 1
  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 41, 'Elige la palabra diferente', 'E') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','pequeño'), (it,'B','exiguo'), (it,'C','minúsculo'), (it,'D','ínfimo'), (it,'E','grande');

  -- Ejemplo 2
  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 42, 'Elige la palabra diferente', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','compacto'), (it,'B','pesado'), (it,'C','ligero'), (it,'D','macizo'), (it,'E','ponderable');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 43, 'Elige la palabra diferente', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','escaparse'), (it,'B','pasearse'), (it,'C','escabullirse'), (it,'D','evadirse'), (it,'E','librarse');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 44, 'Elige la palabra diferente', 'E') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','sin duda'), (it,'B','seguramente'), (it,'C','infaliblemente'), (it,'D','ciertamente'), (it,'E','regularmente');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 45, 'Elige la palabra diferente', 'A') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','aprender'), (it,'B','enseñar'), (it,'C','profesar'), (it,'D','instruir'), (it,'E','demostrar');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 46, 'Elige la palabra diferente', 'A') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','inerte'), (it,'B','alegre'), (it,'C','vivaracho'), (it,'D','bullicioso'), (it,'E','vivo');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 47, 'Elige la palabra diferente', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','intrincado'), (it,'B','nebuloso'), (it,'C','enredado'), (it,'D','variado'), (it,'E','confuso');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 48, 'Elige la palabra diferente', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','interino'), (it,'B','fugaz'), (it,'C','duradero'), (it,'D','momentáneo'), (it,'E','transitorio');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 49, 'Elige la palabra diferente', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','asistir'), (it,'B','indultar'), (it,'C','socorrer'), (it,'D','favorecer'), (it,'E','apoyar');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 50, 'Elige la palabra diferente', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','maravilloso'), (it,'B','asombroso'), (it,'C','exagerado'), (it,'D','admirable'), (it,'E','sorprendente');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 51, 'Elige la palabra diferente', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','ensañamiento'), (it,'B','arrebatamiento'), (it,'C','furia'), (it,'D','admiración'), (it,'E','pasión');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 52, 'Elige la palabra diferente', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','agradable'), (it,'B','ameno'), (it,'C','flemático'), (it,'D','gracioso'), (it,'E','placentero');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 53, 'Elige la palabra diferente', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','columpiar'), (it,'B','retorcer'), (it,'C','oscilar'), (it,'D','mecer'), (it,'E','balancear');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 54, 'Elige la palabra diferente', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','considerar'), (it,'B','calcular'), (it,'C','apreciar'), (it,'D','adaptar'), (it,'E','evaluar');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 55, 'Elige la palabra diferente', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','suave'), (it,'B','delicioso'), (it,'C','azucarado'), (it,'D','apreciable'), (it,'E','sabroso');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 56, 'Elige la palabra diferente', 'A') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','colina'), (it,'B','montón'), (it,'C','rimero'), (it,'D','pila'), (it,'E','cúmulo');

  -- (?) item discutible: se elige 'periódico' (medio) frente a los géneros escritos
  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 57, 'Elige la palabra diferente', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','editorial'), (it,'B','periódico'), (it,'C','artículo'), (it,'D','folletín'), (it,'E','crónica');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 58, 'Elige la palabra diferente', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','azote'), (it,'B','fuete'), (it,'C','rama'), (it,'D','flagelo'), (it,'E','látigo');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 59, 'Elige la palabra diferente', 'A') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','embellecer'), (it,'B','alegrar'), (it,'C','divertir'), (it,'D','regocijar'), (it,'E','distraer');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 60, 'Elige la palabra diferente', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','arribada'), (it,'B','sobrevenida'), (it,'C','procedencia'), (it,'D','venida'), (it,'E','advenimiento');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 61, 'Elige la palabra diferente', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','atentar'), (it,'B','agredir'), (it,'C','esperar'), (it,'D','asaltar'), (it,'E','abordar');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 62, 'Elige la palabra diferente', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','huella'), (it,'B','paso'), (it,'C','marcha'), (it,'D','fogosidad'), (it,'E','porte');

  -- (?) item discutible: se elige 'establecimiento' frente a las estructuras edificadas
  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 63, 'Elige la palabra diferente', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','construcción'), (it,'B','fábrica'), (it,'C','edificio'), (it,'D','establecimiento'), (it,'E','monumento');

  -- (?) item discutible: se elige 'extraordinario' frente a raro/extraño/insólito/singular
  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 64, 'Elige la palabra diferente', 'E') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','raro'), (it,'B','extraño'), (it,'C','insólito'), (it,'D','singular'), (it,'E','extraordinario');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 65, 'Elige la palabra diferente', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','arcaico'), (it,'B','rústico'), (it,'C','vetusto'), (it,'D','antiguo'), (it,'E','secular');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 66, 'Elige la palabra diferente', 'E') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','peripecia'), (it,'B','episodio'), (it,'C','acontecimiento'), (it,'D','incidente'), (it,'E','tragedia');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 67, 'Elige la palabra diferente', 'A') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','lengua'), (it,'B','giro'), (it,'C','idiotismo'), (it,'D','fórmula'), (it,'E','locución');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 68, 'Elige la palabra diferente', 'E') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','reunir'), (it,'B','amontonar'), (it,'C','juntar'), (it,'D','congregar'), (it,'E','amotinar');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 69, 'Elige la palabra diferente', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','huracán'), (it,'B','trueno'), (it,'C','tormenta'), (it,'D','tromba'), (it,'E','ráfaga');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 70, 'Elige la palabra diferente', 'E') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','bracear'), (it,'B','remover'), (it,'C','estremecer'), (it,'D','sacudir'), (it,'E','palpar');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 71, 'Elige la palabra diferente', 'A') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','omisión'), (it,'B','error'), (it,'C','equivocación'), (it,'D','aberración'), (it,'E','yerro');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 72, 'Elige la palabra diferente', 'A') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','esbozo'), (it,'B','espectro'), (it,'C','aparición'), (it,'D','simulación'), (it,'E','sombra');

  -- (?) item discutible: se elige 'régimen' frente a poder/autoridad/dominación
  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 73, 'Elige la palabra diferente', 'C') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','autoridad'), (it,'B','imperio'), (it,'C','régimen'), (it,'D','dominación'), (it,'E','poderío');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 74, 'Elige la palabra diferente', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','celebrar'), (it,'B','conmemorar'), (it,'C','solemnizar'), (it,'D','erigir'), (it,'E','santificar');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 75, 'Elige la palabra diferente', 'D') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','manejos'), (it,'B','maquinaciones'), (it,'C','maniobra'), (it,'D','negociaciones'), (it,'E','intrigas');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 76, 'Elige la palabra diferente', 'B') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','abrogar'), (it,'B','certificar'), (it,'C','revocar'), (it,'D','casar'), (it,'E','invalidar');

  INSERT INTO item (id_forma, numero, palabra_estimulo, respuesta_correcta)
  VALUES (fb, 77, 'Elige la palabra diferente', 'A') RETURNING id_item INTO it;
  INSERT INTO opcion (id_item, letra, texto) VALUES
    (it,'A','malignidad'), (it,'B','inocencia'), (it,'C','simplicidad'), (it,'D','candidez'), (it,'E','ingenuidad');

  ----------------------------------------------------------------------------
  -- BAREMO (tabla de normas + entradas por factor)
  -- Normas DEMO (no oficiales). VOC1/VOC2: 0-35 puntos. VOCT: 0-70 puntos.
  ----------------------------------------------------------------------------
  INSERT INTO tabla_normas (version) VALUES ('BFA Demo 2026') RETURNING id_normas INTO tn;

  -- VOC1 (Forma A, 35 items puntuables)
  INSERT INTO entrada_baremo (id_normas, factor, pd_min, pd_max, percentil) VALUES
    (tn,'VOC1', 0, 4, 5), (tn,'VOC1', 5, 9, 15), (tn,'VOC1',10,14,25), (tn,'VOC1',15,19,40),
    (tn,'VOC1',20,24,55), (tn,'VOC1',25,29,70), (tn,'VOC1',30,33,85), (tn,'VOC1',34,35,95);

  -- VOC2 (Forma B, 35 items puntuables)
  INSERT INTO entrada_baremo (id_normas, factor, pd_min, pd_max, percentil) VALUES
    (tn,'VOC2', 0, 4, 5), (tn,'VOC2', 5, 9, 15), (tn,'VOC2',10,14,25), (tn,'VOC2',15,19,40),
    (tn,'VOC2',20,24,55), (tn,'VOC2',25,29,70), (tn,'VOC2',30,33,85), (tn,'VOC2',34,35,95);

  -- VOCT (VOC1 + VOC2, 0-70 puntos)
  INSERT INTO entrada_baremo (id_normas, factor, pd_min, pd_max, percentil) VALUES
    (tn,'VOCT', 0, 9, 5), (tn,'VOCT',10,19,15), (tn,'VOCT',20,29,30), (tn,'VOCT',30,39,45),
    (tn,'VOCT',40,49,60), (tn,'VOCT',50,59,75), (tn,'VOCT',60,65,88), (tn,'VOCT',66,70,97);

  ----------------------------------------------------------------------------
  -- CONFIGURACION ACTIVA (la que usara la API)
  ----------------------------------------------------------------------------
  INSERT INTO configuracion_examen (nombre, id_forma_a, id_forma_b, id_normas, activa)
  VALUES ('Examen de vocabulario', fa, fb, tn, true);
END $$;
