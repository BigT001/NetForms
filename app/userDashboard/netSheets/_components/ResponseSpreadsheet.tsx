import React from 'react';

interface ResponseSpreadsheetProps {
  responses: any[];
  formTitle: string;
  formSubheading: string;
}

const ResponseSpreadsheet = ({ responses, formTitle, formSubheading }: ResponseSpreadsheetProps) => {
  if (!responses.length) return <div>No responses yet</div>;

  const headers = Object.keys(responses[0]);

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{formTitle}</h1>
        <p className="text-gray-600">{formSubheading}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header) => (
                <th key={header} className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((response, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {headers.map((header) => (
                  <td key={`${index}-${header}`} className="px-6 py-4 border-b text-sm text-gray-500">
                    {JSON.stringify(response[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponseSpreadsheet;
