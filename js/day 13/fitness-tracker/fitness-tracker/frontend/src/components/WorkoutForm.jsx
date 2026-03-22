import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { ClipboardList, Weight, Clock } from 'lucide-react';

const WorkoutForm = ({ onAdd }) => {
  const { user } = useAuthContext();
  const [title, setTitle] = useState('');
  const [bodyWeight, setBodyWeight] = useState('');
  const [reps, setReps] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    const workout = { title, bodyWeight, reps, duration };

    const response = await fetch('http://localhost:4000/api/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields || []);
    }
    if (response.ok) {
      setTitle('');
      setBodyWeight('');
      setReps('');
      setDuration('');
      setError(null);
      setEmptyFields([]);
      onAdd(json);
    }
  };

  return (
    <div className="create-form glass-card">
      <h3>
        Add a New Workout Session <ClipboardList size={20} />
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Exercise Title:</label>
          <input 
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className={emptyFields.includes('title') ? 'error' : ''}
          />
        </div>

        <div className="form-group">
          <label>
            <Weight size={16} /> My Current Body Weight (kg):
          </label>
          <input 
            type="number"
            onChange={(e) => setBodyWeight(e.target.value)}
            value={bodyWeight}
            placeholder="e.g., 80.5"
            className={emptyFields.includes('bodyWeight') ? 'error' : ''}
          />
        </div>

        <div className="form-group">
          <label>Reps:</label>
          <input 
            type="number"
            onChange={(e) => setReps(e.target.value)}
            value={reps}
            className={emptyFields.includes('reps') ? 'error' : ''}
          />
        </div>

        <div className="form-group">
          <label>
            <Clock size={16} /> Duration (min):
          </label>
          <input 
            type="number"
            onChange={(e) => setDuration(e.target.value)}
            value={duration}
            className={emptyFields.includes('duration') ? 'error' : ''}
          />
        </div>

        <button>Add Session</button>
        {error && <div className="error-msg">{error}</div>}
      </form>
    </div>
  );
};

export default WorkoutForm;
