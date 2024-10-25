import { Button } from '@/components/ui/button'
import { db } from '@/configs';
import { formSubmissions } from '@/configs/schema';
import { eq, sql } from 'drizzle-orm';
import { Loader2, Download, ExternalLink } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { parse } from 'csv-parse/sync';

function FormListItemsResponse({ jsonForm, formRecord }) {
  const [loading, setLoading] = useState(false);
  const [responseCount, setResponseCount] = useState(0);

  useEffect(() => {
    getResponseCount();
    loadGoogleIdentityServices();
  }, [formRecord.id]);

  const loadGoogleIdentityServices = () => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  };

  const getResponseCount = async () => {
    try {
      const result = await db.select({ count: sql`count(*)` })
        .from(formSubmissions)
        .where(eq(formSubmissions.formId, formRecord.id));
      setResponseCount(Number(result[0].count));
    } catch (error) {
      console.error("Error fetching response count:", error);
      setResponseCount(0);
    }
  };

  const fetchUserResponses = async () => {
    const result = await db.select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, formRecord.id));
    return result.map(submission => submission.data);
  };

  const downloadCSV = async () => {
    setLoading(true);
    try {
      const userResponses = await fetchUserResponses();
      const csv = generateCSV(userResponses);
      const data = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = URL.createObjectURL(data);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = `${jsonForm.response[0].formTitle}_responses.csv`;
      downloadLink.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateCSV = (data) => {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))
    ];
    return csvRows.join('\r\n');
  };

  const viewInGoogleSheets = async () => {
    if (window.confirm("View in Google Sheets? This will save the data to your Google Drive.")) {
      try {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
          callback: async (response) => {
            if (response.error !== undefined) {
              throw response;
            }
            const userResponses = await fetchUserResponses();
            const csv = generateCSV(userResponses);
            await createGoogleSheet(csv, response.access_token);
          },
        });
        tokenClient.requestAccessToken();
      } catch (error) {
        console.error("Error preparing data for Google Sheets:", error);
      }
    }
  };

  const createGoogleSheet = async (csv, accessToken) => {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    const [sheetResponse, fileUploadResponse] = await Promise.all([
      fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          properties: { title: `${jsonForm.response[0].formTitle}_responses` }
        })
      }),
      fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({'Authorization': `Bearer ${accessToken}`}),
        body: createMultipartBody(csv, jsonForm.response[0].formTitle)
      })
    ]);

    const sheetData = await sheetResponse.json();
    const sheetId = sheetData.spreadsheetId;

    const parsedCsv = parse(csv, { columns: true });
    const csvHeaders = Object.keys(parsedCsv[0]);
    const values = [csvHeaders, ...parsedCsv.map(Object.values)];

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1:append?valueInputOption=RAW`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ values })
    });

    window.open(`https://docs.google.com/spreadsheets/d/${sheetId}`, '_blank');
  };

  const createMultipartBody = (csv, title) => {
    const boundary = 'foo_bar_baz';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const metadata = {
      name: `${title}_responses.csv`,
      mimeType: 'text/csv'
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: text/csv\r\n\r\n' +
      csv +
      close_delim;

    return multipartRequestBody;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 my-4">
    <div className="min-h-[100px]"> {/* Adjust min-height as needed */}
      <h2 className="text-md font-semibold mb-2">{jsonForm.response[0].formTitle}</h2>
      <h2 className="text-sm mb-2">{jsonForm.response[0].formSubheading}</h2>
    </div>
  
    <hr className="border-t border-gray-200" />
  
    <div className="flex justify-between items-center mt-4">
      <h2 className='text-sm'>
        <strong>{responseCount}</strong> {responseCount === 1 ? 'Response' : 'Responses'}
      </h2>
  
      <div className="space-x-2">
        <Button
          size="sm"
          onClick={downloadCSV}
          disabled={loading}
          className="bg-slate-white border border-black text-black hover:bg-transparent hover:border-b-2 font-semi-bold"
        >
          {loading ? <Loader2 className='animate-spin'/> : <><Download className="w-4 h-4 mr-2" /></>}
        </Button>
        <Button
          size="sm"
          onClick={viewInGoogleSheets}
          className="bg-slate-white border border-black text-black hover:bg-transparent hover:border-b-2 font-semi-bold"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Sheet
        </Button>
      </div>
    </div>
  </div>
  

  )
}

export default FormListItemsResponse
