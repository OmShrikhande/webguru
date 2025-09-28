import React from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  ChartBarIcon,
  SparklesIcon,
  EyeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const FeatureShowcase = () => {
  const features = [
    {
      title: "Monthly Reports",
      description: "Generate comprehensive attendance reports with holiday exclusions",
      icon: DocumentTextIcon,
      gradient: "from-indigo-500 to-purple-600",
      path: "/monthly-reports",
      highlights: [
        "Working days calculation",
        "Distance tracking",
        "Visual attendance breakdown",
        "Export functionality"
      ]
    },
    {
      title: "Holiday Management",
      description: "Manage holidays with recurring patterns and automatic calculations",
      icon: CalendarIcon,
      gradient: "from-green-500 to-emerald-600",
      path: "/holiday-management",
      highlights: [
        "National & company holidays",
        "Recurring holiday patterns",
        "Easy bulk initialization",
        "Visual calendar interface"
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 group cursor-pointer"
          onClick={() => window.location.href = feature.path}
        >
          <div className="flex items-start space-x-4 mb-6">
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
              <feature.icon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                {feature.description}
              </p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            {feature.highlights.map((highlight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index * 0.2) + (idx * 0.1) }}
                className="flex items-center space-x-3"
              >
                <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 group-hover:text-gray-200 transition-colors">
                  {highlight}
                </span>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors"
          >
            <span className="font-medium mr-2">Explore Feature</span>
            <EyeIcon className="h-5 w-5" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default FeatureShowcase;