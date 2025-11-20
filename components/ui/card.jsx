'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CardComponent({ title, children, className = '' }) {
  return (
    <Card className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      <CardHeader className="border-b border-gray-200 p-4">
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}