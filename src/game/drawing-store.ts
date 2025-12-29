import { create } from 'zustand';
import { 
  DrawingGameState, 
  DrawingPlayer, 
  DrawingGamePhase,
  DrawingLine,
  createDrawingInitialState,
  DRAWING_COLORS,
  DRAWING_WORD_CATEGORIES
} from './drawing-types';
import { getRandomElement, shuffleArray, AVATAR_COLORS } from './types';

interface DrawingGameStore extends DrawingGameState {
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  startGame: () => void;
  setPhase: (phase: DrawingGamePhase) => void;
  nextPlayer: () => void;
  addLine: (line: DrawingLine) => void;
  finishDrawingTurn: () => void;
  castVote: (voterId: string, votedForId: string) => void;
  calculateResults: () => { impostorCaught: boolean; impostorName: string };
  nextRound: () => void;
  resetGame: () => void;
  setDrawingTime: (seconds: number) => void;
  setMaxRounds: (rounds: number) => void;
}

export const useDrawingStore = create<DrawingGameStore>((set, get) => ({
  ...createDrawingInitialState(),

  addPlayer: (name: string) => {
    const { players } = get();
    if (players.length >= 8) return;
    
    const newPlayer: DrawingPlayer = {
      id: crypto.randomUUID(),
      name,
      avatarColor: AVATAR_COLORS[players.length % AVATAR_COLORS.length],
      drawingColor: DRAWING_COLORS[players.length % DRAWING_COLORS.length],
    };
    
    set({ players: [...players, newPlayer] });
  },

  removePlayer: (id: string) => {
    set(state => ({
      players: state.players.filter(p => p.id !== id)
    }));
  },

  startGame: () => {
    const { players, roundNumber } = get();
    if (players.length < 4) return;

    // Pick random category and word
    const categories = Object.keys(DRAWING_WORD_CATEGORIES);
    const category = getRandomElement(categories);
    const words = DRAWING_WORD_CATEGORIES[category];
    const secretWord = getRandomElement(words);

    // Pick random impostor (the fake artist)
    const shuffledPlayers = shuffleArray(players);
    const impostor = shuffledPlayers[0];

    // Mark impostor and assign drawing colors
    const updatedPlayers = players.map((p, index) => ({
      ...p,
      isImpostor: p.id === impostor.id,
      votes: 0,
      hasVoted: false,
      hasDrawn: false,
      drawingColor: DRAWING_COLORS[index % DRAWING_COLORS.length],
    }));

    set({
      phase: 'pass',
      players: updatedPlayers,
      currentPlayerIndex: 0,
      secretWord,
      category,
      impostorId: impostor.id,
      votes: {},
      lines: [],
      currentRound: 1,
      roundNumber: roundNumber + 1,
    });
  },

  setPhase: (phase: DrawingGamePhase) => set({ phase }),

  nextPlayer: () => {
    const { currentPlayerIndex, players, phase } = get();
    const nextIndex = currentPlayerIndex + 1;
    
    if (phase === 'reveal' || phase === 'pass') {
      // During reveal phase - go through all players
      if (nextIndex >= players.length) {
        // All players have seen their cards - start drawing
        set({ phase: 'drawing', currentPlayerIndex: 0 });
      } else {
        set({ phase: 'pass', currentPlayerIndex: nextIndex });
      }
    }
  },

  addLine: (line: DrawingLine) => {
    set(state => ({
      lines: [...state.lines, line]
    }));
  },

  finishDrawingTurn: () => {
    const { currentPlayerIndex, players, currentRound, maxDrawingRounds } = get();
    const nextIndex = currentPlayerIndex + 1;
    
    // Mark current player as having drawn this round
    const updatedPlayers = players.map((p, idx) => 
      idx === currentPlayerIndex ? { ...p, hasDrawn: true } : p
    );

    if (nextIndex >= players.length) {
      // All players have drawn this round
      if (currentRound >= maxDrawingRounds) {
        // All rounds complete - go to gallery
        set({ 
          phase: 'gallery', 
          players: updatedPlayers,
          currentPlayerIndex: 0 
        });
      } else {
        // Next round - show pass screen for first player
        const resetPlayers = updatedPlayers.map(p => ({ ...p, hasDrawn: false }));
        set({ 
          phase: 'drawingPass',
          currentRound: currentRound + 1, 
          currentPlayerIndex: 0,
          players: resetPlayers
        });
      }
    } else {
      // Next player draws - show pass screen
      set({ 
        phase: 'drawingPass',
        currentPlayerIndex: nextIndex,
        players: updatedPlayers
      });
    }
  },

  castVote: (voterId: string, votedForId: string) => {
    set(state => {
      const newVotes = { ...state.votes, [voterId]: votedForId };
      const updatedPlayers = state.players.map(p => {
        if (p.id === voterId) {
          return { ...p, hasVoted: true };
        }
        const votesForPlayer = Object.values(newVotes).filter(v => v === p.id).length;
        return { ...p, votes: votesForPlayer };
      });

      return { votes: newVotes, players: updatedPlayers };
    });
  },

  calculateResults: () => {
    const { players, impostorId } = get();
    
    const sortedByVotes = [...players].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    const mostVoted = sortedByVotes[0];
    
    const impostorCaught = mostVoted.id === impostorId;
    const impostor = players.find(p => p.id === impostorId)!;

    if (impostorCaught) {
      set(state => ({ crewWins: state.crewWins + 1 }));
    } else {
      set(state => ({ impostorWins: state.impostorWins + 1 }));
    }

    set({ phase: 'results' });

    return { impostorCaught, impostorName: impostor.name };
  },

  nextRound: () => {
    const { players } = get();
    const resetPlayers = players.map(p => ({
      ...p,
      isImpostor: undefined,
      votes: 0,
      hasVoted: false,
      hasDrawn: false,
    }));
    
    set({
      ...createDrawingInitialState(),
      players: resetPlayers,
      roundNumber: get().roundNumber,
      crewWins: get().crewWins,
      impostorWins: get().impostorWins,
    });
  },

  resetGame: () => {
    set(createDrawingInitialState());
  },

  setDrawingTime: (seconds: number) => {
    set({ drawingTimePerPlayer: seconds });
  },

  setMaxRounds: (rounds: number) => {
    set({ maxDrawingRounds: rounds });
  },
}));
