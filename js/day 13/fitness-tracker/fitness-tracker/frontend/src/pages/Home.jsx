import { useEffect, useState, useMemo } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';

const COLORS = ['#00f2fe', '#4facfe', '#8A2BE2', '#10b981', '#f43f5e'];

const Home = () => {
  const [workouts, setWorkouts] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch('http://localhost:4000/api/workouts', {
        headers: {'Authorization': `Bearer ${user.token}`},
      });
      const json = await response.json();

      if (response.ok) {
        setWorkouts(json);
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  const addWorkout = (newWorkout) => {
    setWorkouts([newWorkout, ...workouts]);
  };

  const removeWorkout = (id) => {
    setWorkouts(workouts.filter(w => w._id !== id));
  };

  // Process data for charts
  const { weightData, mixData } = useMemo(() => {
    if (!workouts || workouts.length === 0) return { weightData: [], mixData: [] };
    
    // Sort ascending for chronological trend
    const sorted = [...workouts].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    // Weight data
    const wData = sorted.map(w => {
      const d = new Date(w.createdAt);
      return {
        date: `${d.getMonth()+1}/${d.getDate()}`,
        weight: w.bodyWeight || 0
      };
    });

    // Workout mix data
    const mix = {};
    sorted.forEach(w => {
      let type = 'Other';
      const t = w.title.toLowerCase();
      if (t.includes('run') || t.includes('jog')) type = 'Runner';
      else if (t.includes('swim')) type = 'Swimmer';
      else if (t.includes('cycle') || t.includes('bike')) type = 'Cyclist';
      else if (t.includes('lift') || t.includes('curl') || t.includes('press')) type = 'Barbell';
      
      mix[type] = (mix[type] || 0) + 1;
    });
    
    const mData = Object.keys(mix).map(key => ({ name: key, value: mix[key] }));

    return { weightData: wData, mixData: mData };
  }, [workouts]);

  return (
    <div className="home">
      <div className="workouts-container">
        
        <div className="workouts-list">
          {workouts.length === 0 && <p className="glass-card" style={{padding: '20px'}}>No workouts yet. Add one to get started!</p>}
          {workouts && workouts.map((workout) => (
            <WorkoutDetails key={workout._id} workout={workout} onRemove={removeWorkout} />
          ))}
        </div>

        {workouts.length > 0 && (
          <div className="progress-dashboard glass-panel">
            <h3>Progress Dashboard</h3>
            <div className="charts-row">
              <div className="chart-card">
                <h4>Weekly Weight Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weightData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="date" stroke="#9aa0a6" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9aa0a6" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(30,35,45,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#00f2fe' }}
                    />
                    <Line type="monotone" dataKey="weight" stroke="#00f2fe" strokeWidth={3} dot={{r: 4, fill: '#00f2fe'}} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h4>Workout Mix (Last 7 Days)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={mixData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {mixData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30,35,45,0.9)', border: 'none', borderRadius: '8px' }} />
                    <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9aa0a6' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

      </div>
      
      <WorkoutForm onAdd={addWorkout} />
    </div>
  );
};

export default Home;
