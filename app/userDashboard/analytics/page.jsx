"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { db } from '@/configs';
import { jsonForms, formSubmissions } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import { ChevronDownIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

const Bar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), { ssr: false });
const Pie = dynamic(() => import('react-chartjs-2').then(mod => mod.Pie), { ssr: false });
const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false });

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
  const router = useRouter();
  const { user } = useUser();
  const [formList, setFormList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [analytics, setAnalytics] = useState({
    visits: 0,
    filled: 0,
    conversionRate: 0,
    locations: [],
    locationStats: {
      labels: [],
      data: []
    },
    trends: {
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

      // Calculate submission trends
      const submissionsByDate = submissions.reduce((acc, submission) => {
        const date = new Date(submission.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
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
        },
        trends: {
          labels: Object.keys(submissionsByDate),
          data: Object.values(submissionsByDate)
        }
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-md sm:text-xl lg:text-md font-bold text-gray-800">
              Analytics Dashboard
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Mobile/Tablet Form Selector */}
          <div className="lg:hidden w-full">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
              >
                <span className="font-medium">
                  {selectedForm ? extractFormTitle(selectedForm.jsonform) : 'Select a form'}
                </span>
                <ChevronDownIcon className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg max-h-[60vh] overflow-y-auto">
                  {formList.map(form => (
                    <div
                      key={form.id}
                      onClick={() => {
                        handleFormSelect(form);
                        setIsDropdownOpen(false);
                      }}
                      className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    >
                      <h3 className="font-medium text-sm sm:text-base text-gray-800">
                        {extractFormTitle(form.jsonform)}
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-3 bg-white rounded-lg shadow-sm h-auto lg:h-[calc(100vh-200px)] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Your Forms</h2>
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
                    className={` sm:p-4 rounded-lg cursor-pointer transition-all ${
                      selectedForm?.id === form.id
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : 'border border-gray-200 hover:border-primary hover:bg-gray-50'
                    }`}
                  >
                    <h3 className="font-medium text-sm text-gray-800">
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

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-4 sm:space-y-6">
            {selectedForm ? (
              <>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {extractFormTitle(selectedForm.jsonform)}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Total Views</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">{analytics.visits}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Forms Filled</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">{analytics.filled}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                    <h3 className="text-gray-500 text-sm font-medium">Conversion Rate</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">{analytics.conversionRate}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-medium mb-4">Submission Trends</h3>
                    <div className="h-[250px] sm:h-[300px]">
                      <Line
                        data={{
                          labels: analytics.trends.labels,
                          datasets: [{
                            label: 'Submissions',
                            data: analytics.trends.data,
                            borderColor: '#0066ff',
                            tension: 0.4
                          }]
                        }}
                        options={chartOptions}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-medium mb-4">Completion Rate</h3>
                    <div className="h-[250px] sm:h-[300px]">
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

                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 col-span-1 sm:col-span-2">
                    <h3 className="text-base sm:text-lg font-medium mb-4">Submissions by Location</h3>
                    <div className="h-[250px] sm:h-[300px]">
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
              <div className="flex items-center justify-center h-full min-h-[400px]">
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
