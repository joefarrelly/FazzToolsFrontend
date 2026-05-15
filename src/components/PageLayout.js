import React from 'react';
import Header from 'components/Header';
import MenuBar from 'components/MenuBar';

function PageLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="w-44 bg-zinc-900 border-r border-zinc-800 sticky top-0 h-screen overflow-y-auto shrink-0">
          <MenuBar />
        </aside>
        <main className="flex-1 p-6 overflow-x-auto min-w-0">
          {title && (
            <h2 className="text-xl font-semibold text-zinc-100 mb-5">{title}</h2>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

export default PageLayout;
