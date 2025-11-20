'use client';

import React, { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const websiteVisitSchema = z.object({
  visitor_name: z.string().min(1, 'Visitor name is required'),
  visit_date: z.string().min(1, 'Visit date is required'),
  page_views: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().min(1, 'Page views must be at least 1')
  ),
  time_spent: z.preprocess(
    (val) => parseFloat(val),
    z.number().min(0, 'Time spent must be a positive number')
  ),
  source: z.string().min(1, 'Source is required'),
});

export default function WebsiteVisitsForm({ initialData, onSubmit, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    resolver: zodResolver(websiteVisitSchema),
    defaultValues: {
      visitor_name: initialData?.visitor_name || '',
      visit_date: initialData?.visit_date || '',
      page_views: initialData?.page_views || 1,
      time_spent: initialData?.time_spent || 0,
      source: initialData?.source || '',
    },
  });

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(data);
    } catch (err) {
      setError(err.message || 'Failed to save website visit record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Website Visit' : 'Add New Website Visit'}</CardTitle>
        <CardDescription>
          {initialData 
            ? 'Update the details of the website visit record' 
            : 'Record a new website visit for tracking purposes'}
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="visitor_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visitor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter visitor's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="visit_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visit Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Organic, Social, Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="page_views"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Views</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        placeholder="Number of pages viewed" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time_spent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Spent (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        min="0"
                        placeholder="Time spent on site" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialData ? 'Update Visit' : 'Add Visit'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}