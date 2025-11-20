'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, AlertCircle } from 'lucide-react';

export default function StoreVisitsForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    store_name: '',
    visit_date: '',
    visitor_count: '',
    revenue: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.store_name.trim()) {
      newErrors.store_name = 'Store name is required';
    }

    if (!formData.visit_date) {
      newErrors.visit_date = 'Visit date is required';
    }

    if (!formData.visitor_count || formData.visitor_count <= 0) {
      newErrors.visitor_count = 'Visitor count must be a positive number';
    }

    if (!formData.revenue || formData.revenue < 0) {
      newErrors.revenue = 'Revenue must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/store-visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          visitor_count: parseInt(formData.visitor_count),
          revenue: parseFloat(formData.revenue)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add store visit');
      }

      // Reset form
      setFormData({
        store_name: '',
        visit_date: '',
        visitor_count: '',
        revenue: ''
      });

      // Trigger success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setSubmitError(error.message || 'An error occurred while adding the store visit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Add Store Visit
        </CardTitle>
      </CardHeader>
      <CardContent>
        {submitError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="store_name">Store Name</Label>
              <Input
                id="store_name"
                name="store_name"
                value={formData.store_name}
                onChange={handleChange}
                placeholder="Enter store name"
                className={errors.store_name ? 'border-red-500' : ''}
              />
              {errors.store_name && (
                <p className="text-sm text-red-600">{errors.store_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="visit_date">Visit Date</Label>
              <Input
                id="visit_date"
                name="visit_date"
                type="date"
                value={formData.visit_date}
                onChange={handleChange}
                className={errors.visit_date ? 'border-red-500' : ''}
              />
              {errors.visit_date && (
                <p className="text-sm text-red-600">{errors.visit_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitor_count">Visitor Count</Label>
              <Input
                id="visitor_count"
                name="visitor_count"
                type="number"
                min="1"
                value={formData.visitor_count}
                onChange={handleChange}
                placeholder="Enter number of visitors"
                className={errors.visitor_count ? 'border-red-500' : ''}
              />
              {errors.visitor_count && (
                <p className="text-sm text-red-600">{errors.visitor_count}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue">Revenue ($)</Label>
              <Input
                id="revenue"
                name="revenue"
                type="number"
                min="0"
                step="0.01"
                value={formData.revenue}
                onChange={handleChange}
                placeholder="Enter revenue amount"
                className={errors.revenue ? 'border-red-500' : ''}
              />
              {errors.revenue && (
                <p className="text-sm text-red-600">{errors.revenue}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Adding...' : 'Add Store Visit'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}