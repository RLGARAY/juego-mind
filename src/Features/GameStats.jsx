import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useRoomContext } from '../Context/RoomContext';
import { useGameContext } from '../Context/GameContext';

const GameStats = ({ handleNextRound, handleStartGame, handleUseJoker, handleLeaveRoom }) => {
  const { roomState } = useRoomContext();
  const { gameState } = useGameContext();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginRight: '50px',
      }}
    >
      {/* Game stats */}
      {gameState.gameStatus === 'Active' && (
        <Box sx={{ marginBottom: '20px' }}>
          <Typography variant="h4">Ronda: {gameState.roundNumber}</Typography>
          <Typography variant="h6">Vidas: {gameState.lives}</Typography>
          <Typography variant="h6">
            Comodines: {gameState.jokers}
            {roomState.host && gameState.jokers > 0 && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ marginLeft: '10px' }}
                onClick={handleUseJoker}
              >
                Usar
              </Button>
            )}
          </Typography>
        </Box>
      )}
      {gameState.gameStatus === 'Derrota' && <Typography variant="h4">¡Habéis Perdido!</Typography>}
      {gameState.gameStatus === 'Victoria' && <Typography variant="h4">¡Habéis Ganado!</Typography>}

      {/* Host actions */}
      {roomState.host &&
        roomState.player2 &&
        (gameState.gameStatus !== 'Active' ? (
          <Button variant="contained" color="primary" onClick={handleStartGame}>
            {'Nueva Partida'}
          </Button>
        ) : (
          gameState.player2Cards.length === 0 &&
          gameState.player1Cards.length === 0 && (
            <Button variant="contained" color="primary" onClick={handleNextRound}>
              {'Empezar Siguiente Ronda'}
            </Button>
          )
        ))}
      {/* Leave Room */}
      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: '20px' }}
        onClick={handleLeaveRoom}
      >
        {'Salir de la sala'}
      </Button>
    </div>
  );
};

export default GameStats;
