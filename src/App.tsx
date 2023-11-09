import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LayoutHome from './pages/public/_layout/LayoutHome'
import PageHome from './pages/public/home/PageHome'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import PageDetailKamar from './pages/public/kamar/PageDetailKamar'
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
import PageKamar from './pages/admin/kamar/PageKamar'
import PageFasilitas from './pages/admin/fasilitas/PageFasilitas'
import PageSeasonTarif from './pages/admin/season-tarif/PageSeasonTarif'
import PageCustomerGroup from './pages/admin/customer-group/PageCustomerGroup'
import PageReservasiCG from './pages/admin/customer-group/reservasi/PageReservasiCG'
import PageRoomSearch from './pages/public/room-search/PageRoomSearch'
import PageBookingStep1 from './pages/customer/booking/step1/PageBookingStep1'
import LayoutBookingHeader from './pages/customer/booking/LayoutBookingHeader'
import PageBookingStep2 from './pages/customer/booking/step2/PageBookingStep2'
import PageBookingStep3 from './pages/customer/booking/step3/PageBookingStep3'
import PageBookingStep4 from './pages/customer/booking/step4/PageBookingStep4'
import PageRoomSearchCG from './pages/admin/customer-group/reservasi/new/PageRoomSearchCG'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutHome />,
    children: [
      { index: true, element: <PageHome /> },
      { path: "kamar/:id", element: <PageDetailKamar /> },
      { path: "search", element: <PageRoomSearch /> },
      { path: "", element: <UnauthenticatedMiddleware />, children: [
        { path: "login", element: <PageLogin /> },
        { path: "register", element: <PageRegister /> },
        { path: "verification", element: <PageEmailVerification /> },
        { path: "reset-password", element: <PageResetPassword /> },
        { path: "change-password", element: <PageChangePassword />}
      ]}
    ],
    errorElement: <>404</>
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
    path: "booking/:id",
    element: <LayoutBookingHeader />,
    children: [
      { path: "step-1", element: <PageBookingStep1 /> },
      { path: "step-2", element: <PageBookingStep2 /> },
      { path: "step-3", element: <PageBookingStep3 /> },
      { path: "step-4", element: <PageBookingStep4 /> },
    ]
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <>Selamat datang. Silakan langsung ke <em>navigation drawer</em> untuk melihat semua menu yang tersedia.</> },
      { path: "kamar", element: <PageKamar /> },
      { path: "fasilitas", element: <PageFasilitas /> },
      { path: "season", element: <PageSeasonTarif /> },
      { path: "cg", element: <PageCustomerGroup /> },
      { path: "cg/:id", element: <PageReservasiCG /> },
      { path: "cg/:id/new", element: <PageRoomSearchCG /> }
    ]
  }
])

export default function App() {
  return <>
    <RouterProvider router={router} />
    <ToastContainer theme={"light"} />
  </>
}
