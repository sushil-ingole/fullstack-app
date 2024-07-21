import { useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    if(sessionStorage.getItem("token")) {
      navigate('/chatapp');
    } else {
      navigate('/login');
    }
  }, []);
  
  return (
    <>
      <div className="container-fluid d-flex justify-content-center align-items-center">
        <Login/>
      </div>
    </>
  )
}

export default App
