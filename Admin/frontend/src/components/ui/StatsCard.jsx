import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  gradient = 'from-blue-500 to-indigo-600',
  delay = 0,
  trend = null,
  trendDirection = 'up'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-300 mb-2 group-hover:text-gray-200 transition-colors">
            {title}
          </p>
          <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-1`}>
            {value}
          </p>
          {trend && (
            <div className={`flex items-center text-sm ${
              trendDirection === 'up' ? 'text-green-400' : 
              trendDirection === 'down' ? 'text-red-400' : 
              'text-gray-400'
            }`}>
              <span className="mr-1">
                {trendDirection === 'up' ? '↗️' : trendDirection === 'down' ? '↘️' : '➡️'}
              </span>
              {trend}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;