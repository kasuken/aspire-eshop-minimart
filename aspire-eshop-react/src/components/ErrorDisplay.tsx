import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

interface ErrorDisplayProps {
  message: string;
  title?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  onClose?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  title = 'Error',
  severity = 'error',
  onClose,
}) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert 
        severity={severity} 
        onClose={onClose}
        variant="filled"
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Box>
  );
};