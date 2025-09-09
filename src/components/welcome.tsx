import { Map, BarChart3, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4 font-headline">
          Welcome to ElectoralLens
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Translate raw election data into a clear, visual narrative. Upload your CSV or GeoJSON file to begin your private, in-browser analysis.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <Card className="text-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="text-accent" />
              Interactive Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Visualize geographic patterns of voter turnout and other key metrics instantly on an interactive map.
            </p>
          </CardContent>
        </Card>
        <Card className="text-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-accent" />
              Deep Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Generate dynamic charts, descriptive statistics, and filter data to uncover deeper insights.
            </p>
          </CardContent>
        </Card>
        <Card className="text-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="text-accent" />
              Private & Secure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your data never leaves your browser. All analysis is done client-side and forgotten when you close the tab.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
