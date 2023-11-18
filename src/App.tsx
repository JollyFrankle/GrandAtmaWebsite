import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import GeneralLoadingDialog from './components/GeneralLoadingDialog';

// Dynamic import
const LayoutHome = lazy(() => import('./pages/public/_layout/LayoutHome'));
const PageHome = lazy(() => import('./pages/public/home/PageHome'));
const PageDetailKamar = lazy(() => import('./pages/public/kamar/PageDetailKamar'));
const PageLogin = lazy(() => import('./pages/public/unauthenticated_only/login/PageLogin'));
const PageCustomerDashboard = lazy(() => import('./pages/customer/dashboard/PageCustomerDashboard'));
const LayoutCustomer = lazy(() => import('./pages/customer/_layout/LayoutCustomer'));
const PageProfileCustomer = lazy(() => import('./pages/customer/profile/PageProfileCustomer'));
const PageRegister = lazy(() => import('./pages/public/unauthenticated_only/register/PageRegister'));
const PageEmailVerification = lazy(() => import('./pages/public/unauthenticated_only/email-verif/PageEmailVerification'));
const PageResetPassword = lazy(() => import('./pages/public/unauthenticated_only/reset-password/PageResetPassword'));
const PageChangePassword = lazy(() => import('./pages/public/unauthenticated_only/reset-password/PageChangePassword'));
const UnauthenticatedMiddleware = lazy(() => import('./pages/public/unauthenticated_only/UnauthenticatedMiddleware'));
const LayoutAdmin = lazy(() => import('./pages/admin/_layout/LayoutAdmin'));
const PageDashboard = lazy(() => import('./pages/admin/dashboard/PageDashboard'));
const PageKamar = lazy(() => import('./pages/admin/kamar/PageKamar'));
const PageFasilitas = lazy(() => import('./pages/admin/fasilitas/PageFasilitas'));
const PageSeasonTarif = lazy(() => import('./pages/admin/season-tarif/PageSeasonTarif'));
const PageCustomerGroup = lazy(() => import('./pages/admin/customer-group/PageCustomerGroup'));
const PageReservasiCG = lazy(() => import('./pages/admin/customer-group/reservasi/PageReservasiCG'));
const PageRoomSearch = lazy(() => import('./pages/public/room-search/PageRoomSearch'));
const PageBookingStep1 = lazy(() => import('./pages/customer/booking/step1/PageBookingStep1'));
const LayoutBookingHeader = lazy(() => import('./pages/customer/booking/LayoutBookingHeader'));
const PageBookingStep2 = lazy(() => import('./pages/customer/booking/step2/PageBookingStep2'));
const PageBookingStep3 = lazy(() => import('./pages/customer/booking/step3/PageBookingStep3'));
const PageBookingStep4 = lazy(() => import('./pages/customer/booking/step4/PageBookingStep4'));
const PageRoomSearchCG = lazy(() => import('./pages/admin/customer-group/reservasi/new/PageRoomSearchCG'));
const PageAllUpomingReservasiCG = lazy(() => import('./pages/admin/customer-group/all-upcoming-reservasi/PageAllUpomingReservasiCG'));
const PageUserPegawai = lazy(() => import('./pages/admin/users/PageUserPegawai'));

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
        { path: "change-password", element: <PageChangePassword /> }
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
    path: "booking/:idC/:idR",
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
      { index: true, element: <PageDashboard /> },
      { path: "kamar", element: <PageKamar /> },
      { path: "fasilitas", element: <PageFasilitas /> },
      { path: "season", element: <PageSeasonTarif /> },
      { path: "cg", element: <PageCustomerGroup /> },
      { path: "cg/:id", element: <PageReservasiCG /> },
      { path: "cg/:id/new", element: <PageRoomSearchCG /> },
      { path: "reservasi", element: <PageAllUpomingReservasiCG /> },
      { path: "user-p", element: <PageUserPegawai /> }
    ]
  }
])

export default function App() {
  return <>
    <Suspense fallback={<GeneralLoadingDialog show={true} />}>
      <RouterProvider router={router} />
    </Suspense>
    <ToastContainer className="text-bold" theme={"light"} />
  </>
}
