import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoctorSidebar from '@/components/DoctorSidebar';
import { MessageSquare, Plus, Edit, Trash2, Send, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const DoctorMessages = () => {
  const [messages, setMessages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    receiver_id: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.receiver_id || !formData.subject || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const url = editingMessage ? `/api/messages/${editingMessage.id}` : '/api/messages';
      const method = editingMessage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        await fetchMessages();
        resetForm();
        alert(editingMessage ? 'Message updated successfully!' : 'Message sent successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        setError(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (message) => {
    setEditingMessage(message);
    setFormData({
      receiver_id: message.receiver_id?.toString() || '',
      subject: message.subject || '',
      message: message.message || ''
    });
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/messages/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          fetchMessages();
          alert('Message deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      receiver_id: '', 
      subject: '', 
      message: '' 
    });
    setEditingMessage(null);
    setShowForm(false);
    setError('');
  };

  return (
    <>
      <Helmet>
        <title>Messages - Doctor Dashboard</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex pt-20">
          <DoctorSidebar />
          <main className="flex-1 px-6 py-8">
            <div className="container mx-auto max-w-6xl">
              <div className="mb-8 animate-fade-in-up">
                <h1 className="text-4xl font-display font-bold text-gradient mb-4">Messages</h1>
                <p className="text-xl text-muted-foreground">Communicate with patients and manage messages</p>
              </div>

              <Card className="shadow-card border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Patient Messages
                    </CardTitle>
                    <CardDescription>View and respond to patient communications</CardDescription>
                  </div>
                  <Button onClick={() => setShowForm(true)} className="gradient-primary shadow-elegant">
                    <Plus className="h-4 w-4 mr-2" />
                    New Message
                  </Button>
                </CardHeader>
                <CardContent>
                  {showForm && (
                    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{editingMessage ? 'Edit Message' : 'New Message'}</h3>
                        <Button type="button" onClick={resetForm} variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                          {error}
                        </div>
                      )}
                      <div className="grid gap-4">
                        <div>
                          <Label>Receiver ID *</Label>
                          <Input value={formData.receiver_id} onChange={(e) => setFormData({...formData, receiver_id: e.target.value})} placeholder="Enter receiver ID" required />
                        </div>
                        <div>
                          <Label>Subject *</Label>
                          <Input value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required />
                        </div>
                        <div>
                          <Label>Message *</Label>
                          <Textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={4} required />
                        </div>
                        <div>
                          <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Sending...' : (editingMessage ? 'Update Message' : 'Send Message')}
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const messageDate = new Date(message.created_at).toLocaleDateString();
                      
                      return (
                      <div key={message.id} className="flex justify-between items-start p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-2 h-2 rounded-full mt-2 ${!message.is_read ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`}></div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{message.subject}</h3>
                            <p className="text-sm text-muted-foreground mb-2">From: {message.sender?.name || `User ${message.sender_id}`} | To: {message.receiver?.name || `User ${message.receiver_id}`}</p>
                            <p className="text-sm text-foreground">{message.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">Date: {messageDate} | Status: {message.is_read ? 'Read' : 'Unread'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleEdit(message)} size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleDelete(message.id)} size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      );
                    })}
                    {messages.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No messages found. Click "New Message" to send your first message.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DoctorMessages;