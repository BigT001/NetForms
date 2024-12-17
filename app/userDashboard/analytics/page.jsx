'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { db } from '@/configs';
import { jsonForms, formSubmissions } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';

const Bar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), { ssr: false });
const Pie = dynamic(() => import('react-chartjs-2').then(mod => mod.Pie), { ssr: false });

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const extractFormTitle = (jsonform) => {
  try {
    const formData = JSON.parse(jsonform);
    return formData.response[0].formTitle || "Untitled Form";
  } catch (error) {
    console.log("Form parsing error:", error);
    return "Untitled Form";
  }
};

const Dashboard = () => {
  const { user } = useUser();
  const [formList, setFormList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [analytics, setAnalytics] = useState({
    visits: 0,
    filled: 0,
    conversionRate: 0,
    locations: [],
    locationStats: {
      labels: [],
      data: []
    }
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  useEffect(() => {
    if (user) {
      GetFormList();
    }
  }, [user]);

  const GetFormList = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const result = await db
        .select({
          id: jsonForms.id,
          jsonform: jsonForms.jsonform,
          createdBy: jsonForms.createdBy
        })
        .from(jsonForms)
        .where(eq(jsonForms.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(jsonForms.createdAt));

      setFormList(result);
    } catch (error) {
      console.error("Error fetching form list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSelect = async (form) => {
    setSelectedForm(form);
    try {
      const submissions = await db
        .select()
        .from(formSubmissions)
        .where(eq(formSubmissions.formId, form.id));

      const locationData = submissions.reduce((acc, submission) => {
        if (submission.location) {
          const [country, state] = submission.location.split(',').map(s => s.trim());
          const key = `${country}, ${state}`;
          acc[key] = (acc[key] || 0) + 1;
        }
        return acc;
      }, {});

      const sortedLocations = Object.entries(locationData)
        .sort(([, a], [, b]) => b - a)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      setAnalytics({
        visits: submissions.length,
        filled: submissions.length,
        conversionRate: '100',
        locations: Object.entries(sortedLocations).map(([location, count]) => ({
          location,
          count
        })),
        locationStats: {
          labels: Object.keys(sortedLocations),
          data: Object.values(sortedLocations)
        }
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const LocationStats = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4">Location Statistics</h3>
      <div className="h-[300px]">
        <Bar
          data={{
            labels: analytics.locationStats?.labels || [],
            datasets: [{
              label: 'Submissions by Location',
              data: analytics.locationStats?.data || [],
              backgroundColor: '#0066ff'
            }]
          }}
          options={{
            ...chartOptions,
            indexAxis: 'y',
            plugins: {
              ...chartOptions.plugins,
              title: {
                display: true,
                text: 'Submissions by Location'
              }
            }
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 bg-white rounded-lg shadow-sm p-6 h-[calc(100vh-200px)] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Your Forms</h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : formList.length > 0 ? (
              <div className="space-y-3">
                {formList.map(form => (
                  <div
                    key={form.id}
                    onClick={() => handleFormSelect(form)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedForm?.id === form.id
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : 'border border-gray-200 hover:border-primary hover:bg-gray-50'
                    }`}
                  >
                    <h3 className="font-medium text-gray-800">
                      {extractFormTitle(form.jsonform)}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No forms created yet</p>
              </div>
            )}
          </div>

          <div className="col-span-9 space-y-6">
            {selectedForm ? (
              <>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {extractFormTitle(selectedForm.jsonform)}
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Total Views</h3>
                    <p className="text-3xl font-bold text-primary mt-2">{analytics.visits}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Forms Filled</h3>
                    <p className="text-3xl font-bold text-primary mt-2">{analytics.filled}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Conversion Rate</h3>
                    <p className="text-3xl font-bold text-primary mt-2">{analytics.conversionRate}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <LocationStats />
                  
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium mb-4">Completion Rate</h3>
                    <div className="h-[300px]">
                      <Pie
                        data={{
                          labels: ['Completed'],
                          datasets: [{
                            data: [analytics.filled],
                            backgroundColor: ['#0066ff']
                          }]
                        }}
                        options={chartOptions}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6 col-span-2">
                    <h3 className="text-lg font-medium mb-4">Submissions by Location</h3>
                    <div className="h-[300px]">
                      <Bar
                        data={{
                          labels: analytics.locations.map(l => l.location),
                          datasets: [{
                            label: 'Submissions',
                            data: analytics.locations.map(l => l.count),
                            backgroundColor: '#0066ff'
                          }]
                        }}
                        options={chartOptions}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select a form to view analytics</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
