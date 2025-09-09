"use client";

import { useContext, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { DataContext } from '@/context/data-context';
import { SlidersHorizontal } from 'lucide-react';

export default function ControlsPanel() {
  const { tabularData, geoData, setChoroplethMetric, setLayerOpacity, choroplethMetric, layerOpacity } = useContext(DataContext);
  const [availableMetrics, setAvailableMetrics] = useState<string[]>([]);
  const hasData = !!(tabularData || geoData);
  
  useEffect(() => {
    let keys: string[] = [];
    const data_source = tabularData || (geoData?.features?.map(f => f.properties).filter(p => p));
    
    if (data_source && data_source.length > 0) {
        keys = Object.keys(data_source[0] || {});
    }
    
    const numericKeys = keys.filter(key => {
        const firstValue = data_source?.[0]?.[key];
        return typeof firstValue === 'number' || (typeof firstValue === 'string' && !isNaN(parseFloat(firstValue)));
    });

    setAvailableMetrics(numericKeys);
    if(numericKeys.length > 0 && !choroplethMetric) {
        setChoroplethMetric(numericKeys[0]);
    }
  }, [tabularData, geoData, choroplethMetric, setChoroplethMetric]);


  if (!hasData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="text-accent" />
            Map Controls
        </CardTitle>
        <CardDescription>Customize the map visualization.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="metric-select">Choropleth Metric</Label>
          <Select value={choroplethMetric || ''} onValueChange={setChoroplethMetric}>
            <SelectTrigger id="metric-select">
              <SelectValue placeholder="Select a metric" />
            </SelectTrigger>
            <SelectContent>
                {availableMetrics.length > 0 ? (
                    availableMetrics.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))
                ) : (
                    <SelectItem value="none" disabled>No numeric metrics found</SelectItem>
                )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="opacity-slider">Layer Opacity</Label>
          <div className="flex items-center gap-4">
            <Slider
              id="opacity-slider"
              value={[layerOpacity]}
              onValueChange={(value) => setLayerOpacity(value[0])}
              max={1}
              step={0.1}
            />
            <span className="text-sm font-mono text-muted-foreground w-8">{layerOpacity.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
