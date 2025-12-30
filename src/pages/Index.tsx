import { useState } from 'react';
import { HomeScreen } from '@/screens/HomeScreen';
import { 
  LobbyScreen, 
  PassScreen, 
  RevealScreen, 
  LockScreen,
  DiscussionScreen,
  VotingScreen,
  ResultsScreen,
  SimpleRoundEndScreen,
} from '@/screens';
import {
  DrawingLobbyScreen,
  DrawingPassScreen,
  DrawingRevealScreen,
  DrawingPassTurnScreen,
  DrawingTurnScreen,
  DrawingGalleryScreen,
  DrawingDiscussionScreen,
  DrawingVotingScreen,
  DrawingResultsScreen,
  DrawingSimpleRoundEndScreen,
} from '@/screens/drawing';
import { useGameStore } from '@/game/store';
import { useDrawingStore } from '@/game/drawing-store';
import { toast } from 'sonner';

type AppScreen = 'home' | 'impostor' | 'impostor-drawing';

const Index = () => {
  const [screen, setScreen] = useState<AppScreen>('home');
  
  // Impostor Secret Word store
  const { 
    phase: impostorPhase, 
    startGame: startImpostorGame, 
    setPhase: setImpostorPhase, 
    nextPlayer: nextImpostorPlayer 
  } = useGameStore();
  
  // Impostor Drawing store
  const {
    phase: drawingPhase,
    startGame: startDrawingGame,
    setPhase: setDrawingPhase,
    nextPlayer: nextDrawingPlayer,
    finishDrawingTurn,
  } = useDrawingStore();

  const handleSelectGame = (gameId: string) => {
    if (gameId === 'impostor') {
      setScreen('impostor');
    } else if (gameId === 'impostor-drawing') {
      setScreen('impostor-drawing');
    } else {
      toast('Coming Soon!', {
        description: 'This game mode is under development.',
        duration: 2000,
      });
    }
  };

  const handleBackToHome = () => {
    setScreen('home');
    useGameStore.getState().resetGame();
    useDrawingStore.getState().resetGame();
  };

  // ============ IMPOSTOR SECRET WORD HANDLERS ============
  const handleImpostorStart = () => {
    startImpostorGame();
  };

  const handleImpostorConfirmPlayer = () => {
    setImpostorPhase('reveal');
  };

  const handleImpostorRevealDone = () => {
    setImpostorPhase('lockScreen');
  };

  const handleImpostorLockContinue = () => {
    nextImpostorPlayer();
  };

  const handleImpostorGoToVoting = () => {
    setImpostorPhase('voting');
  };

  const handleImpostorVotingComplete = () => {
    setImpostorPhase('results');
  };

  const handleImpostorPlayAgain = () => {
    startImpostorGame();
  };

  const handleImpostorBackToLobby = () => {
    setImpostorPhase('lobby');
  };

  // ============ IMPOSTOR DRAWING HANDLERS ============
  const handleDrawingStart = () => {
    startDrawingGame();
  };

  const handleDrawingConfirmPlayer = () => {
    setDrawingPhase('reveal');
  };

  const handleDrawingRevealDone = () => {
    nextDrawingPlayer();
  };

  const handleDrawingPassTurnConfirm = () => {
    // Go directly to drawing
    setDrawingPhase('drawing');
  };

  const handleDrawingTurnComplete = () => {
    // finishDrawingTurn handles the phase transition to drawingPass or gallery
  };

  const handleDrawingStartDiscussion = () => {
    setDrawingPhase('discussion');
  };

  const handleDrawingGoToVoting = () => {
    setDrawingPhase('voting');
  };

  const handleDrawingVotingComplete = () => {
    setDrawingPhase('results');
  };

  const handleDrawingPlayAgain = () => {
    startDrawingGame();
  };

  const handleDrawingBackToLobby = () => {
    setDrawingPhase('lobby');
  };

  // ============ RENDER ============
  
  // Home screen
  if (screen === 'home') {
    return <HomeScreen onSelectGame={handleSelectGame} />;
  }

  // Impostor Secret Word game screens
  if (screen === 'impostor') {
    switch (impostorPhase) {
      case 'lobby':
        return <LobbyScreen onStart={handleImpostorStart} onBack={handleBackToHome} />;
      case 'pass':
        return <PassScreen onConfirm={handleImpostorConfirmPlayer} />;
      case 'reveal':
        return <RevealScreen onDone={handleImpostorRevealDone} />;
      case 'lockScreen':
        return <LockScreen onContinue={handleImpostorLockContinue} />;
      case 'simpleRoundEnd':
        return (
          <SimpleRoundEndScreen 
            onRestartRound={handleImpostorPlayAgain} 
            onAdjustGame={handleImpostorBackToLobby}
          />
        );
      case 'discussion':
        return <DiscussionScreen onGoToVoting={handleImpostorGoToVoting} />;
      case 'voting':
        return <VotingScreen onComplete={handleImpostorVotingComplete} />;
      case 'results':
        return (
          <ResultsScreen 
            onPlayAgain={handleImpostorPlayAgain} 
            onBackToLobby={handleImpostorBackToLobby}
          />
        );
      default:
        return <LobbyScreen onStart={handleImpostorStart} onBack={handleBackToHome} />;
    }
  }

  // Impostor Drawing game screens
  if (screen === 'impostor-drawing') {
    switch (drawingPhase) {
      case 'lobby':
        return <DrawingLobbyScreen onStart={handleDrawingStart} onBack={handleBackToHome} />;
      case 'pass':
        return <DrawingPassScreen onConfirm={handleDrawingConfirmPlayer} onExit={handleBackToHome} />;
      case 'reveal':
        return <DrawingRevealScreen onDone={handleDrawingRevealDone} onExit={handleBackToHome} />;
      case 'drawingPass':
        return <DrawingPassTurnScreen onConfirm={handleDrawingPassTurnConfirm} onExit={handleBackToHome} />;
      case 'drawing':
        return <DrawingTurnScreen onTurnComplete={handleDrawingTurnComplete} onExit={handleBackToHome} />;
      case 'gallery':
        return <DrawingGalleryScreen onStartDiscussion={handleDrawingStartDiscussion} onExit={handleBackToHome} />;
      case 'simpleRoundEnd':
        return (
          <DrawingSimpleRoundEndScreen 
            onRestartRound={handleDrawingPlayAgain} 
            onAdjustGame={handleDrawingBackToLobby}
          />
        );
      case 'discussion':
        return <DrawingDiscussionScreen onGoToVoting={handleDrawingGoToVoting} onExit={handleBackToHome} />;
      case 'voting':
        return <DrawingVotingScreen onComplete={handleDrawingVotingComplete} onExit={handleBackToHome} />;
      case 'results':
        return (
          <DrawingResultsScreen 
            onPlayAgain={handleDrawingPlayAgain} 
            onBackToLobby={handleDrawingBackToLobby}
          />
        );
      default:
        return <DrawingLobbyScreen onStart={handleDrawingStart} onBack={handleBackToHome} />;
    }
  }

  return <HomeScreen onSelectGame={handleSelectGame} />;
};

export default Index;
