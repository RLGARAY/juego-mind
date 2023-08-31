import React from 'react';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

import HandCard from './HandCard/HandCard';

const PlayerHand = ({ local, cards, onCardClick }) => {
  return (
    <>
      {cards &&
        (local ? (
          <Grid container spacing={1} sx={{ display: 'flex', flexWrap: 'nowrap' }}>
            {cards.map((card, index) => (
              <motion.div key={card.id} onClick={() => onCardClick(card)}>
                <Grid item>
                  <HandCard card={card} playable={true} />
                </Grid>
              </motion.div>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'nowrap',
              gap: '5px',
              marginTop: '5px',
            }}
          >
            {cards.map(() => (
              <Card sx={{ width: '30px', height: '50px' }}>
                <img
                  style={{ width: '30px', height: '50px' }}
                  src={'Images/dorso.png'}
                  alt="card"
                />
              </Card>
            ))}
          </Box>
        ))}
    </>
  );
};

export default PlayerHand;
