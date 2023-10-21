import { createBrowserRouter, Route, RouterProvider } from 'react-router-dom'
import LayoutHome from './pages/public/_layout/LayoutHome'
import PageHome from './pages/public/home/PageHome'
import { Toaster } from './cn/components/ui/toaster'
import PageKamar from './pages/public/kamar/PageKamar'
import PageLogin from './pages/public/login/PageLogin'
import PageCustomerDashboard from './pages/customer/dashboard/PageCustomerDashboard'
import LayoutCustomer from './pages/customer/_layout/LayoutCustomer'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutHome />,
    children: [
      { index: true, element: <PageHome /> },
      { path: "/kamar/:id", element: <PageKamar /> },
      { path: "/login", element: <PageLogin /> }
    ]
  },
  {
    path: "/customer",
    element: <LayoutCustomer />,
    children: [
      { index: true, element: <PageCustomerDashboard /> }
    ]
  }
])

export default function App() {
  return <>
    <RouterProvider router={router} />
    <Toaster />
  </>
}
