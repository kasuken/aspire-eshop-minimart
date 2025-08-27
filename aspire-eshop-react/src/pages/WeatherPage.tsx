import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useApi } from '../hooks/useApi';
import { weatherApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorDisplay } from '../components/ErrorDisplay';

export const WeatherPage: React.FC = () => {
  const {
    data: forecasts,
    loading,
    error,
  } = useApi(() => weatherApi.getForecast());

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Weather
      </Typography>

      <Typography variant="body1" paragraph>
        This component demonstrates showing data loaded from a backend API service.
      </Typography>

      {loading && <LoadingSpinner message="Loading weather data..." />}

      {error && (
        <ErrorDisplay message="Failed to load weather data. Please try again." />
      )}

      {forecasts && (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Temp. (C)</TableCell>
                <TableCell align="right">Temp. (F)</TableCell>
                <TableCell>Summary</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forecasts.map((forecast, index) => (
                <TableRow key={index} hover>
                  <TableCell component="th" scope="row">
                    {new Date(forecast.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">{forecast.temperatureC}</TableCell>
                  <TableCell align="right">{forecast.temperatureF}</TableCell>
                  <TableCell>{forecast.summary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};