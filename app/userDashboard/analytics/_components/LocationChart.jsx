"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, GlobeAltIcon, ClockIcon } from '@heroicons/react/24/outline';
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

const getLocationData = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (!data.city) {
      const ipstackResponse = await fetch(`https://api.ipstack.com/check?access_key=${process.env.NEXT_PUBLIC_IPSTACK_API_KEY}`);
      const ipstackData = await ipstackResponse.json();
      
      return {
        city: ipstackData.city,
        state: ipstackData.region_name,
        country: ipstackData.country_name,
        timezone: ipstackData.timezone,
        latitude: ipstackData.latitude,
        longitude: ipstackData.longitude
      };
    }

    return {
      city: data.city,
      state: data.region,
      country: data.country_name,
      timezone: data.timezone,
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.log('Location fetch error:', error);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      const data = await response.json();
      
      return {
        city: data.city,
        state: data.principalSubdivision,
        country: data.countryName,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        latitude,
        longitude
      };
    } catch (geoError) {
      return {
        city: 'Unknown',
        state: 'Unknown',
        country: 'Unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    }
  }
};

const LocationChart = ({ locations = [] }) => {
  const [selectedView, setSelectedView] = useState('chart');
  const [locationData, setLocationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processLocations = async () => {
      setIsLoading(true);
      const geoData = await getLocationData();
      
      const enrichedLocations = locations.length > 0 ? locations.map(loc => ({
        ...loc,
        ...geoData,
        visitTime: loc.visitTime || new Date().toLocaleTimeString(),
        visitDate: loc.visitDate || new Date().toLocaleDateString(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        count: 1
      })) : [{
        ...geoData,
        visitTime: new Date().toLocaleTimeString(),
        visitDate: new Date().toLocaleDateString(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        count: 1
      }];

      setLocationData(enrichedLocations);
      setIsLoading(false);
    };

    processLocations();
  }, [locations]);

  const locationStats = useMemo(() => {
    return locationData.reduce((acc, loc) => {
      const key = `${loc.city}, ${loc.country}`;
      if (!acc[key]) {
        acc[key] = {
          count: 0,
          details: {
            state: loc.state,
            country: loc.country,
            cities: new Set(),
            browsers: new Set(),
            devices: new Set(),
            visits: []
          }
        };
      }

      acc[key].count++;
      acc[key].details.cities.add(loc.city);
      acc[key].details.browsers.add(loc.userAgent?.split(' ')[0] || 'Unknown');
      acc[key].details.devices.add(loc.screenResolution || 'Unknown');
      acc[key].details.visits.push({
        time: loc.visitTime,
        date: loc.visitDate,
        timezone: loc.timezone
      });

      return acc;
    }, {});
  }, [locationData]);

  const chartData = useMemo(() => ({
    labels: Object.keys(locationStats),
    datasets: [{
      data: Object.values(locationStats).map(stat => stat.count),
      backgroundColor: [
        '#4F46E5', '#10B981', '#F59E0B',
        '#EF4444', '#8B5CF6', '#EC4899'
      ],
      borderColor: [
        '#818CF8', '#34D399', '#FBBF24',
        '#F87171', '#A78BFA', '#F472B6'
      ],
      borderWidth: 2,
      hoverOffset: 8
    }]
  }), [locationStats]);

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
            const percentage = ((context.raw / locationData.length) * 100).toFixed(1);
            return [
              `📍 Location: ${locationKey}`,
              `👥 Visits: ${context.raw} (${percentage}%)`,
              `🌆 Cities: ${Array.from(stats.details.cities).join(', ')}`,
              `🕒 Latest: ${stats.details.visits[stats.details.visits.length - 1].date}`
            ];
          }
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedView}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Visitor Analytics</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedView('chart')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedView === 'chart'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Chart View
            </button>
            <button
              onClick={() => setSelectedView('table')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedView === 'table'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Table View
            </button>
          </div>
        </div>

        {selectedView === 'chart' ? (
          <div className="h-[400px] relative">
            <Doughnut data={chartData} options={options} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Latest Activity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(locationStats).map(([key, stats], index) => (
                  <tr
                    key={key}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-primary mr-2" />
                        <span className="text-sm font-medium text-gray-900">{key}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {stats.count} visits
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <GlobeAltIcon className="h-4 w-4" />
                          {Array.from(stats.details.cities).join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4" />
                          {stats.details.visits[stats.details.visits.length - 1].date}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {locationData.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-gray-500">No visitor data available</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default LocationChart;
