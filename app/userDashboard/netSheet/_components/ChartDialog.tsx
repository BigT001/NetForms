import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChartDialog: React.FC<ChartDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Chart</DialogTitle>
          <DialogDescription>
            Select the data range and chart type to create a chart.
          </DialogDescription>
        </DialogHeader>
        {/* Add chart creation form here */}
      </DialogContent>
    </Dialog>
  );
};

export default ChartDialog;