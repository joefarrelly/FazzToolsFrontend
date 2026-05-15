import React from 'react';

function CollapsePanel({ open, children }) {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${
        open ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      {children}
    </div>
  );
}

export default CollapsePanel;
