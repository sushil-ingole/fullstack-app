import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login/Login.tsx';
import ChatApp from './components/ChatApp/ChatApp.tsx';
import SignUp from './components/SignUp/SignUp.tsx';
import ChatState from './components/Context/ChatState.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/chatapp',
    element: <ChatApp/>
  },
  {
    path: '/signup',
    element: <SignUp/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ChatState>
      <RouterProvider router={router}/>
    </ChatState>
)
