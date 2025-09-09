"use client";

import { useContext } from 'react';
import { DataProvider, DataContext } from '@/context/data-context';
import AppHeader from '@/components/app-header';
import MapView from '@/components/map-view';
import ControlsPanel from '@/components/controls-panel';
import StatsDisplay from '@/components/stats-display';
import ChartsDisplay from '@/components/charts-display';
import Welcome from '@/components/welcome';

function ElectoralLensApp() {
  const { geoData, tabularData } = useContext(DataContext);
  const hasData = !!(geoData || tabularData);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        {!hasData ? (
          <Welcome />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 min-h-[60vh] lg:h-auto rounded-lg overflow-hidden shadow-md border">
              <MapView />
            </div>
            <div className="flex flex-col gap-6">
              <ControlsPanel />
              <StatsDisplay />
              <ChartsDisplay />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <DataProvider>
      <ElectoralLensApp />
    </DataProvider>
  );
}
