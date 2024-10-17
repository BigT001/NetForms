"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { db } from '@/configs'
import { jsonForms } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import FormUi from '@/app/edit-form/_components/FormUi'
import { toast } from 'react-hot-toast'

function LiveNetForm({ params }) {
  const [record, setRecord] = useState(null)
  const [jsonForm, setJsonForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (params?.formid) {
      getFormData()
    }
  }, [params?.formid])

  const getFormData = async () => {
    setLoading(true)
    setError(null)
    try {
      const formId = Number(params.formid)
      if (!Number.isInteger(formId) || formId <= 0) {
        throw new Error('Invalid form ID')
      }

      const result = await db
        .select()
        .from(jsonForms)
        .where(eq(jsonForms.id, formId))

      if (result.length === 0) {
        throw new Error('Form not found')
      }

      setRecord(result[0])
      setJsonForm(JSON.parse(result[0].jsonform))
    } catch (err) {
      console.error('Error fetching form data:', err)
      setError(err.message)
      toast.error(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div 
      className="flex justify-center items-center p-5 px-10 lg:px-80 md:px-60 min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: record?.background ? `url(${record.background})` : 'none',
      }}
    >
      <div className="w-full max-w-4xl">
        {jsonForm && (
          <FormUi
            formId={Number(params.formid)}
            jsonForm={jsonForm}
            onFieldUpdate={() => console.log('Field updated')}
            onFieldDelete={() => console.log('Field deleted')}
            selectedTheme={record?.theme || 'light'}
            editable={false}
            background={record?.background}
          />
        )}
      </div>

      <div className="flex items-center fixed bottom-5 left-5">
        <Image
          src="/logo.png"
          width={120}
          height={120}
          alt="Logo"
          priority
        />
      </div>
    </div>
  )
}

export default LiveNetForm