import React from 'react';
import Header from 'components/Header';
import ErrorBoundary from 'components/ErrorBoundary';

interface PageLayoutProps {
  title?: string;
  children: React.ReactNode;
}

function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full overflow-x-auto">
        {title && <h2 className="text-xl font-semibold text-zinc-100 mb-5">{title}</h2>}
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}

export default PageLayout;
