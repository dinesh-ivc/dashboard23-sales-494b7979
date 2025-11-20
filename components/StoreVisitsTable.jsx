'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus } from 'lucide-react';
import DeleteDialog from '@/components/DeleteDialog';
import StoreVisitsForm from '@/components/StoreVisitsForm';

export default function StoreVisitsTable() {
  const [storeVisits, setStoreVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVisit, setEditingVisit] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState(null);

  useEffect(() => {
    fetchStoreVisits();
  }, []);

  const fetchStoreVisits = async () => {
    try {
      const response = await fetch('/api/store-visits');
      if (!response.ok) throw new Error('Failed to fetch store visits');
      const data = await response.json();
      setStoreVisits(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (visit) => {
    setEditingVisit(visit);
    setIsFormOpen(true);
  };

  const handleDelete = (visit) => {
    setVisitToDelete(visit);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/store-visits/${visitToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete store visit');

      setStoreVisits(storeVisits.filter(visit => visit.id !== visitToDelete.id));
      setDeleteDialogOpen(false);
      setVisitToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingVisit(null);
    fetchStoreVisits();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Store Visits</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingVisit(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Store Visit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVisit ? 'Edit Store Visit' : 'Add New Store Visit'}
              </DialogTitle>
            </DialogHeader>
            <StoreVisitsForm 
              visit={editingVisit} 
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Visitors</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {storeVisits.map((visit) => (
            <TableRow key={visit.id}>
              <TableCell>
                {new Date(visit.visit_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </TableCell>
              <TableCell>{visit.store_location}</TableCell>
              <TableCell>{visit.visitor_count}</TableCell>
              <TableCell>${visit.revenue?.toFixed(2) || '0.00'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(visit)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(visit)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {storeVisits.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No store visits recorded yet
        </div>
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={confirmDelete}
        title="Delete Store Visit"
        description="Are you sure you want to delete this store visit record? This action cannot be undone."
      />
    </Card>
  );
}