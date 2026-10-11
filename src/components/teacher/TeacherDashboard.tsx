import React, { useState } from 'react';
import { Course, Classroom, User } from '../../types';
import { storage, StudentRecord } from '../../services/storageService';
import { sounds } from '../../services/soundEffects';
import { ModuleEditor } from './ModuleEditor';
import { CardinalAvatarRenderer } from '../avatar/CardinalAvatarRenderer';
import {
  Users,
  BookOpen,
  Plus,
  Share2,
  Copy,
  Check,
  Flame,
  Zap,
  CheckCircle2,
  Search,
  Filter,
  GraduationCap,
  UserPlus,
  Wifi
} from 'lucide-react';

interface TeacherDashboardProps {
  user: User;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'editor' | 'classrooms'>('roster');
  const [courses, setCourses] = useState<Course[]>(storage.getCourses());
  const [classrooms, setClassrooms] = useState<Classroom[]>(storage.getClassrooms());
  const [selectedClassCode, setSelectedClassCode] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal states for classrooms
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassCourseId, setNewClassCourseId] = useState(courses[0]?.id || 'course-wayuu-en');

  const [showInviteTeacherModal, setShowInviteTeacherModal] = useState(false);
  const [inviteClassId, setInviteClassId] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');

  const students = storage.getStudentsRoster(selectedClassCode === 'ALL' ? undefined : selectedClassCode);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Copy code helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    sounds.playPop();
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Create new classroom
  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    storage.createClassroom(newClassName.trim(), newClassCourseId, user);
    setClassrooms(storage.getClassrooms());
    setNewClassName('');
    setShowCreateClassModal(false);
    sounds.playCorrect();
  };

  // Invite co-teacher collaborator
  const handleInviteCoTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim() || !inviteClassId) return;

    storage.addCoTeacher(inviteClassId, inviteEmail.trim(), inviteName.trim());
    setClassrooms(storage.getClassrooms());
    setCourses(storage.getCourses());
    setInviteEmail('');
    setInviteName('');
    setShowInviteTeacherModal(false);
    sounds.playCorrect();
  };



  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner: Teacher Greeting & Tab Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 font-semibold text-xs rounded-full mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Portal Docente Wayuuglish · Guajira Bilingüe</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Panel de Gestión y Seguimiento
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Profesor: <strong>{user.name}</strong> · Administra estudiantes, códigos de aula y cursos colaborativos.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'roster'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Seguimiento de Estudiantes</span>
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'editor'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-rose-600" />
            <span>Editor de Módulos</span>
          </button>
          <button
            onClick={() => setActiveTab('classrooms')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'classrooms'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-4 h-4 text-sky-600" />
            <span>Aulas & Códigos</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: STUDENT ROSTER & ANALYTICS --- */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-400 uppercase">Estudiantes Activos</div>
              <div className="font-display font-extrabold text-2xl text-slate-900 mt-1">
                {filteredStudents.length}
              </div>
              <div className="text-xs text-emerald-600 font-medium mt-1">En aulas de La Guajira</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-400 uppercase">Racha Promedio</div>
              <div className="font-display font-extrabold text-2xl text-amber-600 mt-1 flex items-center gap-1.5">
                <Flame className="w-6 h-6 fill-amber-500 text-amber-600" />
                <span>
                  {filteredStudents.length > 0
                    ? Math.round(filteredStudents.reduce((acc, s) => acc + s.streak, 0) / filteredStudents.length)
                    : 0}{' '}
                  días
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Constancia diaria</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-400 uppercase">XP Acumulado Clase</div>
              <div className="font-display font-extrabold text-2xl text-sky-600 mt-1 flex items-center gap-1.5">
                <Zap className="w-6 h-6 fill-sky-500 text-sky-600" />
                <span>{filteredStudents.reduce((acc, s) => acc + s.xp, 0)} XP</span>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Puntos de aprendizaje</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-400 uppercase">Estado Offline/Sync</div>
              <div className="font-display font-extrabold text-2xl text-emerald-700 mt-1 flex items-center gap-1.5">
                <Wifi className="w-5 h-5 text-emerald-600" />
                <span>100% Sincronizado</span>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Almacenamiento seguro</div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar estudiante por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-500 font-medium">Filtrar por Aula:</span>
              <select
                value={selectedClassCode}
                onChange={(e) => setSelectedClassCode(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="ALL">Todas las aulas</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-5">Estudiante</th>
                    <th className="py-3.5 px-4">Aula / Código</th>
                    <th className="py-3.5 px-4 text-center">Racha (Días)</th>
                    <th className="py-3.5 px-4 text-center">XP Total</th>
                    <th className="py-3.5 px-4 text-center">Lecciones Aprobadas</th>
                    <th className="py-3.5 px-4">Última Actividad</th>
                    <th className="py-3.5 px-4 text-center">Sync Nube</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                        No se encontraron estudiantes para este filtro.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <CardinalAvatarRenderer
                              avatar={st.avatar}
                              fallbackSeed={{ id: st.id, name: st.name }}
                              size="sm"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{st.name}</div>
                              <div className="text-[11px] text-slate-400">{st.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold text-slate-700">
                          {st.classroomCode}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                            <Flame className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{st.streak}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-sky-600 font-mono">
                          {st.xp} XP
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                            {st.completedLessonsCount} lecciones
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500">
                          {st.lastActive}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Sincronizado</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: INTUITIVE MODULE & COURSE EDITOR --- */}
      {activeTab === 'editor' && (
        <ModuleEditor
          user={user}
          courses={courses}
          onCoursesUpdated={(updated) => setCourses(updated)}
        />
      )}

      {/* --- TAB 3: CLASSROOMS & CODES MANAGEMENT --- */}
      {activeTab === 'classrooms' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">
                Aulas Virtuales y Códigos de Acceso
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Los estudiantes usan estos códigos para registrarse y enlazar su progreso a tu cuaderno de notas.
              </p>
            </div>
            <button
              onClick={() => setShowCreateClassModal(true)}
              className="btn-duo flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nueva Aula</span>
            </button>
          </div>

          {/* Classrooms Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classrooms.map((cls) => {
              const enrolledStudentsCount = storage.getStudentsRoster(cls.code).length;
              const course = courses.find((c) => c.id === cls.courseId);

              return (
                <div key={cls.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-xs font-semibold text-slate-400">
                        Creado: {cls.createdAt}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        {enrolledStudentsCount} {enrolledStudentsCount === 1 ? 'estudiante' : 'estudiantes'}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                      {cls.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Curso vinculado: <strong>{course?.title || 'General'}</strong>
                    </p>

                    {/* Classroom Code Card */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-4 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Código de Estudiante</div>
                        <div className="font-mono font-extrabold text-xl text-rose-600 tracking-wider">
                          {cls.code}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyCode(cls.code)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition active:scale-95 shadow-xs"
                      >
                        {copiedCode === cls.code ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copiar Código</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Co-teachers list */}
                    <div className="text-xs text-slate-600 mb-4">
                      <div className="font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Docentes Colaboradores:</span>
                        <button
                          onClick={() => {
                            setInviteClassId(cls.id);
                            setShowInviteTeacherModal(true);
                          }}
                          className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Invitar colega</span>
                        </button>
                      </div>
                      {cls.coTeachers.length === 0 ? (
                        <div className="text-[11px] text-slate-400 italic">
                          Aún no hay docentes colaboradores invitados en esta aula.
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {cls.coTeachers.map((ct, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 text-[11px] font-medium"
                            >
                              <strong>{ct.name}</strong> ({ct.email})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Profesor titular: {cls.teacherName}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal: Create Classroom */}
          {showCreateClassModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
                <h3 className="font-display font-bold text-base text-slate-900 mb-4">
                  Crear Nueva Aula Virtual
                </h3>
                <form onSubmit={handleCreateClassroom} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Aula o Grado</label>
                    <input
                      type="text"
                      required
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="Ej: I.E. Kamusuchiwo - Grado 8°B"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Curso Asignado</label>
                    <select
                      value={newClassCourseId}
                      onChange={(e) => setNewClassCourseId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.sourceFlag} {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateClassModal(false)}
                      className="flex-1 py-2 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 shadow-xs"
                    >
                      Generar Código y Crear
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal: Invite Co-Teacher */}
          {showInviteTeacherModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
                <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                  Invitar Docente Colaborador
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  El colega invitado podrá seguir a los estudiantes y colaborar en la edición de módulos y lecciones.
                </p>
                <form onSubmit={handleInviteCoTeacher} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo del Colega</label>
                    <input
                      type="text"
                      required
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="Ej: Lic. David Ipuana"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="docente.colega@wayuuglish.edu"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowInviteTeacherModal(false)}
                      className="flex-1 py-2 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 shadow-xs"
                    >
                      Enviar Invitación
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
