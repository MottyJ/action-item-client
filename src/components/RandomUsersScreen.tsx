import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { UserList } from './UserList';

export const RandomUsersScreen = () => {
  const { users, loading, fetchRandomUsers } = useUserStore();

  useEffect(() => {
    fetchRandomUsers();
  }, [fetchRandomUsers]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return <UserList users={users} />;
}; 