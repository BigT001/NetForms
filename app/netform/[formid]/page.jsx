"use client"

import FormUi from '@/app/edit-form/_components/FormUi'
import { db } from '@/configs'
import { jsonForms } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function LiveNetForm({params}) {

    const [record, setRecord]=useState();
    const [jsonForm, setJsonForm]=useState([]);

    useEffect(()=>{
        params&&GetFormData()
    },[params])

    const GetFormData=async()=>{
        const result=await db.select().from(jsonForms)
        .where(eq(jsonForms.id,Number(params?.formid)))

        setRecord(result[0]);
        setJsonForm(JSON.parse(result[0].jsonform));
        console.log(result)
    }
  return (
    <div className='flex justify-center items-center p-5 px-10 lg:px-80 md:px-60'
    style={{
        backgroundImage:record?.background
    }}
    >
      
      <FormUi
      jsonForm={jsonForm}
      onFieldUpdate={()=>console.log}
      onDelete={()=>console.log}
      selectedTheme={record?.theme}
      editable={false}
      />

      <div className='flex items-center fixed bottom-5 left-5'>
        
        <Image src={"/logo.png"} width={120} height={120}/>
        
      </div>
    </div>
  )
}

export default LiveNetForm
