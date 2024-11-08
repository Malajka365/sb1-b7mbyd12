import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import MainPage from './components/MainPage';
import CategoryGallery from './components/CategoryGallery';
import UploadPage from './components/UploadPage';
import ManageVideosPage from './components/ManageVideosPage';
import TagManagementPage from './components/TagManagementPage';
import VideoPage from './components/VideoPage';
import RegistrationPage from './components/auth/RegistrationPage';
import LoginPage from './components/auth/LoginPage';
import DashboardPage from './components/dashboard/DashboardPage';
import MyGalleriesPage from './components/dashboard/MyGalleriesPage';
import CreateGalleryPage from './components/dashboard/CreateGalleryPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/galleries" element={
              <ProtectedRoute>
                <MyGalleriesPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/create" element={
              <ProtectedRoute>
                <CreateGalleryPage />
              </ProtectedRoute>
            } />
            
            {/* Gallery Routes */}
            <Route path="/:category" element={<CategoryGallery />} />
            <Route path="/:category/video/:id" element={<VideoPage />} />
            <Route path="/:category/upload" element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            } />
            <Route path="/:category/manage" element={
              <ProtectedRoute>
                <ManageVideosPage />
              </ProtectedRoute>
            } />
            <Route path="/:category/tags" element={
              <ProtectedRoute>
                <TagManagementPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;