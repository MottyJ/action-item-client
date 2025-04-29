import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomeScreen } from './components/HomeScreen';
import { RandomUsersScreen } from './components/RandomUsersScreen';
import { SavedUsersScreen } from './components/SavedUsersScreen';
import { UserDetail } from './components/UserDetail';

function App() {
  return (
    <Router>
      <div className="w-screen h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/random-users" element={<RandomUsersScreen />} />
          <Route path="/saved-users" element={<SavedUsersScreen />} />
          <Route path="/user/:id" element={<UserDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
