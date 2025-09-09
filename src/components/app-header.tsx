"use client";

import { FileUp, Landmark, Loader2 } from 'lucide-react';
import FileUploader from './file-uploader';
import { useContext } from 'react';
import { DataContext } from '@/context/data-context';
import { Button } from './ui/button';

export default function AppHeader() {
  const { fileName, isLoading, setGeoData, setTabularData, setStatistics, setFileName, setError } = useContext(DataContext);
  
  const handleClearData = () => {
    setGeoData(null);
    setTabularData(null);
    setStatistics(null);
    setFileName(null);
    setError(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Landmark className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold text-foreground font-headline">
            ElectoralLens
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : fileName ? (
             <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden md:inline truncate max-w-xs">
                  {fileName}
                </span>
                <Button variant="outline" size="sm" onClick={handleClearData}>
                    Upload New
                </Button>
            </div>
          ) : (
            <FileUploader>
              <Button>
                <FileUp className="mr-2 h-4 w-4" />
                Upload Data
              </Button>
            </FileUploader>
          )}
        </div>
      </div>
    </header>
  );
}
