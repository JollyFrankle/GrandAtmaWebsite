import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import "./App.css"

import GeneralLoadingDialog from './components/loading/GeneralLoadingDialog';
import PageHome from './pages/public/home/PageHome';
import PageDetailKamar from './pages/public/kamar/PageDetailKamar';
import PageRoomSearch from './pages/public/room-search/PageRoomSearch';
import UnauthenticatedMiddleware from './pages/public/unauthenticated_only/UnauthenticatedMiddleware';
import PageLogin from './pages/public/unauthenticated_only/login/PageLogin';
import PageRegister from './pages/public/unauthenticated_only/register/PageRegister';
import PageEmailVerification from './pages/public/unauthenticated_only/email-verif/PageEmailVerification';
import PageResetPassword from './pages/public/unauthenticated_only/reset-password/PageResetPassword';
import PageChangePassword from './pages/public/unauthenticated_only/reset-password/PageChangePassword';
import PageCustomerDashboard from './pages/customer/dashboard/PageCustomerDashboard';
import PageProfileCustomer from './pages/customer/profile/PageProfileCustomer';
import PageBookingStep1 from './pages/customer/booking/step1/PageBookingStep1';
import PageBookingStep2 from './pages/customer/booking/step2/PageBookingStep2';
import PageBookingStep3 from './pages/customer/booking/step3/PageBookingStep3';
import PageBookingStep4 from './pages/customer/booking/step4/PageBookingStep4';
import PageDashboard from './pages/admin/dashboard/PageDashboard';
import PageKamar from './pages/admin/kamar/PageKamar';
import PageFasilitas from './pages/admin/fasilitas/PageFasilitas';
import PageSeasonTarif from './pages/admin/season-tarif/PageSeasonTarif';
import PageCustomerGroup from './pages/admin/customer-group/PageCustomerGroup';
import PageReservasiCG from './pages/admin/customer-group/reservasi/PageReservasiCG';
import PageRoomSearchCG from './pages/admin/customer-group/reservasi/new/PageRoomSearchCG';
import PageAllUpomingReservasiCG from './pages/admin/customer-group/all-upcoming-reservasi/PageAllUpomingReservasiCG';
import PageUserPegawai from './pages/admin/users/PageUserPegawai';
import PageTrxCICO from './pages/admin/trx-cico/PageTrxCiCO';
import PageLaporan from './pages/admin/laporan/PageLaporan';

// Dynamic import
const LayoutHome = lazy(() => import('./pages/public/_layout/LayoutHome'));
const LayoutCustomer = lazy(() => import('./pages/customer/_layout/LayoutCustomer'));
const LayoutAdmin = lazy(() => import('./pages/admin/_layout/LayoutAdmin'));
const LayoutBookingHeader = lazy(() => import('./pages/customer/booking/LayoutBookingHeader'));

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
      { path: "user-p", element: <PageUserPegawai /> },
      { path: "trx-cico", element: <PageTrxCICO /> },
      { path: "laporan/:nomor", element: <PageLaporan /> }
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
