"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChartComponent, LineChartComponent } from "@/components/ui/chart"
import { MapPin, Users, FileText } from "lucide-react"

// Mock data (replace with real data fetching in production)
const visitorData = [
  { name: "Mon", total: 200 },
  { name: "Tue", total: 250 },
  { name: "Wed", total: 300 },
  { name: "Thu", total: 280 },
  { name: "Fri", total: 320 },
  { name: "Sat", total: 400 },
  { name: "Sun", total: 350 },
]

const formUsageData = [
  { name: "Form A", total: 150 },
  { name: "Form B", total: 200 },
  { name: "Form C", total: 100 },
  { name: "Form D", total: 75 },
]

const locationData = [
  { id: 1, country: "USA", users: 1000 },
  { id: 2, country: "UK", users: 650 },
  { id: 3, country: "Canada", users: 400 },
  { id: 4, country: "Australia", users: 300 },
  { id: 5, country: "Germany", users: 250 },
]

function AdminDashboard() {
  const { isLoaded, userId, sessionId, getToken } = useAuth()
  const [totalVisitors, setTotalVisitors] = useState(0)
  const [totalFormSubmissions, setTotalFormSubmissions] = useState(0)

  useEffect(() => {
    // Calculate totals (replace with real data fetching in production)
    setTotalVisitors(visitorData.reduce((sum, day) => sum + day.total, 0))
    setTotalFormSubmissions(formUsageData.reduce((sum, form) => sum + form.total, 0))
  }, [])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Form Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFormSubmissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locationData[0].country}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="forms">Form Usage</TabsTrigger>
          <TabsTrigger value="locations">User Locations</TabsTrigger>
        </TabsList>
        <TabsContent value="visitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Visitors</CardTitle>
              <CardDescription>
                Number of visitors per day over the last week
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <LineChartComponent
                data={visitorData}
                index="name"
                categories={["total"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value} visitors`}
                className="aspect-[4/3]"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Usage</CardTitle>
              <CardDescription>
                Number of submissions per form
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <BarChartComponent
                data={formUsageData}
                index="name"
                categories={["total"]}
                colors={["teal"]}
                valueFormatter={(value) => `${value} submissions`}
                className="aspect-[4/3]"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Locations</CardTitle>
              <CardDescription>
                Top 5 countries by number of users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {locationData.map((location) => (
                  <li key={location.id} className="flex justify-between items-center">
                    <span>{location.country}</span>
                    <span className="font-semibold">{location.users} users</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard
