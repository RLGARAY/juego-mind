import React from 'react';
import { gameRules, hostInfo } from '../config/global';

import Typography from '@mui/material/Typography';

const HowToPlay = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h2">CÓMO JUGAR</Typography>
      <Typography variant="h6">{gameRules}</Typography>
      <Typography variant="h4">Para el jugador que crea la sala</Typography>
      <Typography variant="h6">{hostInfo}</Typography>
    </div>
  );
};

export default HowToPlay;
