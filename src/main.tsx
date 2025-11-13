import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { AddRpcPage } from '@/pages/AddRpcPage';
import { ReviewPage } from '@/pages/ReviewPage';
import { SuccessPage } from '@/pages/SuccessPage';
import { Toaster } from '@/components/ui/sonner';

// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddRpcPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="*" element={<RouteErrorBoundary />} />
        </Routes>
        <Toaster richColors />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)