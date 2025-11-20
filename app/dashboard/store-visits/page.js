'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Store, Calendar, User, MapPin } from 'lucide-react';
import StoreVisitsForm from '@/components/StoreVisitsForm';
import DeleteDialog from '@/components/DeleteDialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export default function StoreVisitsPage() {
  const [storeVisits, setStoreVisits] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStoreVisits();
  }, []);

  const fetchStoreVisits = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('store_visits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStoreVisits(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch store visits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingVisit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (visit) => {
    setEditingVisit(visit);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (visit) => {
    setVisitToDelete(visit);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('store_visits')
        .delete()
        .eq('id', visitToDelete.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Store visit deleted successfully",
      });

      fetchStoreVisits();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete store visit",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setVisitToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchStoreVisits();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Store Visits</h1>
          <p className="text-muted-foreground">Manage and track in-store customer visits</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Store Visit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Visit Records</CardTitle>
          <CardDescription>
            Track customer visits to physical store locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Store Location</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storeVisits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        {visit.customer_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {visit.store_location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {new Date(visit.visit_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{visit.duration_minutes} minutes</TableCell>
                    <TableCell>{visit.visit_purpose}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={visit.visit_outcome === 'successful' ? 'default' : 'secondary'}
                        className={visit.visit_outcome === 'successful' ? 'bg-green-600' : ''}
                      >
                        {visit.visit_outcome}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(visit)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteClick(visit)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {isFormOpen && (
        <StoreVisitsForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSuccess={handleFormSuccess}
          initialData={editingVisit}
        />
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        itemType="store visit"
        itemName={visitToDelete?.customer_name || ''}
      />
    </div>
  );
}