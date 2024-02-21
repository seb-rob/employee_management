import LoginPage from './Routes/LoginPage/LoginPage';
import { Route, Routes, useNavigate  } from 'react-router-dom';
import UserProfileComponent from './components/Profile/Profile';
import UserDetailsPage from './components/Employees/Employees';
import ArchiveList from './components/Archive/Archive';
import HomePage from './Routes/Home/HomePage';
import ProtectedRoute from './ProtectedRoute';
import AdminProtectedRoute from "./AdminProtectedRoute";
import { useEffect } from 'react';
import AdminProfileView from './Routes/AdminProfileView';


function App() {
  const navigate = useNavigate()
  
  // REDIRECT USER FROM "/" TO "/LOGIN"
  useEffect(() => {
    navigate("/login")
  },[]);

  
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<HomePage />}>
          
            {/* user routes  */}
            <Route index path='/profile' element={<UserProfileComponent />} />
          
            {/* admin routes  */}
            <Route element={<AdminProtectedRoute />}>
              <Route path='/employees' element={<UserDetailsPage />}  />  
              <Route path='/archives' element={<ArchiveList />} />
              <Route path="/profile/:id" element={<AdminProfileView />} />
            </Route>
          
          </Route>
        </Route>
    </Routes>
  );
}


export default App;
