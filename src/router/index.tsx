import { createBrowserRouter } from 'react-router-dom';
import { LandingLayout } from '@/components/layout/LandingLayout';
import { Hero } from '@/components/ui/Hero';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Dashboard } from '@/pages/Dashboard';
import { TrainingZone } from '@/features/modules/components/TrainingZone';
import { ModuleDetail } from '@/features/modules/components/ModuleDetail';
import { Reports } from '@/pages/Reports';
import { ReportDetail } from '@/pages/ReportDetail';
import { Login } from '@/pages/Login';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Settings } from '@/pages/Settings';
import { HelpCenter } from '@/pages/HelpCenter';
import { Simulation } from '@/pages/Simulation';
import { CareerCoach } from '@/pages/CareerCoach';
import { ResumeBuilderPage } from '@/pages/ResumeBuilderPage';
import { ProductTraining } from '@/pages/ProductTraining';
import { MockInterview } from '@/pages/MockInterview';
import { InterviewReport } from '@/pages/InterviewReport';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: (
          <main className="h-full">
            <Hero />
          </main>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'training',
            element: <TrainingZone />,
          },
          {
            path: 'training/:moduleId',
            element: <ModuleDetail />,
          },
          {
            path: 'reports',
            element: <Reports />,
          },
          {
            path: 'reports/:reportId',
            element: <ReportDetail />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
          {
            path: 'help',
            element: <HelpCenter />,
          },
          {
            path: 'career-coach',
            element: <CareerCoach />,
          },
          {
            path: 'career-coach/builder',
            element: <ResumeBuilderPage />,
          },
          {
            path: 'career-coach/interview',
            element: <MockInterview />,
          },
          {
            path: 'career-coach/report',
            element: <InterviewReport />,
          },
          {
            path: 'product-training',
            element: <ProductTraining />,
          },
        ],
      },
      {
        path: 'simulation/:moduleId',
        element: <Simulation />
      }
    ],
  },
  {
    path: '/admin',
    element: <AdminLogin />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
  },
]);
