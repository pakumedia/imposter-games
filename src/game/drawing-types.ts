export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingLine {
  points: DrawingPoint[];
  playerId: string;
  color: string;
  strokeWidth: number;
}

export type DrawingGamePhase = 
  | 'lobby'
  | 'pass'
  | 'reveal'
  | 'drawingPass'  // Pass phone between drawing turns
  | 'drawing'
  | 'gallery'
  | 'discussion'
  | 'voting'
  | 'results'
  | 'simpleRoundEnd';

export type DrawingGameMode = 'simple' | 'guided';

// Standard drawing colors for the palette
export const PALETTE_COLORS = [
  '#000000', // Black (default)
  '#FF0000', // Red
  '#FF9500', // Orange
  '#FFCC00', // Yellow
  '#34C759', // Green
  '#007AFF', // Blue
  '#5856D6', // Purple
  '#FF2D55', // Pink
  '#8E8E93', // Gray
  '#FFFFFF', // White
];

export interface DrawingPlayer {
  id: string;
  name: string;
  avatarColor: string;
  drawingColor: string;
  isImpostor?: boolean;
  votes?: number;
  hasVoted?: boolean;
  hasDrawn?: boolean;
}

export interface DrawingGameState {
  phase: DrawingGamePhase;
  gameMode: DrawingGameMode;
  players: DrawingPlayer[];
  currentPlayerIndex: number;
  secretWord: string;
  category: string;
  impostorId: string;
  lines: DrawingLine[];
  currentRound: number;
  maxDrawingRounds: number;
  drawingTimePerPlayer: number;
  discussionTimeSeconds: number;
  votingTimeSeconds: number;
  showCategoryToImpostor: boolean;
  votes: Record<string, string>;
  roundNumber: number;
  crewWins: number;
  impostorWins: number;
}

export const DRAWING_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Sage
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Gold
  '#BB8FCE', // Purple
  '#85C1E9', // Sky
];

export const DRAWING_WORD_CATEGORIES: Record<string, string[]> = {
  'Easy': ['Sun', 'House', 'Tree', 'Cat', 'Dog', 'Fish', 'Apple', 'Star', 'Moon', 'Heart'],
  'Animals': ['Elephant', 'Penguin', 'Giraffe', 'Dolphin', 'Butterfly', 'Octopus', 'Flamingo', 'Koala'],
  'Food': ['Pizza', 'Ice Cream', 'Cake', 'Burger', 'Banana', 'Donut', 'Sushi', 'Taco'],
  'Objects': ['Umbrella', 'Guitar', 'Camera', 'Balloon', 'Rocket', 'Crown', 'Rainbow', 'Clock'],
  'Nature': ['Mountain', 'Beach', 'Forest', 'Waterfall', 'Volcano', 'Island', 'Desert', 'Cave'],
};

export function createDrawingInitialState(): DrawingGameState {
  return {
    phase: 'lobby',
    gameMode: 'guided',
    players: [],
    currentPlayerIndex: 0,
    secretWord: '',
    category: '',
    impostorId: '',
    lines: [],
    currentRound: 1,
    maxDrawingRounds: 2,
    drawingTimePerPlayer: 10,
    discussionTimeSeconds: 60,
    votingTimeSeconds: 45,
    showCategoryToImpostor: false,
    votes: {},
    roundNumber: 0,
    crewWins: 0,
    impostorWins: 0,
  };
}
