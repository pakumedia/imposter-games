import { useState } from 'react';
import { HomeScreen } from '@/screens/HomeScreen';
import { 
  LobbyScreen, 
  PassScreen, 
  RevealScreen, 
  LockScreen,
  DiscussionScreen,
  VotingScreen,
  ResultsScreen 
} from '@/screens';
import { useGameStore } from '@/game/store';

type AppScreen = 'home' | 'game';

const Index = () => {
  const [screen, setScreen] = useState<AppScreen>('home');
  const { phase, startGame, setPhase, nextPlayer } = useGameStore();

  const handleSelectGame = (gameId: string) => {
    if (gameId === 'impostor') {
      setScreen('game');
    }
  };

  const handleStartGame = () => {
    startGame();
  };

  const handleConfirmPlayer = () => {
    setPhase('reveal');
  };

  const handleRevealDone = () => {
    setPhase('lockScreen');
  };

  const handleLockContinue = () => {
    nextPlayer();
  };

  const handleGoToVoting = () => {
    setPhase('voting');
  };

  const handleVotingComplete = () => {
    setPhase('results');
  };

  const handlePlayAgain = () => {
    startGame();
  };

  const handleBackToLobby = () => {
    setPhase('lobby');
  };

  const handleBackToHome = () => {
    setScreen('home');
    useGameStore.getState().resetGame();
  };

  // Home screen
  if (screen === 'home') {
    return <HomeScreen onSelectGame={handleSelectGame} />;
  }

  // Game screens based on phase
  switch (phase) {
    case 'lobby':
      return <LobbyScreen onStart={handleStartGame} />;
    
    case 'pass':
      return <PassScreen onConfirm={handleConfirmPlayer} />;
    
    case 'reveal':
      return <RevealScreen onDone={handleRevealDone} />;
    
    case 'lockScreen':
      return <LockScreen onContinue={handleLockContinue} />;
    
    case 'discussion':
      return <DiscussionScreen onGoToVoting={handleGoToVoting} />;
    
    case 'voting':
      return <VotingScreen onComplete={handleVotingComplete} />;
    
    case 'results':
      return (
        <ResultsScreen 
          onPlayAgain={handlePlayAgain} 
          onBackToLobby={handleBackToLobby}
        />
      );
    
    default:
      return <LobbyScreen onStart={handleStartGame} />;
  }
};

export default Index;
