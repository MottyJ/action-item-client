import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

export const HomeScreen = () => {
  const navigate = useNavigate();
  const { fetchRandomUsers } = useUserStore();

  const handleFetchClick = () => {
    fetchRandomUsers(true);
    navigate('/random-users');
  };

  return (
    <div className="w-full h-screen flex items-center justify-center gap-8 bg-gray-100">
      <button
        className="px-12 py-6 text-2xl bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        onClick={handleFetchClick}
      >
        Fetch
      </button>
      <button
        className="px-12 py-6 text-2xl bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        onClick={() => navigate('/saved-users')}
      >
        History
      </button>
    </div>
  );
}; 