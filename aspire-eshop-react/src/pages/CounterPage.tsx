import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

export const CounterPage: React.FC = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Counter
      </Typography>

      <Typography variant="body1" paragraph>
        This component demonstrates a simple counter with React state management.
      </Typography>

      <Paper elevation={2} sx={{ p: 4, textAlign: 'center', maxWidth: 400, mx: 'auto' }}>
        <Typography variant="h2" component="div" sx={{ mb: 3, color: 'primary.main' }}>
          {count}
        </Typography>

        <Box display="flex" gap={2} justifyContent="center">
          <Button
            variant="contained"
            color="error"
            startIcon={<RemoveIcon />}
            onClick={decrement}
            size="large"
          >
            Decrement
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={increment}
            size="large"
          >
            Increment
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};