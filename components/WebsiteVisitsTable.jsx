'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Calendar, 
  Globe, 
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import DeleteDialog from '@/components/DeleteDialog';
import WebsiteVisitsForm from '@/components/WebsiteVisitsForm';

export default function WebsiteVisitsTable() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentVisit, setCurrentVisit] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState(null);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/website-visits');
      setVisits(response.data);
    } catch (err) {
      setError('Failed to fetch website visits');
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVisit = () => {
    setCurrentVisit(null);
    setIsFormOpen(true);
  };

  const handleEditVisit = (visit) => {
    setCurrentVisit(visit);
    setIsFormOpen(true);
  };

  const handleDeleteVisit = (visit) => {
    setVisitToDelete(visit);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/website-visits/${visitToDelete.id}`);
      fetchVisits();
      toast.success('Visit deleted successfully');
    } catch (err) {
      toast.error('Failed to delete visit');
    } finally {
      setDeleteDialogOpen(false);
      setVisitToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchVisits();
  };

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = visit.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.ip_address.includes(searchTerm) ||
                         visit.referral_source.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || visit.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button 
                onClick={fetchVisits} 
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Website Visits</h2>
          <p className="text-gray-600">Track and manage all website visitor interactions</p>
        </div>
        <Button onClick={handleCreateVisit} className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Visit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visits.length}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3m 42s</div>
            <p className="text-xs text-muted-foreground">+2.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Visit Records</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search visits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Pages Viewed</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.length > 0 ? (
                filteredVisits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      <div className="font-medium">{visit.visitor_name}</div>
                      <div className="text-sm text-gray-500">{visit.ip_address}</div>
                    </TableCell>
                    <TableCell>
                      {new Date(visit.visit_date).toLocaleDateString()}{' '}
                      {new Date(visit.visit_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>{visit.referral_source}</TableCell>
                    <TableCell>{visit.pages_viewed}</TableCell>
                    <TableCell>{visit.duration}</TableCell>
                    <TableCell>{getStatusBadge(visit.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditVisit(visit)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteVisit(visit)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="text-gray-500">No website visits found</div>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={handleCreateVisit}
                    >
                      Add your first visit
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentVisit ? 'Edit Website Visit' : 'Add New Website Visit'}
            </DialogTitle>
          </DialogHeader>
          <WebsiteVisitsForm 
            visit={currentVisit}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Website Visit"
        description="Are you sure you want to delete this website visit record? This action cannot be undone."
      />
    </div>
  );
}