import React, { useState } from 'react';

//Materia UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
//Icons
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const Chat = ({ messages, onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMessageSend = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    onSendMessage(message);
    e.target.reset();
  };

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="persistent"
        anchor="left"
        open={isOpen}
        sx={{
          width: '300px',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '300px',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: '4px',
          }}
        >
          <Typography variant="h6">Chat</Typography>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {messages.map((message, index) => (
            <ListItem key={index} disablePadding>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      marginLeft: '4px',
                      overflowWrap: 'break-word',
                      wordWrap: 'break-word',
                      hyphens: 'auto',
                    }}
                  >
                    <strong>{message.nick}:</strong> {message.message}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
        <form onSubmit={handleMessageSend}>
          <TextField name="message" label="Message" variant="outlined" fullWidth margin="dense" />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Send
          </Button>
        </form>
      </Drawer>
      <IconButton
        sx={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
        }}
        onClick={handleDrawerToggle}
      >
        {!isOpen && <ChatIcon />}
      </IconButton>
    </Box>
  );
};

export default Chat;
