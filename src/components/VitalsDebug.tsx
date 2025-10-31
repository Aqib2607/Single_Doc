import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const VitalsDebug: React.FC = () => {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runDebugTests = async () => {
    setLoading(true);
    const info: any = {
      timestamp: new Date().toISOString(),
      user: user,
      token: localStorage.getItem('token') ? 'Present' : 'Missing',
      localStorage: {
        user: localStorage.getItem('user'),
        token: localStorage.getItem('token')?.substring(0, 20) + '...'
      }
    };

    try {
      // Test 1: Check user endpoint
      const token = localStorage.getItem('token');
      if (token) {
        const userResponse = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        info.userEndpoint = {
          status: userResponse.status,
          ok: userResponse.ok
        };
        
        if (userResponse.ok) {
          info.userEndpoint.data = await userResponse.json();
        } else {
          info.userEndpoint.error = await userResponse.text();
        }

        // Test 2: Check vitals endpoint if user ID is available
        if (user?.id) {
          const vitalsResponse = await fetch(`/api/patients/${user.id}/vitals`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          info.vitalsEndpoint = {
            status: vitalsResponse.status,
            ok: vitalsResponse.ok,
            url: `/api/patients/${user.id}/vitals`
          };
          
          if (vitalsResponse.ok) {
            const vitalsData = await vitalsResponse.json();
            info.vitalsEndpoint.dataCount = vitalsData.data?.length || 0;
            info.vitalsEndpoint.pagination = vitalsData.pagination;
          } else {
            info.vitalsEndpoint.error = await vitalsResponse.text();
          }
        }
      }
    } catch (error: any) {
      info.error = error.message;
    }

    setDebugInfo(info);
    setLoading(false);
  };

  useEffect(() => {
    runDebugTests();
  }, [user]);

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800 flex items-center gap-2">
          🔍 Vitals Debug Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={runDebugTests} disabled={loading} className="mb-4">
          {loading ? 'Running Tests...' : 'Refresh Debug Info'}
        </Button>
        
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
};

export default VitalsDebug;