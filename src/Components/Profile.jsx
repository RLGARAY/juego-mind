import React from 'react';

// Context
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuthContext } from '../Context/AuthContext';

const Profile = ({ onClose }) => {
  const { authState, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h1">Tu Perfil</Typography>
      <Typography variant="h6">Nick: {authState.username}</Typography>
      <Typography variant="body1">Correo electrónico: {authState.email || 'invitado'}</Typography>
      <Button onClick={handleLogout} color="primary">
        Cerrar Sesion
      </Button>
    </div>
  );
};

export default Profile;
