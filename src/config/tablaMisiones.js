// Misiones disponibles en la tabla por rango
// rangoMinimo: rango mínimo requerido para tomarla
// Genin=0, Chunin=1, Jonin=2, ANBU=3, Kage=4

module.exports = [
  // Rango D
  { id: 'D01', tier: 'D', nombre: 'Entregar un paquete',         descripcion: 'Lleva un paquete al otro lado del pueblo.',         rangoMinimo: 0 },
  { id: 'D02', tier: 'D', nombre: 'Cuidar animales',             descripcion: 'Cuida los animales de un granjero por un día.',      rangoMinimo: 0 },
  { id: 'D03', tier: 'D', nombre: 'Limpiar el dojo',             descripcion: 'Limpia el dojo del maestro local.',                  rangoMinimo: 0 },

  // Rango C
  { id: 'C01', tier: 'C', nombre: 'Escolta de comerciante',      descripcion: 'Escolta a un comerciante hasta la aldea vecina.',    rangoMinimo: 0 },
  { id: 'C02', tier: 'C', nombre: 'Eliminar bandidos',           descripcion: 'Elimina un grupo de bandidos en la ruta este.',      rangoMinimo: 0 },
  { id: 'C03', tier: 'C', nombre: 'Recuperar información',       descripcion: 'Espía un campamento enemigo y regresa con datos.',   rangoMinimo: 0 },

  // Rango B
  { id: 'B01', tier: 'B', nombre: 'Capturar ninja fugitivo',     descripcion: 'Captura a un ninja que desertó de la aldea.',        rangoMinimo: 1 },
  { id: 'B02', tier: 'B', nombre: 'Proteger el puente',          descripcion: 'Defiende el puente norte de un ataque inminente.',   rangoMinimo: 1 },
  { id: 'B03', tier: 'B', nombre: 'Infiltración',                descripcion: 'Infiltrate en una organización criminal.',           rangoMinimo: 1 },

  // Rango A
  { id: 'A01', tier: 'A', nombre: 'Eliminar objetivo de alto valor', descripcion: 'Elimina a un ninja de rango jonin enemigo.',     rangoMinimo: 2 },
  { id: 'A02', tier: 'A', nombre: 'Rescate de rehén',            descripcion: 'Rescata a un noble capturado por mercenarios.',      rangoMinimo: 2 },
  { id: 'A03', tier: 'A', nombre: 'Sabotaje de base enemiga',    descripcion: 'Destruye la base de operaciones del enemigo.',       rangoMinimo: 2 },

  // Rango S
  { id: 'S01', tier: 'S', nombre: 'Cazar criminal S-rank',       descripcion: 'Elimina a un criminal de rango S en lista negra.',  rangoMinimo: 3 },
  { id: 'S02', tier: 'S', nombre: 'Proteger al Kage',            descripcion: 'Escolta y protege al Kage en territorio enemigo.',  rangoMinimo: 3 },
  { id: 'S03', tier: 'S', nombre: 'Guerra de aldeas',            descripcion: 'Lidera un escuadrón en una batalla decisiva.',      rangoMinimo: 4 },
];
