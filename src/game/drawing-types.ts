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
  | 'drawing'
  | 'gallery'
  | 'discussion'
  | 'voting'
  | 'results';

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
    votes: {},
    roundNumber: 0,
    crewWins: 0,
    impostorWins: 0,
  };
}
