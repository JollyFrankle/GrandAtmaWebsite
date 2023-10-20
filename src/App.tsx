import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LayoutHome from './pages/public/_layout/LayoutHome'
import PageHome from './pages/public/home/PageHome'
import { Toaster } from './cn/components/ui/toaster'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutHome />,
    children: [
      { index: true, element: <PageHome /> },
    ]
  }
])

export default function App() {
  return <>
    <RouterProvider router={router} />
    <Toaster />
  </>
}
