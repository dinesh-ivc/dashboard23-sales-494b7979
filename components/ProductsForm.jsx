'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

const ProductsForm = ({ product, onSuccess, onCancel }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock_quantity: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || '',
        description: product.description || ''
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.stock_quantity) {
      newErrors.stock_quantity = 'Stock quantity is required';
    } else if (!Number.isInteger(parseInt(formData.stock_quantity)) || parseInt(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = 'Stock quantity must be a non-negative integer';
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const productData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        description: formData.description.trim()
      };

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) throw error;
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving product:', error);
      setSubmitError(error.message || 'Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {product ? (
            <>
              <Save className="h-5 w-5" />
              Edit Product
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Add New Product
            </>
          )}
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
                className={errors.category ? 'border-red-500' : ''}
              />
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity *</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={handleChange}
                placeholder="0"
                className={errors.stock_quantity ? 'border-red-500' : ''}
              />
              {errors.stock_quantity && <p className="text-sm text-red-500">{errors.stock_quantity}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Saving...'
            ) : product ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Product
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductsForm;