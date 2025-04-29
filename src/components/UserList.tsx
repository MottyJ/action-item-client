import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../store/userStore';

interface UserListProps {
  users: User[];
  isSaved?: boolean;
}

export const UserList = ({ users, isSaved = false }: UserListProps) => {
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  const filteredUsers = users.filter(user => {
    const fullName = `${user.name.title} ${user.name.first} ${user.name.last}`.toLowerCase();
    const matchesName = fullName.includes(nameFilter.toLowerCase());
    const matchesCountry = user.location.country.toLowerCase().includes(countryFilter.toLowerCase());
    return matchesName && matchesCountry;
  });

  const handleRowClick = (user: User) => {
    navigate(`/user/${user.id}`, { state: { user, isSaved } });
  };

  if (users.length === 0) {
    return (
      <div className="text-center mt-8">
        <h3 className="text-xl">No users found</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <div className="mb-8 flex justify-between gap-4 w-full max-w-2xl">
        <input
          type="text"
          className="p-2 border rounded w-64"
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNameFilter(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded w-64"
          placeholder="Filter by country"
          value={countryFilter}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCountryFilter(e.target.value)}
        />
      </div>

      {/* Modern vertical list */}
      <div className="bg-white rounded-xl shadow divide-y divide-gray-200 max-w-2xl w-full">
        {filteredUsers.map((user) => (
          <div
            key={user.id || user.email}
            onClick={() => handleRowClick(user)}
            className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-blue-50 transition group"
          >
            <img
              src={user.picture.large}
              alt={`${user.name.first} ${user.name.last}`}
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 group-hover:border-blue-400"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-lg text-gray-900 truncate">{`${user.name.title} ${user.name.first} ${user.name.last}`}</div>
              <div className="text-gray-500 text-sm truncate">{user.gender} • {user.location.country}</div>
              <div className="text-gray-700 text-xs truncate"><span className="font-medium">Phone:</span> {user.phone}</div>
              <div className="text-gray-700 text-xs truncate"><span className="font-medium">Email:</span> {user.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 