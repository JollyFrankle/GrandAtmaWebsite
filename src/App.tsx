import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LayoutHome from './pages/public/_layout/LayoutHome'
import PageHome from './pages/public/home/PageHome'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import PageKamar from './pages/public/kamar/PageKamar'
import PageLogin from './pages/public/unauthenticated_only/login/PageLogin'
import PageCustomerDashboard from './pages/customer/dashboard/PageCustomerDashboard'
import LayoutCustomer from './pages/customer/_layout/LayoutCustomer'
import PageProfileCustomer from './pages/customer/profile/PageProfileCustomer'
import PageRegister from './pages/public/unauthenticated_only/register/PageRegister'
import PageEmailVerification from './pages/public/unauthenticated_only/email-verif/PageEmailVerification'
import PageResetPassword from './pages/public/unauthenticated_only/reset-password/PageResetPassword'
import PageChangePassword from './pages/public/unauthenticated_only/reset-password/PageChangePassword'
import UnauthenticatedMiddleware from './pages/public/unauthenticated_only/UnauthenticatedMiddleware'
import LayoutAdmin from './pages/admin/_layout/LayoutAdmin'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutHome />,
    children: [
      { index: true, element: <PageHome /> },
      { path: "kamar/:id", element: <PageKamar /> },
      { path: "", element: <UnauthenticatedMiddleware />, children: [
        { path: "login", element: <PageLogin /> },
        { path: "register", element: <PageRegister /> },
        { path: "verification", element: <PageEmailVerification /> },
        { path: "reset-password", element: <PageResetPassword /> },
        { path: "change-password", element: <PageChangePassword />}
      ]}
    ]
  },
  {
    path: "/customer",
    element: <LayoutCustomer />,
    children: [
      { index: true, element: <PageCustomerDashboard /> },
      { path: "profile", element: <PageProfileCustomer /> }
    ]
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <>SULING</> },
    ]
  }
])

export default function App() {
  return <>
    <RouterProvider router={router} />
    <ToastContainer theme={"light"} />
  </>
}
