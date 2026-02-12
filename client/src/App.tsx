import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DashboardLayout from "@/components/DashboardLayout";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import ContactAdmin from "@/pages/ContactAdmin";
import AdminDashboard from "@/pages/AdminDashboard";
import TeacherDashboard from "@/pages/TeacherDashboard";
import TeacherList from "@/pages/teachers/TeacherList";
import TeacherForm from "@/pages/teachers/TeacherForm";
import ClassList from "@/pages/classes/ClassList";
import ClassForm from "@/pages/classes/ClassForm";
import AttendanceMark from "@/pages/attendance/AttendanceMark";
import ExamList from "@/pages/exams/ExamList";
import ExamForm from "@/pages/exams/ExamForm";
import ExamMarksEntry from "@/pages/exams/ExamMarksEntry";
import StudentDashboard from "@/pages/StudentDashboard";
import StudentList from "@/pages/students/StudentList";
import StudentForm from "@/pages/students/StudentForm";
import SubjectList from "@/pages/subjects/SubjectList";
import SubjectForm from "@/pages/subjects/SubjectForm";
import FeeList from "@/pages/accounting/FeeList";
import FeeGenerator from "@/pages/accounting/FeeGenerator";
import RouteList from "@/pages/transport/RouteList";
import RouteForm from "@/pages/transport/RouteForm";
import RoomList from "@/pages/hostel/RoomList";
import RoomForm from "@/pages/hostel/RoomForm";
import MessageCenter from "@/pages/messages/MessageCenter";
import Settings from "@/pages/settings/Settings";
import ParentDashboard from "@/pages/ParentDashboard";
import PlaceholderPage from "@/components/PlaceholderPage";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import "../assets/css/style.css";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/contact-admin" component={ContactAdmin} />

      {/* Admin Routes */}
      <Route path="/admin">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <AdminDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/admin/students">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <StudentList />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/subjects">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <SubjectList />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/subjects/new">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <SubjectForm />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/subjects/:id">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <SubjectForm />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/classes">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <ClassList />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/classes/new">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <ClassForm />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/classes/:id">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <ClassForm />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/students/new">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <StudentForm />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/students/:id">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <StudentForm />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/teachers">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <TeacherList />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/teachers/new">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <TeacherForm />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/teachers/:id">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <TeacherForm />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/attendance">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <AttendanceMark />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/exams">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <ExamList />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/exams/new">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <ExamForm />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/exams/:id">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <ExamForm />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/fees">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <FeeList />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/fees/generate">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <FeeGenerator />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/transport">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <RouteList />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/transport/new">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <RouteForm />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/transport/:id">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <RouteForm />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/hostel">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <RoomList />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/hostel/new">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <RoomForm />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/hostel/:id">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <RoomForm />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/messages">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <MessageCenter />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout role="admin">
            <Settings />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher">
        <ProtectedRoute requiredRole="teacher">
          <DashboardLayout role="teacher">
            <TeacherDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/teacher/classes">
        <ProtectedRoute requiredRole="teacher">
          <DashboardLayout role="teacher">
            <PlaceholderPage role="teacher" title="My Classes" description="View and manage your assigned classes" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/teacher/attendance">
        <ProtectedRoute requiredRole="teacher">
          <DashboardLayout role="teacher">
            <PlaceholderPage role="teacher" title="Mark Attendance" description="Record student attendance for your classes" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/teacher/marks">
        <ProtectedRoute requiredRole="teacher">
          <DashboardLayout role="teacher">
            <PlaceholderPage role="teacher" title="Marks Management" description="Enter and manage student marks" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/teacher/schedule">
        <ProtectedRoute requiredRole="teacher">
          <DashboardLayout role="teacher">
            <PlaceholderPage role="teacher" title="My Schedule" description="View your teaching schedule" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/teacher/settings">
        <ProtectedRoute requiredRole="teacher">
          <DashboardLayout role="teacher">
            <PlaceholderPage role="teacher" title="Teacher Settings" description="Manage your profile and preferences" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      {/* Student Routes */}
      <Route path="/student">
        <ProtectedRoute requiredRole="student">
          <DashboardLayout role="student">
            <StudentDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/student/schedule">
        <ProtectedRoute requiredRole="student">
          <DashboardLayout role="student">
            <PlaceholderPage role="student" title="My Schedule" description="View your class schedule" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/student/attendance">
        <ProtectedRoute requiredRole="student">
          <DashboardLayout role="student">
            <PlaceholderPage role="student" title="My Attendance" description="View your attendance records" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/student/marks">
        <ProtectedRoute requiredRole="student">
          <DashboardLayout role="student">
            <PlaceholderPage role="student" title="My Marks" description="View your exam marks and grades" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/student/assignments">
        <ProtectedRoute requiredRole="student">
          <DashboardLayout role="student">
            <PlaceholderPage role="student" title="Assignments" description="View and submit your assignments" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/student/settings">
        <ProtectedRoute requiredRole="student">
          <DashboardLayout role="student">
            <PlaceholderPage role="student" title="Student Settings" description="Manage your profile and preferences" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      {/* Parent Routes */}
      <Route path="/parent">
        <ProtectedRoute requiredRole="parent">
          <DashboardLayout role="parent">
            <ParentDashboard />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/parent/children">
        <ProtectedRoute requiredRole="parent">
          <DashboardLayout role="parent">
            <PlaceholderPage role="parent" title="My Children" description="View all your children's profiles" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/parent/performance">
        <ProtectedRoute requiredRole="parent">
          <DashboardLayout role="parent">
            <PlaceholderPage role="parent" title="Performance Overview" description="Track your children's academic performance" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/parent/attendance">
        <ProtectedRoute requiredRole="parent">
          <DashboardLayout role="parent">
            <PlaceholderPage role="parent" title="Attendance Records" description="View your children's attendance" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/parent/fees">
        <ProtectedRoute requiredRole="parent">
          <DashboardLayout role="parent">
            <PlaceholderPage role="parent" title="Fee Management" description="View and pay school fees" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/parent/settings">
        <ProtectedRoute requiredRole="parent">
          <DashboardLayout role="parent">
            <PlaceholderPage role="parent" title="Parent Settings" description="Manage your profile and preferences" />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch >
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
