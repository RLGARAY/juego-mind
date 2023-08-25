import React from 'react';

// Context
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Profile = ({ onClose }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h1">Tu Perfil</Typography>
      <Typography variant="h6">Nick: {}</Typography>
      <Typography variant="body1">Correo electrónico: {}</Typography>
      <Button onClick={onClose} color="primary">
        Cerrar Sesion
      </Button>
    </div>
  );
};

export default Profile;
