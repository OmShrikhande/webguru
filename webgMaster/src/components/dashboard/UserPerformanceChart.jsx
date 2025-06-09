import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box, IconButton, Divider, alpha } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const UserPerformanceChart = ({ data, period = 'Weekly' }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 11,
            weight: 500
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(25, 35, 60, 0.9)',
        titleColor: '#fff',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        bodyFont: {
          size: 12
        },
        titleFont: {
          size: 13,
          weight: 600
        },
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        borderColor: 'rgba(100, 180, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        boxHeight: 8,
        boxWidth: 8
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            size: 10
          }
        },
        beginAtZero: true
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 3,
        hoverRadius: 5,
        borderWidth: 2
      }
    }
  };

  return (
    <Card sx={{
      backgroundColor: 'rgba(25, 35, 60, 0.7)',
      borderRadius: 3,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(100, 180, 255, 0.1)',
      height: '100%',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
              User Performance
            </Typography>
            <Box 
              sx={{ 
                ml: 1.5, 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 5, 
                bgcolor: alpha('#1e88e5', 0.15), 
                color: '#90caf9', 
                fontSize: '0.75rem',
                fontWeight: 500
              }}
            >
              {period}
            </Box>
          </Box>
        }
        action={
          <IconButton aria-label="settings" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            <MoreVertIcon />
          </IconButton>
        }
        sx={{ pb: 1 }}
      />
      <Divider sx={{ opacity: 0.1 }} />
      <CardContent sx={{ p: 2, height: 'calc(100% - 72px)' }}>
        <Box sx={{ height: '100%', minHeight: '280px' }}>
          <Line options={chartOptions} data={data} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserPerformanceChart;