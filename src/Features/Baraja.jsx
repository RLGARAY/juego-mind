import React from 'react';
import Box from '@mui/material/Box';

const Baraja = () => {
  return (
    <div style={{ perspective: '1000px', width: '200px', height: '200px' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(45deg, #eaeaea, #999999)',
          boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.3)',
          transformStyle: 'preserve-3d',
          transform: 'rotateY(45deg)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, #ffffff, #cccccc)',
            transform: 'translateZ(50px)',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, #ffffff, #cccccc)',
            transform: 'rotateY(90deg) translateZ(50px)',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, #ffffff, #cccccc)',
            transform: 'rotateY(180deg) translateZ(50px)',
          }}
        ></div>
      </Box>
    </div>
  );
};

export default Baraja;
