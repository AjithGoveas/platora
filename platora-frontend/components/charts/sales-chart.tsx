// components/charts/sales-chart.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function SalesChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                    {/* Placeholder for chart */}
                    <p>Sales chart goes here</p>
                </div>
            </CardContent>
        </Card>
    );
}
