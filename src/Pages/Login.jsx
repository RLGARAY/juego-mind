import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Material
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Context
import { useAuthContext } from '../Context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginAsGuest, login, createUser, authState } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [guest, setGuest] = useState(false); // For Tab state
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (authState.token) {
      navigate('/Home', { replace: true });
    }
  }, [authState.token, navigate]);

  /**
   * Method to Create user, log in user or log in as guest
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!guest) {
      if (isLogin) {
        login(email, password);
      } else {
        createUser(email, password, username);
      }
    } else {
      loginAsGuest(username);
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, #512DA8, #2E7D32)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Tabs value={guest} onChange={() => setGuest(!guest)}>
        <Tab value={false} label="Cuenta" />
        <Tab value={true} label="Anónimo" />
      </Tabs>
      {!guest ? (
        <>
          <h2>{isLogin ? 'Inicio de sesión' : 'Registro'}</h2>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <TextField
                type="email"
                label="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                type="password"
                label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {!isLogin && (
                <TextField
                  type="text"
                  label="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              )}
              <Typography variant="body1" sx={{ color: 'red' }}>
                {authState.error}
              </Typography>

              <Button type="submit" variant="contained">
                {isLogin ? 'Iniciar sesión' : 'Registrarse'}
              </Button>
            </Box>
          </form>
          <p>
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            <Button
              color="primary"
              onClick={() => setIsLogin(!isLogin)}
              sx={{ marginLeft: '0.5rem', textTransform: 'none' }}
            >
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </Button>
          </p>
        </>
      ) : (
        <>
          <h2>{'Nickname'}</h2>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <TextField
                type="text"
                label="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <Button type="submit" variant="contained">
                {'Jugar sin registrarse'}
              </Button>
            </Box>
          </form>
        </>
      )}
    </Box>
  );
};

export default Login;
