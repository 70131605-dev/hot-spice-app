import { createBrowserRouter } from 'react-router'
import RootLayout from './layouts/RootLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import About from './pages/About'
import Menu from './pages/Menu'
import Reservation from './pages/Reservation'
import Gallery from './pages/Gallery'
import ChefTeam from './pages/ChefTeam'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'menu', Component: Menu },
      { path: 'reservation', Component: Reservation },
      { path: 'gallery', Component: Gallery },
      { path: 'chefs', Component: ChefTeam },
      { path: 'contact', Component: Contact },
      { path: 'login', Component: Login },
      { path: 'signup', Component: Signup },
      { path: 'checkout', Component: Checkout },
      { path: 'order-success', Component: OrderSuccess },
      { path: 'dashboard', Component: UserDashboard },
      {
        path: 'admin',
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: 'login', Component: AdminLogin },
        ],
      },
      { path: '*', Component: NotFound },
    ],
  },
])
