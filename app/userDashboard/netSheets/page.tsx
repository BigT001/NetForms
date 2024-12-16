'use client'

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from "@/configs";
import { formSubmissions, jsonForms } from "@/configs/schema";
import { eq } from "drizzle-orm";
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';

const ResponseSpreadsheet = dynamic(() => import('./_components/ResponseSpreadsheet'), { ssr: false });

interface FormResponse {
    [key: string]: any;
}

interface FormData {
    formTitle: string;
    formSubheading: string;
}

const NetSheet = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const formId = searchParams.get('formId');
    const [responses, setResponses] = useState<FormResponse[]>([]);
    const [formData, setFormData] = useState<FormData>({ formTitle: '', formSubheading: '' });

    useEffect(() => {
        if (formId) {
            fetchFormAndResponses();
        }
    }, [formId]);

    const fetchFormAndResponses = async () => {
        try {
            if (typeof formId === 'string') {
                const [formResult, responsesResult] = await Promise.all([
                    db.select()
                      .from(jsonForms)
                      .where(eq(jsonForms.id, parseInt(formId, 10))),
                    db.select()
                      .from(formSubmissions)
                      .where(eq(formSubmissions.formId, parseInt(formId, 10)))
                ]);

                if (formResult.length > 0) {
                    const formData = JSON.parse(formResult[0].jsonform);
                    setFormData({
                        formTitle: formData.response[0].formTitle,
                        formSubheading: formData.response[0].formSubheading
                    });
                }

                if (responsesResult.length > 0) {
                    setResponses(responsesResult.map(submission => submission.data as FormResponse));
                }
            }
        } catch (error) {
            console.error("Error fetching form and responses:", error);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] relative bg-white">
            <div className="absolute inset-0">
                <div className="sticky top-0 z-10 bg-white p-4 md:hidden">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                </div>
                <div className="relative h-full sheet-scroll">
                    {formId && (
                        <ResponseSpreadsheet
                            responses={responses}
                            formTitle={formData.formTitle}
                            formSubheading={formData.formSubheading}
                            formId={formId}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default NetSheet;

