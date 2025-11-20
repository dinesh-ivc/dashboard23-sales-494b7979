'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, AlertCircle, Calendar, Globe, Store, ShoppingCart } from 'lucide-react';
import WebsiteVisitsForm from '@/components/WebsiteVisitsForm';
import DeleteDialog from '@/components/DeleteDialog';
import { useToast } from '@/components/ui/use-toast';

export default function WebsiteVisitsPage() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await fetch('/api/website-visits');
      if (!response.ok) throw new Error('Failed to fetch website visits');
      const data = await response.json();
      setVisits(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingVisit(null);
    setShowForm(true);
  };

  const handleEdit = (visit) => {
    setEditingVisit(visit);
    setShowForm(true);
  };

  const handleDeleteClick = (visit) => {
    setVisitToDelete(visit);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/website-visits/${visitToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete website visit');

      toast({
        title: "Success",
        description: "Website visit record deleted successfully",
      });

      fetchVisits();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setVisitToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchVisits();
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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Visits</h1>
          <p className="text-gray-600 mt-2">
            Track and manage all website visit records
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Visit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Website Visits</CardTitle>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <div className="text-center py-10">
              <Globe className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No website visits</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new website visit record.
              </p>
              <div className="mt-6">
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Visit
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Visitor IP</TableHead>
                  <TableHead>Page Path</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Duration (sec)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        {new Date(visit.visit_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{visit.visitor_ip}</TableCell>
                    <TableCell>{visit.page_path}</TableCell>
                    <TableCell>{visit.referrer || '-'}</TableCell>
                    <TableCell>{visit.duration_seconds || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={visit.status === 'completed' ? 'default' : 'secondary'}>
                        {visit.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <WebsiteVisitsForm 
          visit={editingVisit}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Website Visit"
        description="Are you sure you want to delete this website visit record? This action cannot be undone."
      />
    </div>
  );
}