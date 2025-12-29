export interface Player {
  id: string;
  name: string;
  avatarColor: string;
  isImpostor?: boolean;
  votes?: number;
  hasVoted?: boolean;
}

export type GamePhase = 
  | 'lobby'
  | 'pass'
  | 'reveal'
  | 'lockScreen'
  | 'discussion'
  | 'voting'
  | 'results';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  secretWord: string;
  category: string;
  impostorId: string;
  discussionTimeSeconds: number;
  votingTimeSeconds: number;
  votes: Record<string, string>; // voterId -> votedForId
  roundNumber: number;
  crewWins: number;
  impostorWins: number;
}

export const AVATAR_COLORS = [
  'bg-game-yellow',
  'bg-game-blue',
  'bg-game-purple',
  'bg-game-pink',
  'bg-game-orange',
  'bg-game-teal',
  'bg-game-green',
];

export const WORD_CATEGORIES: Record<string, string[]> = {
  'Animals': ['Elephant', 'Penguin', 'Giraffe', 'Dolphin', 'Kangaroo', 'Octopus', 'Flamingo'],
  'Food': ['Pizza', 'Sushi', 'Tacos', 'Burger', 'Pasta', 'Croissant', 'Ramen'],
  'Places': ['Beach', 'Mountain', 'Forest', 'Desert', 'City', 'Island', 'Castle'],
  'Movies': ['Avatar', 'Titanic', 'Inception', 'Frozen', 'Joker', 'Matrix', 'Shrek'],
  'Sports': ['Soccer', 'Tennis', 'Swimming', 'Basketball', 'Golf', 'Boxing', 'Surfing'],
  'Jobs': ['Doctor', 'Pilot', 'Chef', 'Teacher', 'Artist', 'Astronaut', 'Detective'],
};

export function createInitialState(): GameState {
  return {
    phase: 'lobby',
    players: [],
    currentPlayerIndex: 0,
    secretWord: '',
    category: '',
    impostorId: '',
    discussionTimeSeconds: 120,
    votingTimeSeconds: 60,
    votes: {},
    roundNumber: 0,
    crewWins: 0,
    impostorWins: 0,
  };
}

export function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
