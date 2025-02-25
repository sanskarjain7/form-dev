import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { FormBuilder } from './pages/FormBuilder'
import { FormRenderer } from './pages/FormRenderer'
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <FormBuilder />,
  },
  {
    path: '/form/:formId',
    element: <FormRenderer />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="top-right" />
    <RouterProvider router={router} />
  </StrictMode>,
)
