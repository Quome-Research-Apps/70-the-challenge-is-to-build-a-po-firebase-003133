"use client";

import { useContext, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { DataContext } from '@/context/data-context';
import { BarChart3 } from 'lucide-react';

export default function ChartsDisplay() {
    const { tabularData, geoData } = useContext(DataContext);
    const hasData = !!(tabularData || geoData);

    const chartData = useMemo(() => {
        if (!tabularData || tabularData.length === 0) return [];
        
        const partyColumn = Object.keys(tabularData[0]).find(k => k.toLowerCase().includes('party'));
        if (!partyColumn) return [];

        const voteCount = tabularData.reduce((acc, row) => {
            const party = row[partyColumn] as string;
            if (party) {
                acc[party] = (acc[party] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(voteCount).map(([name, value]) => ({ name, value })).slice(0, 10);

    }, [tabularData]);

    if (!hasData) return null;
    if (chartData.length === 0) return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="text-accent" />
                    Dynamic Charts
                </CardTitle>
                <CardDescription>Comparative data visualizations.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">No chartable data found. Try a dataset with categorical columns like 'party'.</p>
            </CardContent>
        </Card>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="text-accent" />
                    Dynamic Charts
                </CardTitle>
                <CardDescription>Comparative data visualizations.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: -20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                            <YAxis tickLine={false} axisLine={false} />
                            <ChartTooltip
                                cursor={{fill: 'hsl(var(--muted))'}}
                                content={<ChartTooltipContent />}
                            />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={4} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
