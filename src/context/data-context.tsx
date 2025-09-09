"use client";

import type { FC, ReactNode } from 'react';
import { createContext, useState, useMemo } from 'react';
import type { FeatureCollection } from 'geojson';

export interface TabularData {
  [key: string]: string | number;
}

export interface Statistics {
  [key: string]: {
    mean?: number;
    median?: number;
    mode?: number | string;
    stdDev?: number;
    min?: number;
    max?: number;
  };
}

interface DataContextType {
  geoData: FeatureCollection | null;
  setGeoData: (data: FeatureCollection | null) => void;
  tabularData: TabularData[] | null;
  setTabularData: (data: TabularData[] | null) => void;
  statistics: Statistics | null;
  setStatistics: (stats: Statistics | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  fileName: string | null;
  setFileName: (name: string | null) => void;
  choroplethMetric: string | null;
  setChoroplethMetric: (metric: string | null) => void;
  layerOpacity: number;
  setLayerOpacity: (opacity: number) => void;
}

export const DataContext = createContext<DataContextType>({
  geoData: null,
  setGeoData: () => {},
  tabularData: null,
  setTabularData: () => {},
  statistics: null,
  setStatistics: () => {},
  isLoading: false,
  setIsLoading: () => {},
  error: null,
  setError: () => {},
  fileName: null,
  setFileName: () => {},
  choroplethMetric: null,
  setChoroplethMetric: () => {},
  layerOpacity: 0.6,
  setLayerOpacity: () => {},
});

export const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [tabularData, setTabularData] = useState<TabularData[] | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [choroplethMetric, setChoroplethMetric] = useState<string | null>(null);
  const [layerOpacity, setLayerOpacity] = useState<number>(0.7);

  const value = useMemo(
    () => ({
      geoData,
      setGeoData,
      tabularData,
      setTabularData,
      statistics,
      setStatistics,
      isLoading,
      setIsLoading,
      error,
      setError,
      fileName,
      setFileName,
      choroplethMetric,
      setChoroplethMetric,
      layerOpacity,
      setLayerOpacity,
    }),
    [geoData, tabularData, statistics, isLoading, error, fileName, choroplethMetric, layerOpacity]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
