import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

//Material UI
import Fab from '@mui/material/Fab';
import FabIcon from '@mui/icons-material/AccountBox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

//Components
import Profile from './Profile';
import Login from './Login';
// import { useAuthContext } from '../Context/AuthContext';

function Layout() {
  // const { authState } = useAuthContext();

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
        <Typography variant="h1">The Mind</Typography>

        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            top: '20px',
            right: '20px',
          }}
          onClick={handleOpenDialog}
        >
          <FabIcon />
        </Fab>
      </Box>

      <Dialog fullWidth={true} maxWidth={'xl'} open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <Profile onClose={handleCloseDialog} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Disagree</Button>
          <Button onClick={handleCloseDialog}>Agree</Button>
        </DialogActions>
      </Dialog>

      {/* MAIN CONTENT */}

      <Outlet />
    </Box>
  );
}

export default Layout;
