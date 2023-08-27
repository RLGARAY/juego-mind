import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Home = () => {
  const navigate = useNavigate();

  const [nick, setNick] = useState('');
  const [roomId, setRoomId] = useState(0);
  const [roomCode, setRoomCode] = useState(0);

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

  /**
   * Method to set the Room code and format
   * it to be only number and 4 max length.
   */
  const handleRoomCodeChange = (event) => {
    let value = event.target.value.replace(/\D/, '');

    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    setRoomCode(value);
  };

  const CreateRoom = (e) => {
    const localRoomId = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    setRoomId(localRoomId);

    navigate('/' + localRoomId);
  };

  const JoinRoom = (e) => {
    e.preventDefault();
    // Lógica para unirse a una sala
    console.log(nick + roomId + roomCode);
    // Reiniciar el formulario
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
        <TextField
          name="nick"
          label="Nick"
          variant="outlined"
          value={nick}
          onChange={(event) => {
            setNick(event.target.value);
          }}
        />
        <TextField
          name="roomCode"
          label="Codigo"
          variant="outlined"
          value={roomCode}
          onChange={(event) => {
            handleRoomCodeChange(event);
          }}
        />
        <Button variant="contained" color="primary" onClick={CreateRoom}>
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
          name="nick"
          label="Nick"
          variant="outlined"
          value={nick}
          onChange={(event) => {
            setNick(event.target.value);
          }}
        />
        <TextField
          name="roomId"
          label="Sala"
          variant="outlined"
          value={roomId}
          onChange={(event) => {
            handleRoomIdChange(event);
          }}
        />
        <TextField
          name="roomCode"
          label="Codigo"
          variant="outlined"
          value={roomCode}
          onChange={(event) => {
            handleRoomCodeChange(event);
          }}
        />

        <Button variant="contained" color="primary" onClick={JoinRoom}>
          Unirse a Sala
        </Button>
      </Paper>
    </Box>
  );
};

export default Home;
