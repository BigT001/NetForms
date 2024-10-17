"use client"

import { db } from '@/configs';
import { jsonForms } from '@/configs/schema'
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import FormListItemsResponse from "./_components/FormListItemsResponse"

function Responses() {
  const { user } = useUser();
  const [formList, setFormList] = useState([]);

  useEffect(() => {
    if (user) {
      getFormList();
    }
  }, [user])

  const getFormList = async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const result = await db.select().from(jsonForms)
        .where(eq(jsonForms.createdBy, user.primaryEmailAddress.emailAddress));
      setFormList(result);
      console.log(result);
    }
  }

  return (
    <div className='p-10'>
      <h2 className="font-bold text-2xl flex items-center justify-between">
        Responses
      </h2>

      <div className='grid grid-cols-2 lg:grid-cols-3 gap-5'>
        {formList && formList.map((form, index) => (
          <FormListItemsResponse
            key={form.id}
            formRecord={form}
            jsonForm={JSON.parse(form.jsonform)}
          />
        ))}
      </div>
    </div>
  )
}

export default Responses
