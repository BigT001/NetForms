'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from "@/configs";
import { formSubmissions } from "@/configs/schema";
import { eq } from "drizzle-orm";
import ResponseSpreadsheet from './_components/ResponseSpreadsheet';

interface FormResponse {
  formTitle?: string;
  formSubheading?: string;
  [key: string]: any;
}

const NetSheet = () => {
    const searchParams = useSearchParams();
    const formId = searchParams.get('formId');
    const [responses, setResponses] = useState<FormResponse[]>([]);
    const [formTitle, setFormTitle] = useState('');
    const [formSubheading, setFormSubheading] = useState('');

    useEffect(() => {
        if (formId) {
            fetchResponses();
        }
    }, [formId]);

    const fetchResponses = async () => {
        try {
            if (typeof formId === 'string') {
                const result = await db
                    .select()
                    .from(formSubmissions)
                    .where(eq(formSubmissions.formId, parseInt(formId, 10)));

                if (result.length > 0) {
                    setResponses(result.map(submission => submission.data as FormResponse));
                    setFormTitle((result[0].data as FormResponse)?.formTitle || 'Form Responses');
                    setFormSubheading((result[0].data as FormResponse)?.formSubheading || '');
                }
            }
        } catch (error) {
            console.error("Error fetching responses:", error);
        }
    };

    return (
        <div className="container mx-auto">
            <ResponseSpreadsheet
                responses={responses}
                formTitle={formTitle}
                formSubheading={formSubheading}
            />
        </div>
    );
};

export default NetSheet;
