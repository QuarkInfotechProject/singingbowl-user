import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TabContentProps {
  value: string;
  title: string;
  description: string;
}

export function TabContent({ value, title, description }: TabContentProps) {
  return (
    <TabsContent value={value} className="space-y-4">
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm leading-relaxed font-light">
            {description}
          </p>
        </CardContent>
      </Card>
    </TabsContent>
  );
}