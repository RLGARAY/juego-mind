import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useRoomContext } from '../Context/RoomContext';
import { useGameContext } from '../Context/GameContext';

const PlayerHand = ({ handleNextRound, handleStartGame }) => {
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
      {gameState.gameStatus === 'Active' && (
        <Box>
          <Typography variant="h4">Ronda: {gameState.roundNumber}</Typography>
          <Typography variant="h6">Vidas: {gameState.lives}</Typography>
          <Typography variant="h6">Comodines: {gameState.jokers}</Typography>
        </Box>
      )}

      {roomState.host &&
        roomState.player2 !== '' &&
        (gameState.gameStatus !== 'Active' ? (
          <Button variant="contained" color="primary" onClick={handleStartGame}>
            {'Nueva Partida'}
          </Button>
        ) : (
          !gameState.isRoundActive && (
            <Button variant="contained" color="primary" onClick={handleNextRound}>
              {'Empezar Siguiente Ronda'}
            </Button>
          )
        ))}

      <Button variant="contained" color="secondary" style={{ marginTop: '20px' }}>
        Salir por implementar o borrar
      </Button>
    </div>
  );
};

export default PlayerHand;
