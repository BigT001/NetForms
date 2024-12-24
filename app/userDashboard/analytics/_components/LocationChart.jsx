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
  // Group locations by country and state
  const locationStats = locations.reduce((acc, loc) => {
    const key = `${loc.state}, ${loc.country}`;
    if (!acc[key]) {
      acc[key] = {
        count: 0,
        details: {
          state: loc.state,
          country: loc.country,
          cities: new Set(),
          visits: [],
        }
      };
    }
    acc[key].count++;
    acc[key].details.cities.add(loc.city);
    acc[key].details.visits.push({
      time: loc.visitTime,
      date: loc.visitDate,
      timezone: loc.timezone,
      isp: loc.isp
    });
    return acc;
  }, {});

  const colors = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'
  ];

  const data = {
    labels: Object.keys(locationStats),
    datasets: [{
      data: Object.values(locationStats).map(stat => stat.count),
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
          font: { size: 12, weight: 500 },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        callbacks: {
          label: function(context) {
            const locationKey = context.label;
            const stats = locationStats[locationKey];
            const percentage = ((context.raw / locations.length) * 100).toFixed(1);
            return [
              `Total Visits: ${context.raw}`,
              `Percentage: ${percentage}%`,
              `Cities: ${Array.from(stats.details.cities).join(', ')}`,
              `Latest Visit: ${stats.details.visits[stats.details.visits.length - 1].date}`
            ];
          }
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Visitor Distribution</h3>
      <div className="h-[400px] w-full relative">
        <Doughnut data={data} options={options} />
        {locations.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">No visitor data available</p>
          </div>
        )}
      </div>
      
      {/* Detailed Statistics Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visits</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cities</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Visit</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(locationStats).map(([key, stats], index) => (
              <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{key}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Array.from(stats.details.cities).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats.details.visits[stats.details.visits.length - 1].date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default LocationChart;
