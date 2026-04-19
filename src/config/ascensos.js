// Requisitos para ascender de rango
// Para subir al siguiente rango necesitas completar X misiones de cada tier

module.exports = {
  // Genin → Chunin
  Genin: {
    siguiente: 'Chunin',
    requisitos: {
      D: 5,  // 5 misiones rango D
      C: 3,  // 3 misiones rango C
    }
  },

  // Chunin → Jonin
  Chunin: {
    siguiente: 'Jonin',
    requisitos: {
      C: 5,
      B: 3,
    }
  },

  // Jonin → ANBU
  Jonin: {
    siguiente: 'ANBU',
    requisitos: {
      B: 5,
      A: 3,
    }
  },

  // ANBU → Kage
  ANBU: {
    siguiente: 'Kage',
    requisitos: {
      A: 5,
      S: 2,
    }
  },

  // Kage es el rango máximo
  Kage: null
};
