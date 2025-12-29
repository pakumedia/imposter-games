import { create } from 'zustand';
import { 
  GameState, 
  Player, 
  GamePhase, 
  createInitialState, 
  getRandomElement,
  shuffleArray,
  WORD_CATEGORIES,
  AVATAR_COLORS
} from './types';

interface GameStore extends GameState {
  // Actions
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  startGame: () => void;
  setPhase: (phase: GamePhase) => void;
  nextPlayer: () => void;
  markPlayerRevealed: () => void;
  castVote: (voterId: string, votedForId: string) => void;
  calculateResults: () => { impostorCaught: boolean; impostorName: string };
  nextRound: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  addPlayer: (name: string) => {
    const { players } = get();
    if (players.length >= 10) return;
    
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      avatarColor: AVATAR_COLORS[players.length % AVATAR_COLORS.length],
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
    if (players.length < 3) return;

    // Pick random category and word
    const categories = Object.keys(WORD_CATEGORIES);
    const category = getRandomElement(categories);
    const words = WORD_CATEGORIES[category];
    const secretWord = getRandomElement(words);

    // Pick random impostor
    const shuffledPlayers = shuffleArray(players);
    const impostor = shuffledPlayers[0];

    // Mark impostor
    const updatedPlayers = players.map(p => ({
      ...p,
      isImpostor: p.id === impostor.id,
      votes: 0,
      hasVoted: false,
    }));

    set({
      phase: 'pass',
      players: updatedPlayers,
      currentPlayerIndex: 0,
      secretWord,
      category,
      impostorId: impostor.id,
      votes: {},
      roundNumber: roundNumber + 1,
    });
  },

  setPhase: (phase: GamePhase) => set({ phase }),

  nextPlayer: () => {
    const { currentPlayerIndex, players } = get();
    const nextIndex = currentPlayerIndex + 1;
    
    if (nextIndex >= players.length) {
      // All players have seen their cards
      set({ phase: 'discussion', currentPlayerIndex: 0 });
    } else {
      set({ phase: 'pass', currentPlayerIndex: nextIndex });
    }
  },

  markPlayerRevealed: () => {
    set({ phase: 'lockScreen' });
  },

  castVote: (voterId: string, votedForId: string) => {
    set(state => {
      const newVotes = { ...state.votes, [voterId]: votedForId };
      const updatedPlayers = state.players.map(p => {
        if (p.id === voterId) {
          return { ...p, hasVoted: true };
        }
        // Count votes for this player
        const votesForPlayer = Object.values(newVotes).filter(v => v === p.id).length;
        return { ...p, votes: votesForPlayer };
      });

      return { votes: newVotes, players: updatedPlayers };
    });
  },

  calculateResults: () => {
    const { players, impostorId } = get();
    
    // Find player with most votes
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
    // Reset player states
    const resetPlayers = players.map(p => ({
      ...p,
      isImpostor: undefined,
      votes: 0,
      hasVoted: false,
    }));
    
    set({
      ...createInitialState(),
      players: resetPlayers,
      roundNumber: get().roundNumber,
      crewWins: get().crewWins,
      impostorWins: get().impostorWins,
    });
  },

  resetGame: () => {
    set(createInitialState());
  },
}));
