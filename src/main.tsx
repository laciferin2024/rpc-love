import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { AddRpcPage } from '@/pages/AddRpcPage';
import { ReviewPage } from '@/pages/ReviewPage';
import { SuccessPage } from '@/pages/SuccessPage';
import { Toaster } from '@/components/ui/sonner';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/add",
    element: <AddRpcPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/review",
    element: <ReviewPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/success",
    element: <SuccessPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster richColors />
    </ErrorBoundary>
  </StrictMode>,
)