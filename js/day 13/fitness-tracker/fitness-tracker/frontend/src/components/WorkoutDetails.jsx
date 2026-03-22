import { useAuthContext } from '../hooks/useAuthContext';
import { Trash2, Activity, Waves, Bike, Dumbbell, Calendar, Clock, Weight } from 'lucide-react';

const WorkoutDetails = ({ workout, onRemove }) => {
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('http://localhost:4000/api/workouts/' + workout._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (response.ok) {
      onRemove(workout._id);
    }
  };

  const date = new Date(workout.createdAt);

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('swim')) return <Waves size={28} />;
    if (t.includes('cycle') || t.includes('bike')) return <Bike size={28} />;
    if (t.includes('run') || t.includes('jog')) return <Activity size={28} />;
    return <Dumbbell size={28} />;
  };

  return (
    <div className="workout-details glass-card">
      <div className="workout-icon">
        {getIcon(workout.title)}
      </div>
      <div className="workout-info">
        <h4>{workout.title}</h4>
        <div className="workout-stats">
          <span><Weight size={14} /> Body Weight: {workout.bodyWeight} kg</span>
          {workout.reps > 0 && <span><Activity size={14} /> Reps: {workout.reps}</span>}
          {workout.laps > 0 && <span><Activity size={14} /> Laps: {workout.laps}</span>}
          <span><Clock size={14} /> Duration: {workout.duration} min.</span>
          {workout.calories > 0 && <span><Activity size={14} /> Calories: {workout.calories} kcal.</span>}
        </div>
        <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Calendar size={12} /> {date.toLocaleDateString()}
        </div>
      </div>
      <span className="delete-btn" onClick={handleClick} title="Delete Workout">
        <Trash2 size={18} />
      </span>
    </div>
  );
};

export default WorkoutDetails;
