import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ variant = 'text', className = '' }) => {
  const baseClasses = 'shimmer rounded';
  
  const variantClasses = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    circle: 'h-12 w-12 rounded-full',
    rectangle: 'h-32 w-full',
    card: 'h-48 w-full rounded-2xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    />
  );
};

export const SkeletonCard = () => (
  <div className="bg-white p-4 rounded-2xl space-y-3">
    <div className="flex items-center gap-3">
      <SkeletonLoader variant="circle" />
      <div className="flex-1 space-y-2">
        <SkeletonLoader variant="title" />
        <SkeletonLoader variant="text" className="w-1/2" />
      </div>
    </div>
    <SkeletonLoader variant="text" />
    <SkeletonLoader variant="text" className="w-2/3" />
  </div>
);

export default SkeletonLoader;
