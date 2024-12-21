"use client";

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LocationChart = ({ locations }) => {
  const data = {
    labels: locations.map(loc => `${loc.city}, ${loc.country}`),
    datasets: [{
      label: 'Visits by Location',
      data: locations.map(loc => loc.visits),
      backgroundColor: '#4F46E5',
      borderRadius: 8,
      barThickness: 20,
      maxBarThickness: 30
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: '#6B7280'
        },
        grid: {
          color: '#E5E7EB'
        }
      },
      x: {
        ticks: {
          color: '#6B7280'
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm p-4"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Visitor Locations</h3>
      <div className="h-[400px] w-full">
        <Bar data={data} options={options} />
      </div>
    </motion.div>
  );
};

export default LocationChart;
