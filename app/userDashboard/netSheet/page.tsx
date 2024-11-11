import { Spreadsheet } from '@/components/ui/spreadsheet';

export default function NetSheet() {
  return (
    <div className="p-4">
      <Spreadsheet
        initialRows={15}
        initialColumns={10}
        className="bg-white rounded-lg shadow-lg"
      />
    </div>
  );
}
