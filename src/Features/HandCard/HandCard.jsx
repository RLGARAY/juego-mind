import React from 'react';
import { motion } from 'framer-motion';

import Card from '@mui/material/Card';

import './style.css';

const HandCard = ({ card, playable }) => {
  return (
    <motion.div
      whileHover={playable ? { scale: 1.1, y: -10 } : {}}
      whileTap={playable ? { scale: 0.9, transition: { duration: 0.3 } } : {}}
    >
      <Card
        sx={{
          flexShrink: 'auto',
          textAlign: 'center',
          position: 'relative',
          cursor: !playable & 'pointer',
          width: '100px',
          height: '150px',
          margin: '0 10px',
        }}
      >
        <img style={{ width: '100%', height: '100%' }} alt="card" src={'Images/BaseCard.png'} />

        {/* Setting card number over the image base on card.id */}
        <div className="unselectable text-center">{card.id}</div>
        <div className="unselectable text-corner top-left">{card.id}</div>
        <div className="unselectable text-corner top-right">{card.id}</div>
        <div className="unselectable text-corner bottom-left">{card.id}</div>
        <div className="unselectable text-corner bottom-right">{card.id}</div>
      </Card>
    </motion.div>
  );
};

export default HandCard;
