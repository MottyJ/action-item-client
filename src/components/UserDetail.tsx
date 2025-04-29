import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

export const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, savedUsers, saveUser, deleteUser, updateUser, updateRandomUserName } = useUserStore();

  const user = [...users, ...savedUsers].find(u => u.id === id);

  const [editedName, setEditedName] = useState({
    title: user?.name.title || '',
    first: user?.name.first || '',
    last: user?.name.last || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return <div>User not found</div>;
  }

  const isSavedUser = savedUsers.some(u => u.id === id);
  const birthYear = new Date(user.dob.date).getFullYear();

  const handleSave = async () => {
    if (!isSavedUser && !isSaving) {
      setIsSaving(true);
      await saveUser(user);
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isSavedUser && user.id) {
      await deleteUser(user.id);
      navigate(-1);
    }
  };

  const handleUpdate = async () => {
    if (isSavedUser && user.id) {
      await updateUser(user.id, { name: editedName });
    }
  };

  const handleNameChange = (field: keyof typeof editedName, value: string) => {
    const newName = { ...editedName, [field]: value };
    setEditedName(newName);
    if (!isSavedUser && user.id) {
      updateRandomUserName(user.id, newName);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-8 bg-gray-100">
      <div className="relative max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <div className="mb-6 w-full flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <img
            src={user.picture.large}
            alt={`${user.name.first} ${user.name.last}`}
            className="w-40 h-40 rounded-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-32 font-semibold">Gender:</div>
            <div>{user.gender}</div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-32 font-semibold">Name:</div>
            <input
              type="text"
              value={editedName.title}
              onChange={(e) => handleNameChange('title', e.target.value)}
              className="p-2 border rounded w-20"
              placeholder="Title"
            />
            <input
              type="text"
              value={editedName.first}
              onChange={(e) => handleNameChange('first', e.target.value)}
              className="p-2 border rounded w-32"
              placeholder="First Name"
            />
            <input
              type="text"
              value={editedName.last}
              onChange={(e) => handleNameChange('last', e.target.value)}
              className="p-2 border rounded w-32"
              placeholder="Last Name"
            />
          </div>

          <div className="flex items-center">
            <div className="w-32 font-semibold">Age:</div>
            <div>{user.dob.age} years old (born in {birthYear})</div>
          </div>

          <div>
            <div className="w-32 font-semibold">Address:</div>
            <div className="pl-4">
              <div>{user.location.street.number} {user.location.street.name}</div>
              <div>{user.location.city}, {user.location.state}</div>
            </div>
          </div>

          <div>
            <div className="w-32 font-semibold">Contact:</div>
            <div className="pl-4">
              <div>Email: {user.email}</div>
              <div>Phone: {user.phone}</div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-end w-full relative">
          {(!isSavedUser || isSaving) && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg border border-green-500 hover:border-blue-400 hover:bg-green-600 disabled:opacity-50 transition-colors"
              disabled={isSavedUser || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          )}
          {isSavedUser && (
            <button
              onClick={handleDelete}
              className="absolute left-0 bottom-0 px-4 py-2 bg-red-500 text-white rounded-lg border border-red-500 hover:border-red-400 hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg border border-blue-500 hover:border-blue-400 hover:bg-blue-600 transition-colors"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}; 