'use client'

import { db } from '@/configs'
import { jsonForms } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import FormCard from './_components/FormCard'

export default function FormList() {
  const { user } = useUser()
  const [formList, setFormList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      GetFormList()
    }
  }, [user])

  const handleFormDelete = async (deletedFormId) => {
    try {
      // Attempt to delete from the database
      await db.delete(jsonForms).where(eq(jsonForms.id, deletedFormId))
      // If deletion is successful, update the state
      setFormList(prevList => prevList.filter(form => form.id !== deletedFormId))
    } catch (error) {
      console.error("Error deleting form:", error)
      // If there's an error, refresh the form list
      GetFormList()
    }
  }

  const GetFormList = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const result = await db
        .select()
        .from(jsonForms)
        .where(eq(jsonForms.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(jsonForms.createdAt))
      setFormList(result)
    } catch (error) {
      console.error("Error fetching form list:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {isLoading ? (
        <p className="col-span-full text-center">Loading forms...</p>
      ) : formList.length > 0 ? (
        formList.map((form) => (
          <FormCard 
            key={form.id} 
            form={form} 
            user={user} 
            onDelete={handleFormDelete} 
            className="w-full"
          />
        ))
      ) : (
        <p className="col-span-full text-center">No forms found</p>
      )}
    </div>
  )
}