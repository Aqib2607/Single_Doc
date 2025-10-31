import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Vital {
  id: number;
  vital_type: string;
  value: number;
  unit: string;
  recorded_at: string;
  is_abnormal: boolean;
}

interface HealthScoreData {
  score: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  breakdown: {
    heartRate: number;
    bloodPressure: number;
    temperature: number;
    respiratory: number;
    oxygenSat: number;
  };
}

interface HealthScoreProps {
  onScoreUpdate?: (score: number) => void;
}

const HealthScore: React.FC<HealthScoreProps> = ({ onScoreUpdate }) => {
  const { user } = useAuth();
  const [healthScore, setHealthScore] = useState<HealthScoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [previousScore, setPreviousScore] = useState<number | null>(null);

  const calculateHealthScore = useCallback((vitals: Vital[]): HealthScoreData => {
    const getLatestVital = (type: string) => 
      vitals.filter(v => v.vital_type === type)
           .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0];

    const heartRate = getLatestVital('heart_rate');
    const systolic = getLatestVital('blood_pressure_systolic');
    const diastolic = getLatestVital('blood_pressure_diastolic');
    const temp = getLatestVital('temperature');
    const respiratory = getLatestVital('respiratory_rate');
    const oxygen = getLatestVital('oxygen_saturation');

    // Scoring algorithm (0-100 scale)
    const scoreVital = (vital: Vital | undefined, optimalRange: [number, number], weight: number): number => {
      if (!vital) return 0;
      const [min, max] = optimalRange;
      const value = vital.value;
      
      if (value >= min && value <= max) return weight; // Perfect score
      
      const deviation = Math.min(
        Math.abs(value - min) / min,
        Math.abs(value - max) / max
      );
      
      return Math.max(0, weight * (1 - deviation * 2)); // Penalty for deviation
    };

    const scores = {
      heartRate: scoreVital(heartRate, [60, 100], 20),
      bloodPressure: Math.min(
        scoreVital(systolic, [90, 140], 15),
        scoreVital(diastolic, [60, 90], 15)
      ),
      temperature: scoreVital(temp, [97.0, 99.5], 20),
      respiratory: scoreVital(respiratory, [12, 20], 15),
      oxygenSat: scoreVital(oxygen, [95, 100], 30)
    };

    const totalScore = Math.round(
      scores.heartRate + scores.bloodPressure + scores.temperature + 
      scores.respiratory + scores.oxygenSat
    );

    const latestTimestamp = Math.max(
      ...[heartRate, systolic, diastolic, temp, respiratory, oxygen]
        .filter(Boolean)
        .map(v => new Date(v!.recorded_at).getTime())
    );

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (previousScore !== null) {
      if (totalScore > previousScore + 2) trend = 'up';
      else if (totalScore < previousScore - 2) trend = 'down';
    }

    return {
      score: totalScore,
      trend,
      lastUpdated: new Date(latestTimestamp).toISOString(),
      breakdown: {
        heartRate: Math.round(scores.heartRate),
        bloodPressure: Math.round(scores.bloodPressure),
        temperature: Math.round(scores.temperature),
        respiratory: Math.round(scores.respiratory),
        oxygenSat: Math.round(scores.oxygenSat)
      }
    };
  }, [previousScore]);

  const fetchAndCalculateScore = useCallback(async () => {
    if (!user?.id && !user?.patient_id) return;

    const patientId = user.id || user.patient_id;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/patients/${patientId}/vitals?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const newScore = calculateHealthScore(data.data || []);
        
        if (healthScore) {
          setPreviousScore(healthScore.score);
        }
        
        setHealthScore(newScore);
        onScoreUpdate?.(newScore.score);
      }
    } catch (error) {
      console.error('Error calculating health score:', error);
    } finally {
      setLoading(false);
    }
  }, [user, calculateHealthScore, healthScore]);

  useEffect(() => {
    fetchAndCalculateScore();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAndCalculateScore, 30000);
    return () => clearInterval(interval);
  }, [fetchAndCalculateScore]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!healthScore) {
    return (
      <Card className="shadow-card border-border bg-card">
        <CardContent className="pt-6">
          <div className="text-center py-4 text-muted-foreground">
            {loading ? 'Calculating health score...' : 'No vital signs data available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Health Score
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon(healthScore.trend)}
            <Badge variant="outline" className="text-xs">
              Patient ID: {user?.id || user?.patient_id}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Real-time calculation based on vital signs • Last updated: {new Date(healthScore.lastUpdated).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-6">
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(healthScore.score)} mb-2`}>
              {healthScore.score}
            </div>
            <div className="text-lg text-muted-foreground">
              {getScoreLabel(healthScore.score)}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Heart Rate</span>
            <span className="font-medium">{healthScore.breakdown.heartRate}/20</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Blood Pressure</span>
            <span className="font-medium">{healthScore.breakdown.bloodPressure}/15</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Temperature</span>
            <span className="font-medium">{healthScore.breakdown.temperature}/20</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Respiratory Rate</span>
            <span className="font-medium">{healthScore.breakdown.respiratory}/15</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Oxygen Saturation</span>
            <span className="font-medium">{healthScore.breakdown.oxygenSat}/30</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Algorithm:</strong> Score = Heart Rate (20%) + Blood Pressure (15%) + Temperature (20%) + Respiratory (15%) + Oxygen Sat (30%). 
              Optimal ranges: HR 60-100, BP 90-140/60-90, Temp 97-99.5°F, RR 12-20, O2 95-100%.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthScore;