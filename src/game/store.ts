import { create } from 'zustand';
import { 
  GameState, 
  Player, 
  GamePhase,
  GameSettings, 
  createInitialState,
  createDefaultSettings,
  getRandomElement,
  shuffleArray,
  getMaxImpostors,
  ALL_CATEGORIES,
  FREE_CATEGORY_NAMES,
  AVATAR_COLORS
} from './types';

interface GameStore extends GameState {
  // Actions
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  startGame: () => void;
  setPhase: (phase: GamePhase) => void;
  nextPlayer: () => void;
  markPlayerRevealed: () => void;
  castVote: (voterId: string, votedForId: string) => void;
  calculateResults: () => { impostorsCaught: boolean; impostorNames: string[] };
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

  updateSettings: (newSettings: Partial<GameSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },

  startGame: () => {
    const { players, roundNumber, settings } = get();
    if (players.length < 3) return;

    // Get available categories (only from selected ones)
    const availableCategories = settings.selectedCategories.length > 0 
      ? settings.selectedCategories 
      : FREE_CATEGORY_NAMES;
    
    // Pick random category
    const category = getRandomElement(availableCategories);
    const words = ALL_CATEGORIES[category];
    
    if (!words || words.length === 0) return;
    
    // Pick random word entry
    const wordEntry = getRandomElement(words);
    const secretWord = wordEntry.word;
    const secretHint = wordEntry.hint;

    // Pick random impostors (respecting max limit)
    const maxImpostors = getMaxImpostors(players.length);
    const impostorCount = Math.min(settings.impostorCount, maxImpostors);
    
    const shuffledPlayers = shuffleArray(players);
    const impostorIds = shuffledPlayers.slice(0, impostorCount).map(p => p.id);

    // Mark impostors
    const updatedPlayers = players.map(p => ({
      ...p,
      isImpostor: impostorIds.includes(p.id),
      votes: 0,
      hasVoted: false,
    }));

    set({
      phase: 'pass',
      players: updatedPlayers,
      currentPlayerIndex: 0,
      secretWord,
      secretHint,
      category,
      impostorIds,
      votes: {},
      roundNumber: roundNumber + 1,
    });
  },

  setPhase: (phase: GamePhase) => set({ phase }),

  nextPlayer: () => {
    const { currentPlayerIndex, players, settings } = get();
    const nextIndex = currentPlayerIndex + 1;
    
    if (nextIndex >= players.length) {
      // All players have seen their cards
      // Check game mode - simple goes to simpleRoundEnd, guided goes to discussion
      const nextPhase = settings.gameMode === 'simple' ? 'simpleRoundEnd' : 'discussion';
      set({ phase: nextPhase, currentPlayerIndex: 0 });
    } else {
      set({ phase: 'pass', currentPlayerIndex: nextIndex });
    }
  },

  markPlayerRevealed: () => {
    // No longer used, kept for backwards compatibility
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
    const { players, impostorIds } = get();
    
    // Find player with most votes
    const sortedByVotes = [...players].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    const mostVoted = sortedByVotes[0];
    
    // Check if the most voted player is an impostor
    const impostorsCaught = impostorIds.includes(mostVoted.id);
    const impostorNames = players.filter(p => impostorIds.includes(p.id)).map(p => p.name);

    if (impostorsCaught) {
      set(state => ({ crewWins: state.crewWins + 1 }));
    } else {
      set(state => ({ impostorWins: state.impostorWins + 1 }));
    }

    set({ phase: 'results' });

    return { impostorsCaught, impostorNames };
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
      settings: get().settings,
      roundNumber: get().roundNumber,
      crewWins: get().crewWins,
      impostorWins: get().impostorWins,
    });
  },

  resetGame: () => {
    set(createInitialState());
  },
}));
