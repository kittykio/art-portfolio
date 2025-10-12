type TransformsType = {
  x: number;
  y: number;
  rotationZ: number;
};

/**
 * Generate N transforms for dispersed text.
 * @param count Number of letters/characters
 * @param seed Optional seed for reproducible randomness
 */
export function generateTransforms(count: number, seed = 42): TransformsType[] {
  const transforms: TransformsType[] = [];

  // simple pseudo-random generator based on seed
  let random = (s: number) => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < count; i++) {
    const r = random(seed + i); // pseudo-random number 0..1
    const angle = r * Math.PI * 2; // full circle
    const radius = 0.2 + r * 0.6; // spread radius (0.2em .. 0.8em)
    const rotationZ = Math.round((r - 0.5) * 40); // -20deg .. +20deg

    transforms.push({
      x: +(Math.cos(angle) * radius).toFixed(3),
      y: +(Math.sin(angle) * radius).toFixed(3),
      rotationZ,
    });
  }

  return transforms;
}

export const disperse = {
  open: (i: number, count: number) => {
    // spread x and y in a small range
    const maxOffset = 0.8; // em
    const x = (i / (count - 1) - 0.5) * maxOffset * 2; // -1em → +1em
    const y = (Math.random() - 0.5) * maxOffset * 2;
    const rotateZ = (Math.random() - 0.5) * 30; // ±15°

    return {
      x: x + 'em',
      y: y + 'em',
      rotateZ,
      transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
      zIndex: 1,
    };
  },
  closed: {
    x: '0em',
    y: '0em',
    rotateZ: 0,
    transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
    zIndex: 0,
  },
};
