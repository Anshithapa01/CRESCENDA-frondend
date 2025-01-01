import React from 'react';
import Alert from '@mui/material/Alert';

export default function ActionAlerts({ type, onClose }) {
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-1/2">
      {/* Add a top margin to ensure the alert doesn't overlap the navbar */}
      {type === 'success' && (
        <Alert severity="success" onClose={onClose} className="w-full">
          Course added successfully!
        </Alert>
      )}
      {type === 'error' && (
        <Alert severity="error" onClose={onClose} className="w-full">
          Failed to add course.
        </Alert>
      )}
    </div>
  );
}
