// 10x10 grid of mood options organized by Energy (Y-axis) and Pleasantness (X-axis)
export const MOOD_GRID = [
  // Row 1 - Highest Energy
  ['Enraged', 'Panicked', 'Stressed', 'Jittery', 'Shocked', 'Surprised', 'Upbeat', 'Festive', 'Exhilarated', 'Ecstatic'],
  // Row 2
  ['Livid', 'Furious', 'Frustrated', 'Tense', 'Stunned', 'Hyper', 'Cheerful', 'Motivated', 'Inspired', 'Elated'],
  // Row 3
  ['Fuming', 'Frightened', 'Angry', 'Nervous', 'Restless', 'Energized', 'Lively', 'Excited', 'Optimistic', 'Enthusiastic'],
  // Row 4
  ['Anxious', 'Apprehensive', 'Worried', 'Irritated', 'Annoyed', 'Pleased', 'Focused', 'Happy', 'Proud', 'Thrilled'],
  // Row 5
  ['Repulsed', 'Troubled', 'Concerned', 'Uneasy', 'Peeved', 'Pleasant', 'Joyful', 'Hopeful', 'Playful', 'Blissful'],
  // Row 6
  ['Disgusted', 'Glum', 'Disappointed', 'Down', 'Apathetic', 'At Ease', 'Easygoing', 'Content', 'Loving', 'Fulfilled'],
  // Row 7
  ['Pessimistic', 'Morose', 'Discouraged', 'Sad', 'Bored', 'Calm', 'Secure', 'Satisfied', 'Grateful', 'Touched'],
  // Row 8
  ['Alienated', 'Miserable', 'Lonely', 'Disheartened', 'Tired', 'Relaxed', 'Chill', 'Restful', 'Blessed', 'Balanced'],
  // Row 9
  ['Despondent', 'Depressed', 'Sullen', 'Exhausted', 'Fatigued', 'Mellow', 'Thoughtful', 'Peaceful', 'Comfortable', 'Carefree'],
  // Row 10 - Lowest Energy
  ['Despairing', 'Hopeless', 'Desolate', 'Spent', 'Drained', 'Sleepy', 'Complacent', 'Tranquil', 'Cozy', 'Serene'],
];

// Quadrant background colors based on Energy and Pleasantness
// Top-Left: High Energy, Low Pleasantness (Red/Orange)
// Top-Right: High Energy, High Pleasantness (Yellow)
// Bottom-Left: Low Energy, Low Pleasantness (Blue)
// Bottom-Right: Low Energy, High Pleasantness (Green)
export const getQuadrantColor = (rowIndex: number, colIndex: number): string => {
  const isHighEnergy = rowIndex < 5;
  const isHighPleasantness = colIndex >= 5;

  if (isHighEnergy && !isHighPleasantness) {
    return 'bg-gradient-to-br from-red-100/60 to-orange-100/60'; // Top-Left
  } else if (isHighEnergy && isHighPleasantness) {
    return 'bg-gradient-to-br from-yellow-100/60 to-amber-100/60'; // Top-Right
  } else if (!isHighEnergy && !isHighPleasantness) {
    return 'bg-gradient-to-br from-blue-100/60 to-cyan-100/60'; // Bottom-Left
  } else {
    return 'bg-gradient-to-br from-green-100/60 to-emerald-100/60'; // Bottom-Right
  }
};

// Generate a random pastel color
export const generatePastelColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

