import React from 'react';
import { motion } from 'framer-motion';

const GlassTable = ({ 
  headers, 
  data, 
  renderRow, 
  title, 
  icon: Icon,
  gradient = 'from-indigo-500 to-purple-600',
  emptyMessage = 'No data available',
  loading = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl"
    >
      {title && (
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          {Icon && (
            <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} mr-4 shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          )}
          {title}
        </h3>
      )}
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 max-w-md mx-auto">
            {Icon && <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />}
            <p className="text-gray-300 mb-2">{emptyMessage}</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/20">
                {headers.map((header, index) => (
                  <th 
                    key={index}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.map((item, index) => (
                <motion.tr
                  key={item.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-white/5 transition-colors duration-200"
                >
                  {renderRow(item, index)}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default GlassTable;