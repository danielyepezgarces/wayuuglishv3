/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { storage } from './services/storageService';
import { User, Lesson, Course } from './types';
import { WayuuHeader } from './components/WayuuHeader';
import { OfflineSyncBanner } from './components/OfflineSyncBanner';
import { PathMap } from './components/student/PathMap';
import { Leaderboard } from './components/student/Leaderboard';
import { LessonRunner } from './components/student/LessonRunner';
import { JoinClassroomModal } from './components/student/JoinClassroomModal';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { WayuuFooter } from './components/WayuuFooter';
import { AuthModal } from './components/auth/AuthModal';
import { WeeklyActivity } from './components/student/WeeklyActivity';
import { LandingPage } from './components/landing/LandingPage';
import { authService } from './services/authService';
import { Sparkles, Globe, Heart, ShieldCheck, Trophy, Map, Compass } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User>(storage.getUser());
  const [courses, setCourses] = useState<Course[]>(storage.getCourses());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [guestMode, setGuestMode] = useState<boolean>(() => {
    // If the user has explicitly entered as guest before in session or completed lessons
    return localStorage.getItem('wayuuglish_guest_mode') === 'true';
  });
  const [activeLessonSession, setActiveLessonSession] = useState<{
    lesson: Lesson;
    moduleTitle: string;
  } | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authDefaultMode, setAuthDefaultMode] = useState<'login' | 'register'>('login');
  const [studentTab, setStudentTab] = useState<'path' | 'activity' | 'leaderboard'>('path');

  useEffect(() => {
    const unsubStorage = storage.subscribe(() => {
      setUser(storage.getUser());
      setCourses(storage.getCourses());
    });
    const unsubAuth = authService.subscribe((fbUser) => {
      setIsAuthenticated(!!fbUser);
      if (!fbUser) {
        setGuestMode(false);
        localStorage.removeItem('wayuuglish_guest_mode');
      }
    });
    return () => {
      unsubStorage();
      unsubAuth();
    };
  }, []);

  const openAuthWithMode = (mode: 'login' | 'register' = 'login') => {
    setAuthDefaultMode(mode);
    setShowAuthModal(true);
  };

  const handleStartAsGuest = () => {
    setGuestMode(true);
    localStorage.setItem('wayuuglish_guest_mode', 'true');
  };

  const currentCourse =
    courses.find((c) => c.pair === user.currentTrack) || courses[0];

  const handleStartLesson = (lesson: Lesson, moduleTitle: string) => {
    setActiveLessonSession({ lesson, moduleTitle });
  };

  const handleFinishLesson = () => {
    setActiveLessonSession(null);
  };

  const handleQuitLesson = () => {
    setActiveLessonSession(null);
  };

  // If currently running an interactive lesson, render the LessonRunner full-screen view
  if (activeLessonSession) {
    return (
      <LessonRunner
        lesson={activeLessonSession.lesson}
        moduleTitle={activeLessonSession.moduleTitle}
        user={user}
        onFinish={handleFinishLesson}
        onQuit={handleQuitLesson}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1E252B] flex flex-col justify-between">
      <div>
        {/* Offline & Cloud Synchronization Status Banner - Only during active learning session */}
        {(isAuthenticated || guestMode) && <OfflineSyncBanner />}

        {/* Gamified Top Header Bar */}
        <WayuuHeader
          user={user}
          isAuthenticated={isAuthenticated}
          isGuest={guestMode}
          onOpenJoinModal={() => setShowJoinModal(true)}
          onOpenProfileModal={() => setShowProfileModal(true)}
          onOpenAuthModal={(mode) => openAuthWithMode(mode || 'login')}
          onLogoClick={() => {
            if (!isAuthenticated) {
              setGuestMode(false);
              localStorage.removeItem('wayuuglish_guest_mode');
            }
          }}
        />

        {/* Main Content Area: Landing Page (Unauthenticated) or App Portal */}
        <main className="py-2">
          {!isAuthenticated && !guestMode ? (
            <LandingPage
              onOpenAuth={(mode) => openAuthWithMode(mode || 'register')}
              onStartAsGuest={handleStartAsGuest}
              courses={courses}
              currentTrack={user.currentTrack}
              onSelectTrack={(track) => storage.switchTrack(track)}
            />
          ) : user.role === 'student' ? (
            <div>
              {/* Student Mode Sub-Navigation Tabs */}
              <div className="max-w-4xl mx-auto px-4 pt-3 pb-2 flex justify-center">
                <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-xs flex-wrap justify-center gap-1 sm:gap-0">
                  <button
                    onClick={() => setStudentTab('path')}
                    className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                      studentTab === 'path'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-rose-600" />
                    <span>Ruta de Lecciones</span>
                  </button>

                  <button
                    onClick={() => setStudentTab('activity')}
                    className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                      studentTab === 'activity'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <i className="fa-solid fa-chart-column text-xs text-rose-600"></i>
                    <span>Actividad Semanal</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800">
                      7 días
                    </span>
                  </button>

                  <button
                    onClick={() => setStudentTab('leaderboard')}
                    className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                      studentTab === 'leaderboard'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>Tabla de Clasificación</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                      Aula
                    </span>
                  </button>
                </div>
              </div>

              {/* View Switcher */}
              {studentTab === 'path' ? (
                <PathMap
                  course={currentCourse}
                  user={user}
                  onStartLesson={handleStartLesson}
                  onOpenJoinModal={() => setShowJoinModal(true)}
                  onOpenProfileModal={() => setShowProfileModal(true)}
                />
              ) : studentTab === 'activity' ? (
                <div className="max-w-4xl mx-auto px-4 py-6">
                  <WeeklyActivity
                    user={user}
                    onOpenGoalSettings={() => setShowProfileModal(true)}
                  />
                </div>
              ) : (
                <Leaderboard
                  user={user}
                  onOpenJoinModal={() => setShowJoinModal(true)}
                />
              )}
            </div>
          ) : (
            <TeacherDashboard user={user} />
          )}
        </main>
      </div>

      {/* Classroom Code Registration Modal */}
      {showJoinModal && (
        <JoinClassroomModal
          user={user}
          onClose={() => setShowJoinModal(false)}
        />
      )}

      {/* User Profile & Daily Goal Settings Modal */}
      {showProfileModal && (
        <UserProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onOpenJoinModal={() => setShowJoinModal(true)}
          onOpenAuthModal={() => setShowAuthModal(true)}
        />
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode={authDefaultMode}
          onSuccess={() => {
            setGuestMode(false);
            localStorage.removeItem('wayuuglish_guest_mode');
          }}
        />
      )}

      {/* Cultural & Institutional Footer */}
      <WayuuFooter
        user={user}
        isAuthenticated={isAuthenticated}
        isGuest={guestMode}
        onOpenAuth={(mode) => openAuthWithMode(mode || 'register')}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenJoinModal={() => setShowJoinModal(true)}
        onSelectTrack={(track) => storage.switchTrack(track)}
      />
    </div>
  );
}
