import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20" role="status" aria-label="Loading">
      <div className="w-8 h-8 border-4 border-zinc-700 border-t-amber-400 rounded-full animate-spin" />
    </div>
  );
}

export default LoadingSpinner;
