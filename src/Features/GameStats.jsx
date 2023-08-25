import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const PlayerHand = ({
  round,
  gameIsActive,
  roundIsActive,
  handleNextRound,
  handleStartGame,
  setGameIsActive,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginRight: '50px',
      }}
    >
      {gameIsActive && (
        <Box>
          <Typography variant="h4">Ronda: {round}</Typography>
          <Typography variant="h6">Vidas: {0}</Typography>
          <Typography variant="h6">Comodines: {0}</Typography>
        </Box>
      )}
      {gameIsActive && roundIsActive ? (
        <></>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={gameIsActive ? handleNextRound : handleStartGame}
        >
          {gameIsActive ? 'Siguiente Ronda' : 'Nueva Partida'}
        </Button>
      )}
      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: '20px' }}
        onClick={() => setGameIsActive(false)}
      >
        Terminar Partida
      </Button>
    </div>
  );
};

export default PlayerHand;
