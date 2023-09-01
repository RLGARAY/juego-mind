import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

//Material UI
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ProfileIcon from '@mui/icons-material/AccountBox';
import InfoIcon from '@mui/icons-material/Info';

//Components
import Profile from './Profile';
import HowToPlay from './HowToPlay';

function Layout() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);

  const handleOpenInfo = () => {
    setOpenInfo(true);
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
  };
  const handleOpenProfile = () => {
    setOpenProfile(true);
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  return (
    <Box sx={{ height: '100vh', background: 'linear-gradient(to bottom, #512DA8, #2E7D32)' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'auto',
          marginBottom: 5,
        }}
      >
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            top: '20px',
            left: '20px',
          }}
          onClick={handleOpenInfo}
        >
          <InfoIcon />
        </Fab>

        <Typography variant="h1">The Mind</Typography>

        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            top: '20px',
            right: '20px',
          }}
          onClick={handleOpenProfile}
        >
          <ProfileIcon />
        </Fab>
      </Box>

      {/* Info Dialog */}
      <Dialog fullWidth={true} maxWidth={'sm'} open={openInfo} onClose={handleCloseInfo}>
        <DialogContent>
          <HowToPlay />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfo}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* PROFILE Dialog */}
      <Dialog fullWidth={true} maxWidth={'sm'} open={openProfile} onClose={handleCloseProfile}>
        <DialogContent>
          <Profile onClose={handleCloseProfile} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfile}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* MAIN CONTENT */}
      <Outlet />
    </Box>
  );
}

export default Layout;
