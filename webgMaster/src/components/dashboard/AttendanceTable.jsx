import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  IconButton, 
  Divider, 
  alpha,
  Avatar,
  Chip,
  Tooltip,
  LinearProgress
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

const AttendanceTable = ({ data }) => {
  const columns = [
    { 
      field: 'user', 
      headerName: 'User', 
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={params.value.avatar} 
            alt={params.value.name}
            sx={{ 
              width: 32, 
              height: 32, 
              mr: 1.5,
              border: '2px solid rgba(100, 180, 255, 0.3)'
            }}
          >
            {params.value.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
              {params.value.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {params.value.role}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'checkInTime',
      headerName: 'Check In',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: alpha('#4fc3f7', 0.9) }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'checkOutTime',
      headerName: 'Check Out',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: alpha('#ff9800', 0.9) }}>
          {params.value || '--:--'}
        </Typography>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow>
          <Typography variant="body2" sx={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            maxWidth: 150
          }}>
            📍 {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'Present':
              return '#4caf50';
            case 'Late':
              return '#ff9800';
            case 'Absent':
              return '#f44336';
            case 'Half Day':
              return '#9c27b0';
            default:
              return '#9e9e9e';
          }
        };
        
        return (
          <Chip 
            label={params.value} 
            size="small"
            sx={{
              backgroundColor: alpha(getStatusColor(params.value), 0.15),
              color: getStatusColor(params.value),
              fontWeight: 500,
              borderRadius: '4px',
              border: `1px solid ${alpha(getStatusColor(params.value), 0.3)}`,
            }}
          />
        );
      },
    },
    {
      field: 'workHours',
      headerName: 'Work Hours',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const percentage = (params.value / 8) * 100;
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {params.value} hrs
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {Math.round(percentage)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={percentage > 100 ? 100 : percentage}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha('#1e88e5', 0.15),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundImage: 'linear-gradient(90deg, #1e88e5, #42a5f5)',
                }
              }}
            />
          </Box>
        );
      },
    },
  ];

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
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
            Today's Attendance
          </Typography>
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
        <Box sx={{ height: '100%', width: '100%', minHeight: '400px' }}>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 15]}
            disableRowSelectionOnClick
            disableColumnMenu
            autoHeight
            sx={{
              border: 'none',
              '& .MuiDataGrid-main': { 
                width: '100%' 
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(100, 180, 255, 0.05)',
                padding: '12px 16px',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: alpha('#1e88e5', 0.07),
                borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                borderRadius: '8px 8px 0 0',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
                color: '#90caf9',
                fontSize: '0.875rem',
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: alpha('#1e88e5', 0.05),
                },
                '&:last-child .MuiDataGrid-cell': {
                  borderBottom: 'none',
                },
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid rgba(100, 180, 255, 0.1)',
              },
              '& .MuiTablePagination-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiIconButton-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                width: '6px',
                height: '6px',
              },
              '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                background: alpha('#1e88e5', 0.05),
                borderRadius: '8px',
              },
              '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                backgroundColor: alpha('#1e88e5', 0.2),
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: alpha('#1e88e5', 0.3),
                },
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;