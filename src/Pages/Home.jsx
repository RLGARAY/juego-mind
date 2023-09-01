import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../Context/AuthContext';
import { useRoomContext } from '../Context/RoomContext';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Home = () => {
  const navigate = useNavigate();
  const { authState } = useAuthContext();
  const { createRoom, joinRoom } = useRoomContext();

  const [roomId, setRoomId] = useState('');
  const [joinError, setJoinError] = useState(false);

  /**
   * Method to set the Room Id and format
   * it to be only number and 3 max length.
   */
  const handleRoomIdChange = (event) => {
    let value = event.target.value.replace(/\D/, '');

    if (value.length > 3) {
      value = value.slice(0, 3);
    }
    setRoomId(value);
  };

  const handleCreateRoom = (e) => {
    const localRoomId = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    createRoom(localRoomId, authState.username);

    navigate('/' + localRoomId);
  };

  const handleJoinRoom = async (e) => {
    const roomString = roomId.toString().padStart(3, '0');
    try {
      await joinRoom(roomString, authState.username);
      navigate('/' + roomId);
    } catch (error) {
      setJoinError(error.message);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}
    >
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          padding: '20px',
          gap: 5,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleCreateRoom}>
          Crear Sala
        </Button>
      </Paper>

      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          padding: '20px',
          gap: 5,
        }}
      >
        <TextField
          name="roomId"
          label="Sala"
          variant="outlined"
          value={roomId}
          onChange={(event) => {
            handleRoomIdChange(event);
          }}
        />

        <Typography variant="body1" sx={{ color: 'red' }}>
          {joinError}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleJoinRoom}>
          Unirse a Sala
        </Button>
      </Paper>
    </Box>
  );
};

export default Home;
