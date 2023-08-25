import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import Chat from '../Components/Chat';
import PlayerHand from '../Assets/PlayerHand';
import GameStats from '../Components/GameStats';

const GameRoom = () => {
  const [messages, setMessages] = useState([]);
  const [round, setRound] = useState(0);
  const [gameIsActive, setGameIsActive] = useState(false);
  const [roundIsActive, setRoundIsActive] = useState(false);

  const handleSendMessage = (nick, message) => {
    const newMessage = {
      nick,
      message,
    };
    setMessages([...messages, newMessage]);
  };

  const handleStartGame = () => {
    setGameIsActive(true);
    setRound(1);
    setRoundIsActive(true);
    //Repartir Cartas
  };

  const handleNextRound = () => {
    setRound(round + 1);
  };

  return (
    <div>
      <Grid
        container
        spacing={2}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Other Player hand */}
        <Grid
          item
          xs={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">Player</Typography>
          <PlayerHand local={false} />
        </Grid>

        {/* Played Cards Space */}

        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          {/* Game Info left column */}
          <Box sx={{ height: '50vh', display: 'flex', flexDirection: 'row' }}>
            <GameStats
              round={round}
              gameIsActive={gameIsActive}
              roundIsActive={roundIsActive}
              handleNextRound={handleNextRound}
              handleStartGame={handleStartGame}
              setGameIsActive={setGameIsActive}
            />
          </Box>
        </Grid>
        {/*Player Hand */}
        <Grid
          item
          xs={11}
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <PlayerHand local={true} />
        </Grid>
      </Grid>

      {/* Chat Component */}
      <Chat messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default GameRoom;
