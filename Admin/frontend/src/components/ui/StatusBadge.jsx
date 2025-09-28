import React from 'react';
import { motion } from 'framer-motion';

const StatusBadge = ({ 
  status, 
  type = 'attendance',
  size = 'md',
  animated = true 
}) => {
  const getStatusStyles = () => {
    if (type === 'attendance') {
      switch (status?.toLowerCase()) {
        case 'present':
          return 'bg-green-500/20 text-green-300 border border-green-500/30';
        case 'absent':
          return 'bg-red-500/20 text-red-300 border border-red-500/30';
        case 'late':
          return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
        case 'holiday':
          return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
        case 'weekend':
          return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
        default:
          return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      }
    }
    
    if (type === 'holiday') {
      switch (status?.toLowerCase()) {
        case 'national':
          return 'bg-red-500/20 text-red-300 border border-red-500/30';
        case 'regional':
          return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
        case 'company':
          return 'bg-green-500/20 text-green-300 border border-green-500/30';
        case 'weekly':
          return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
        default:
          return 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';
      }
    }
    
    if (type === 'visit') {
      switch (status?.toLowerCase()) {
        case 'completed':
          return 'bg-green-500/20 text-green-300 border border-green-500/30';
        case 'pending':
          return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
        case 'in-progress':
          return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
        case 'cancelled':
          return 'bg-red-500/20 text-red-300 border border-red-500/30';
        default:
          return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
      }
    }
    
    return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1 text-xs';
    }
  };

  const getStatusIcon = () => {
    if (type === 'attendance') {
      switch (status?.toLowerCase()) {
        case 'present':
          return '✅';
        case 'absent':
          return '❌';
        case 'late':
          return '⏰';
        case 'holiday':
          return '🏖️';
        case 'weekend':
          return '🏠';
        default:
          return '📅';
      }
    }
    
    if (type === 'holiday') {
      switch (status?.toLowerCase()) {
        case 'national':
          return '🇮🇳';
        case 'regional':
          return '🏛️';
        case 'company':
          return '🏢';
        case 'weekly':
          return '📅';
        default:
          return '🗓️';
      }
    }
    
    if (type === 'visit') {
      switch (status?.toLowerCase()) {
        case 'completed':
          return '✅';
        case 'pending':
          return '⏳';
        case 'in-progress':
          return '🔄';
        case 'cancelled':
          return '❌';
        default:
          return '📍';
      }
    }
    
    return '';
  };

  const BadgeComponent = (
    <span className={`
      inline-flex items-center rounded-full font-medium backdrop-blur-sm
      ${getSizeClasses()} ${getStatusStyles()}
    `}>
      <span className="mr-1">{getStatusIcon()}</span>
      {status}
    </span>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="inline-block"
      >
        {BadgeComponent}
      </motion.div>
    );
  }

  return BadgeComponent;
};

export default StatusBadge;