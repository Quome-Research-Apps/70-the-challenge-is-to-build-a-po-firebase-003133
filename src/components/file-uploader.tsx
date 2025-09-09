"use client";

import { ChangeEvent, useContext, useRef, ReactNode } from 'react';
import Papa from 'papaparse';
import { DataContext, TabularData, Statistics } from '@/context/data-context';
import { useToast } from '@/hooks/use-toast';
import { generateDescriptiveStatistics } from '@/ai/flows/generate-descriptive-statistics';
import type { FeatureCollection } from 'geojson';

export default function FileUploader({ children }: { children: ReactNode }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setGeoData, setTabularData, setStatistics, setIsLoading, setError, setFileName } = useContext(DataContext);
  const { toast } = useToast();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);
    setError(null);
    setGeoData(null);
    setTabularData(null);
    setStatistics(null);

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
          const jsonData = JSON.parse(content) as FeatureCollection;
          if (jsonData.type === 'FeatureCollection' && Array.isArray(jsonData.features)) {
            setGeoData(jsonData);
            if (jsonData.features.length > 0) {
              const tabular = jsonData.features.map(f => f.properties).filter(p => p) as TabularData[];
              if (tabular.length > 0) {
                setTabularData(tabular);
                const csvFromGeoJson = Papa.unparse(tabular);
                const stats = await generateDescriptiveStatistics({ electionData: csvFromGeoJson });
                setStatistics(JSON.parse(stats.statistics) as Statistics);
              }
            }
          } else {
            throw new Error('Invalid GeoJSON file. Must be a FeatureCollection.');
          }
        } else if (file.name.endsWith('.csv')) {
          Papa.parse<TabularData>(content, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: async (results) => {
              if (results.errors.length) {
                throw new Error(`CSV parsing error: ${results.errors[0].message}`);
              }
              setTabularData(results.data);
              const stats = await generateDescriptiveStatistics({ electionData: content });
              setStatistics(JSON.parse(stats.statistics) as Statistics);
            },
            error: (err) => {
              throw err;
            }
          });
        } else {
          throw new Error('Unsupported file type. Please upload a CSV or GeoJSON file.');
        }
      } catch (err: any) {
        const errorMessage = err.message || 'An unknown error occurred during file processing.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'File Error',
          description: errorMessage,
        });
        setGeoData(null);
        setTabularData(null);
        setStatistics(null);
        setFileName(null);
      } finally {
        setIsLoading(false);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    };

    reader.onerror = () => {
        const errorMessage = 'Failed to read file.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'File Error',
          description: errorMessage,
        });
        setIsLoading(false);
    }

    reader.readAsText(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".csv,.json,.geojson"
      />
    </>
  );
}
