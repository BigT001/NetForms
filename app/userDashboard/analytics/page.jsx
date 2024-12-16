'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { db } from '@/configs';
import { jsonForms, formSubmissions } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';

const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false });
const Pie = dynamic(() => import('react-chartjs-2').then(mod => mod.Pie), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), { ssr: false });

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
    clicks: 0,
    filled: 0,
    notFilled: 0,
    locations: [],
    trends: {
      labels: [],
      data: []
    }
  });

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

      const submissionsByDate = submissions.reduce((acc, submission) => {
        const date = new Date(submission.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const submissionsByLocation = submissions.reduce((acc, submission) => {
        const location = submission.location || 'Unknown';
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {});

      setAnalytics({
        clicks: submissions.length,
        filled: submissions.length,
        notFilled: 0,
        locations: Object.entries(submissionsByLocation).map(([country, count]) => ({
          country,
          count
        })),
        trends: {
          labels: Object.keys(submissionsByDate),
          data: Object.values(submissionsByDate)
        }
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Form Analytics Dashboard</h1>
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
                    <p className="text-3xl font-bold text-primary mt-2">{analytics.clicks}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Forms Filled</h3>
                    <p className="text-3xl font-bold text-primary mt-2">{analytics.filled}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-gray-500 text-sm font-medium">Conversion Rate</h3>
                    <p className="text-3xl font-bold text-primary mt-2">100%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium mb-4">Submission Trends</h3>
                    <div className="h-[300px]">
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
                          labels: analytics.locations.map(l => l.country),
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
