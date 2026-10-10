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
import { LessonRunner } from './components/student/LessonRunner';
import { JoinClassroomModal } from './components/student/JoinClassroomModal';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { Sparkles, Globe, Heart, ShieldCheck } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User>(storage.getUser());
  const [courses, setCourses] = useState<Course[]>(storage.getCourses());
  const [activeLessonSession, setActiveLessonSession] = useState<{
    lesson: Lesson;
    moduleTitle: string;
  } | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setUser(storage.getUser());
      setCourses(storage.getCourses());
    });
    return unsubscribe;
  }, []);

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
        {/* Offline & Cloud Synchronization Status Banner */}
        <OfflineSyncBanner />

        {/* Gamified Top Header Bar */}
        <WayuuHeader
          user={user}
          onOpenJoinModal={() => setShowJoinModal(true)}
        />

        {/* Main Content Area: Student View or Teacher Portal */}
        <main className="py-2">
          {user.role === 'student' ? (
            <PathMap
              course={currentCourse}
              user={user}
              onStartLesson={handleStartLesson}
              onOpenJoinModal={() => setShowJoinModal(true)}
            />
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

      {/* Cultural & Institutional Footer */}
      <footer className="mt-16 border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold text-slate-800 text-sm">
            <span>Wayuuglish</span>
            <span className="text-slate-300">·</span>
            <span className="text-rose-600 font-semibold text-xs">Wounmain Bilingüe</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Soporte Offline-First para La Guajira</span>
            <span>·</span>
            <span>4 Pares Lingüísticos</span>
            <span>·</span>
            <span>Sincronización Automática</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Preservando la sabiduría Wayuu con tecnología accesible.
          </div>
        </div>
      </footer>
    </div>
  );
}
