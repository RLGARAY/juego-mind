import React from 'react';
import { howToPlayText } from '../config/global';

import Typography from '@mui/material/Typography';

const HowToPlay = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h1">CÓMO JUGAR</Typography>
      <Typography variant="h6">{howToPlayText}</Typography>
    </div>
  );
};

export default HowToPlay;
