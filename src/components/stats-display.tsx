"use client";

import { useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DataContext } from '@/context/data-context';
import { ListTree } from 'lucide-react';

function Stat({ label, value }: { label: string; value: string | number | undefined }) {
  const formatValue = (val: any) => {
    if (val === undefined || val === null) return 'N/A';
    if (typeof val === 'number') {
        if (Number.isInteger(val)) return val.toLocaleString();
        return parseFloat(val.toFixed(2)).toLocaleString();
    }
    return val;
  }
  
  return (
    <div className="flex justify-between items-baseline">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-medium font-mono">{formatValue(value)}</p>
    </div>
  );
}

export default function StatsDisplay() {
  const { statistics, isLoading, tabularData, geoData } = useContext(DataContext);
  const hasData = !!(tabularData || geoData);

  if (!hasData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <ListTree className="text-accent" />
            Descriptive Statistics
        </CardTitle>
        <CardDescription>AI-generated summary of your data.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && !statistics ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
          </div>
        ) : statistics ? (
          <div className="space-y-4">
            {Object.entries(statistics).map(([key, value]) => (
              <div key={key} className="space-y-2 rounded-md border p-3">
                 <h4 className="font-semibold text-primary truncate">{key}</h4>
                 <div className="space-y-1">
                    <Stat label="Mean" value={value.mean} />
                    <Stat label="Median" value={value.median} />
                    <Stat label="Mode" value={value.mode} />
                    <Stat label="Std. Dev" value={value.stdDev} />
                    <Stat label="Min" value={value.min} />
                    <Stat label="Max" value={value.max} />
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No statistics available for this dataset.</p>
        )}
      </CardContent>
    </Card>
  );
}
