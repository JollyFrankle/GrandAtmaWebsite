import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LayoutHome from './pages/public/_layout/LayoutHome'
import PageHome from './pages/public/home/PageHome'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import PageKamar from './pages/public/kamar/PageKamar'
import PageLogin from './pages/public/login/PageLogin'
import PageCustomerDashboard from './pages/customer/dashboard/PageCustomerDashboard'
import LayoutCustomer from './pages/customer/_layout/LayoutCustomer'
import PageProfileCustomer from './pages/customer/profile/PageProfileCustomer'
import PageRegister from './pages/public/register/PageRegister'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutHome />,
    children: [
      { index: true, element: <PageHome /> },
      { path: "kamar/:id", element: <PageKamar /> },
      { path: "login", element: <PageLogin /> },
      { path: "register", element: <PageRegister /> }
    ]
  },
  {
    path: "/customer",
    element: <LayoutCustomer />,
    children: [
      { index: true, element: <PageCustomerDashboard /> },
      { path: "profile", element: <PageProfileCustomer /> }
    ]
  }
])

export default function App() {
  return <>
    <RouterProvider router={router} />
    <ToastContainer theme={"light"} />
  </>
}
