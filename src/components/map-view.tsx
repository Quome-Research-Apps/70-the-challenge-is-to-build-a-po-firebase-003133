"use client";

import { useContext, useEffect, useMemo } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { DataContext } from '@/context/data-context';

const MAP_ID = 'electoral_lens_map';

const mapStyle = [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road.arterial", stylers: [{ visibility: "off" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
    { featureType: "road.highway", stylers: [{ visibility: "off" }] },
    { featureType: "road.local", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
];

const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const primaryRgb = hexToRgb('#3F51B5') || { r: 63, g: 81, b: 181 };
const backgroundRgb = hexToRgb('#ECEFF1') || { r: 236, g: 239, b: 241 };

function GeoJsonLayer() {
    const map = useMap();
    const { geoData, tabularData, choroplethMetric, layerOpacity } = useContext(DataContext);

    const mergedData = useMemo(() => {
        if (!geoData) return null;
        if (!tabularData) return geoData;
        
        // Simple join logic: assumes a common ID field (e.g., 'id', 'GEOID')
        const joinKey = Object.keys(geoData.features[0]?.properties || {}).find(k => 
            Object.keys(tabularData[0] || {}).includes(k)
        );

        if (!joinKey) return geoData;

        const tabularMap = new Map(tabularData.map(row => [row[joinKey], row]));
        const newFeatures = geoData.features.map(feature => {
            const id = feature.properties?.[joinKey];
            const tabularRow = tabularMap.get(id);
            if (tabularRow) {
                return {
                    ...feature,
                    properties: { ...feature.properties, ...tabularRow }
                };
            }
            return feature;
        });
        return { ...geoData, features: newFeatures };
    }, [geoData, tabularData]);

    useEffect(() => {
        if (!map || !mergedData) return;

        const dataLayer = map.data;
        dataLayer.forEach(f => dataLayer.remove(f));
        const features = dataLayer.addGeoJson(mergedData);
        
        const metricValues = mergedData.features
            .map(f => f.properties?.[choroplethMetric || ''])
            .filter((v): v is number => typeof v === 'number' && isFinite(v));
        
        const min = Math.min(...metricValues);
        const max = Math.max(...metricValues);

        dataLayer.setStyle(feature => {
            let color = `rgb(${backgroundRgb.r}, ${backgroundRgb.g}, ${backgroundRgb.b})`;
            if (choroplethMetric && metricValues.length > 0) {
                const value = feature.getProperty(choroplethMetric);
                if (typeof value === 'number' && isFinite(value)) {
                    const percent = (value - min) / (max - min) || 0;
                    const r = backgroundRgb.r + percent * (primaryRgb.r - backgroundRgb.r);
                    const g = backgroundRgb.g + percent * (primaryRgb.g - backgroundRgb.g);
                    const b = backgroundRgb.b + percent * (primaryRgb.b - backgroundRgb.b);
                    color = `rgb(${r}, ${g}, ${b})`;
                }
            }

            return {
                fillColor: color,
                strokeWeight: 0.5,
                strokeColor: '#FFFFFF',
                fillOpacity: layerOpacity
            };
        });

        const bounds = new google.maps.LatLngBounds();
        dataLayer.forEach(feature => {
            feature.getGeometry()?.forEachLatLng(latlng => bounds.extend(latlng));
        });
        if (!bounds.isEmpty()) {
            map.fitBounds(bounds, 20);
        }

        return () => { features.forEach(f => dataLayer.remove(f)); };

    }, [map, mergedData, choroplethMetric, layerOpacity]);

    return null;
}

export default function MapView() {
    const { geoData } = useContext(DataContext);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
            <div className="flex items-center justify-center h-full bg-muted">
                <p className="text-destructive-foreground bg-destructive p-4 rounded-md">
                    Google Maps API Key is missing.
                </p>
            </div>
        );
    }
    
    if (!geoData) {
        return (
             <div className="flex items-center justify-center h-full bg-muted">
                <p className="text-muted-foreground p-4 text-center">Upload a GeoJSON file to visualize data on the map.</p>
            </div>
        )
    }

    return (
        <APIProvider apiKey={apiKey}>
            <Map
                defaultCenter={{ lat: 40.7128, lng: -74.0060 }}
                defaultZoom={3}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                mapId={MAP_ID}
                styles={mapStyle}
            >
                <GeoJsonLayer />
            </Map>
        </APIProvider>
    );
}
