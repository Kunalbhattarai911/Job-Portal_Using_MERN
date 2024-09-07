import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import UpdateJobPage from './components/admin/UpdateJobPage'
import RejectedTable from './components/admin/RejectedTable'
import AcceptedTable from './components/admin/AcceptedTable'
import PendingTable from './components/admin/PendingTable'
import Dashboard from './components/admin/RecruiterDashboard'
import SavedJobs from './components/SaveForLaterPage'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/saveForLater",
    element: <SavedJobs />
  },
  // Admin routes
  {
    path:"/admin/dashboard",
    element: <ProtectedRoute><Dashboard/></ProtectedRoute>
  },
  {
    path:"/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/update/:id",  
    element:<ProtectedRoute><UpdateJobPage/></ProtectedRoute>
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Applicants/></ProtectedRoute> 
  },
  {
    path: "/admin/jobs/:id/applicants/pending",
    element: <ProtectedRoute><PendingTable /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants/accepted",
    element: <ProtectedRoute><AcceptedTable /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants/rejected",
    element: <ProtectedRoute><RejectedTable/></ProtectedRoute>
  }
])

function App() {

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
