"use client";
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

const LocationChart = ({ locations }) => {
  // Group locations by country
  const locationCounts = locations.reduce((acc, loc) => {
    const key = `${loc.country}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const colors = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'
  ];

  const data = {
    labels: Object.keys(locationCounts),
    datasets: [{
      data: Object.values(locationCounts),
      backgroundColor: colors,
      borderColor: colors.map(color => `${color}33`),
      borderWidth: 2,
      hoverOffset: 4
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: 500
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} visits (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm p-4"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Visitor Distribution</h3>
      <div className="h-[400px] w-full relative">
        <Doughnut data={data} options={options} />
        {Object.keys(locationCounts).length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">No visitor data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LocationChart;
