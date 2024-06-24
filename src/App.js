import './App.css';
import Home from './pages/Home';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import AddEditBlog from './pages/AddEditBlog';
import EditBlog from './pages/EditBlog';
import Login from './pages/Login';
import Register from './pages/Register';
import Single from './pages/Single';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';
import UserProfile from './pages/UserProfile';
import './style.scss';
import { auth } from './firebase';
import {AuthProvider} from './context/AuthContext'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  
  const Layout = () => {
    return (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    );
  };


  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Layout />
      ),
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/post/:id',
          element: <Single user={user} />,
        },
        {
          path: '/write',
          element: <AddEditBlog user={user}/>,
        },
        {
          path: '/edit/:id',
          element: <EditBlog />,
        },
        {
          path: '/user/:id/blogs',
          element: <UserProfile />,
        },
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/*',
      element: <NotFound />,
    },
  ]);

  return (
    <div className="app">
      <div className="container">
      <AuthProvider>
        <RouterProvider router={router}>
          <Routes>
            <Layout />
          </Routes>
        </RouterProvider>
        </AuthProvider>
      </div>
    </div>
  );
}

export default App;
