import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { UserList } from './UserList';

export const SavedUsersScreen = () => {
  const { savedUsers, fetchSavedUsers } = useUserStore();

  useEffect(() => {
    fetchSavedUsers();
  }, [fetchSavedUsers]);

  return <UserList users={savedUsers} isSaved />;
}; 