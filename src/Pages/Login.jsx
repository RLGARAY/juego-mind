import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Material
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';

// Context
import { useAuthContext } from '../Context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, createUser, authState } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (authState.token) {
      navigate('/Home', { replace: true });
    }
  }, [authState.token, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLogin) {
      login(email, password);
    } else {
      createUser(email, password, username);
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
          {/*isLogin && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Recordarme"
            />
            )*/}
          <Button type="submit" variant="contained">
            {isLogin ? 'Iniciar sesión' : 'Registrarse'}
          </Button>
        </Box>
      </form>
      <p>
        {isLogin ? '¿No tienes una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia sesión'}
        <Button
          color="primary"
          onClick={() => setIsLogin(!isLogin)}
          sx={{ marginLeft: '0.5rem', textTransform: 'none' }}
        >
          {isLogin ? 'aquí' : 'ahora'}
        </Button>
      </p>
    </Box>
  );
};

export default Login;
