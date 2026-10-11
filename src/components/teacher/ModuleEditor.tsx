import React, { useState } from 'react';
import { Course, Module, Lesson, Exercise, ExerciseType, User } from '../../types';
import { storage } from '../../services/storageService';
import { sounds } from '../../services/soundEffects';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Check,
  ChevronDown,
  ChevronRight,
  Volume2,
  Sparkles,
  HelpCircle,
  Layers,
  Wand2,
  CheckCircle2,
  X,
  Type,
  List,
  Columns,
  Mic,
  FileText
} from 'lucide-react';

interface ModuleEditorProps {
  user: User;
  courses: Course[];
  onCoursesUpdated: (updatedCourses: Course[]) => void;
}

export const ModuleEditor: React.FC<ModuleEditorProps> = ({
  user,
  courses,
  onCoursesUpdated
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});

  // Modals
  const [editingModule, setEditingModule] = useState<{ id?: string; title: string; description: string } | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; id?: string; title: string; description: string; xpReward: number } | null>(null);
  const [editingExercise, setEditingExercise] = useState<{
    moduleId: string;
    lessonId: string;
    exercise: Partial<Exercise>;
  } | null>(null);

  // Quick Vocabulary Generator Wizard
  const [showVocabWizard, setShowVocabWizard] = useState(false);
  const [wizardModuleId, setWizardModuleId] = useState<string>('');
  const [wizardLessonTitle, setWizardLessonTitle] = useState('');
  const [vocabPairs, setVocabPairs] = useState<{ term: string; translation: string; phonetic: string }[]>([
    { term: '', translation: '', phonetic: '' },
    { term: '', translation: '', phonetic: '' },
    { term: '', translation: '', phonetic: '' }
  ]);

  // Live Exercise Preview modal
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);
  const [previewAnswer, setPreviewAnswer] = useState<string | null>(null);
  const [previewFeedback, setPreviewFeedback] = useState<'correct' | 'wrong' | null>(null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const toggleModule = (modId: string) => {
    sounds.playPop();
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const toggleLesson = (lsnId: string) => {
    sounds.playPop();
    setExpandedLessons((prev) => ({ ...prev, [lsnId]: !prev[lsnId] }));
  };

  // --- SAVE MODULE ---
  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule || !editingModule.title.trim() || !selectedCourse) return;

    const courseCopy = { ...selectedCourse };
    if (editingModule.id) {
      // Edit existing
      courseCopy.modules = courseCopy.modules.map((m) =>
        m.id === editingModule.id
          ? { ...m, title: editingModule.title.trim(), description: editingModule.description.trim() }
          : m
      );
    } else {
      // Add new
      const newMod: Module = {
        id: `mod-custom-${Date.now()}`,
        title: editingModule.title.trim(),
        description: editingModule.description.trim(),
        level: courseCopy.modules.length + 1,
        lessons: []
      };
      courseCopy.modules.push(newMod);
      setExpandedModules((prev) => ({ ...prev, [newMod.id]: true }));
    }

    storage.saveCourse(courseCopy);
    onCoursesUpdated(storage.getCourses());
    setEditingModule(null);
    sounds.playCorrect();
  };

  // --- DELETE MODULE ---
  const handleDeleteModule = (moduleId: string) => {
    if (!selectedCourse || !window.confirm('¿Estás seguro de eliminar esta unidad y todas sus lecciones?')) return;
    const courseCopy = { ...selectedCourse };
    courseCopy.modules = courseCopy.modules.filter((m) => m.id !== moduleId);
    storage.saveCourse(courseCopy);
    onCoursesUpdated(storage.getCourses());
    sounds.playPop();
  };

  // --- SAVE LESSON ---
  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson || !editingLesson.title.trim() || !selectedCourse) return;

    const courseCopy = { ...selectedCourse };
    const mod = courseCopy.modules.find((m) => m.id === editingLesson.moduleId);
    if (!mod) return;

    if (editingLesson.id) {
      // Edit existing
      mod.lessons = mod.lessons.map((l) =>
        l.id === editingLesson.id
          ? {
              ...l,
              title: editingLesson.title.trim(),
              description: editingLesson.description.trim(),
              xpReward: Number(editingLesson.xpReward) || 20
            }
          : l
      );
    } else {
      // Add new lesson
      const newLsn: Lesson = {
        id: `les-custom-${Date.now()}`,
        title: editingLesson.title.trim(),
        description: editingLesson.description.trim(),
        xpReward: Number(editingLesson.xpReward) || 20,
        exercises: []
      };
      mod.lessons.push(newLsn);
      setExpandedLessons((prev) => ({ ...prev, [newLsn.id]: true }));
    }

    storage.saveCourse(courseCopy);
    onCoursesUpdated(storage.getCourses());
    setEditingLesson(null);
    sounds.playCorrect();
  };

  // --- DELETE LESSON ---
  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    if (!selectedCourse || !window.confirm('¿Deseas eliminar esta lección?')) return;
    const courseCopy = { ...selectedCourse };
    const mod = courseCopy.modules.find((m) => m.id === moduleId);
    if (mod) {
      mod.lessons = mod.lessons.filter((l) => l.id !== lessonId);
      storage.saveCourse(courseCopy);
      onCoursesUpdated(storage.getCourses());
      sounds.playPop();
    }
  };

  // --- SAVE EXERCISE ---
  const handleSaveExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExercise || !editingExercise.exercise.prompt || !selectedCourse) return;

    const courseCopy = { ...selectedCourse };
    const mod = courseCopy.modules.find((m) => m.id === editingExercise.moduleId);
    if (!mod) return;
    const lsn = mod.lessons.find((l) => l.id === editingExercise.lessonId);
    if (!lsn) return;

    const exData: Exercise = {
      id: editingExercise.exercise.id || `ex-${Date.now()}`,
      type: editingExercise.exercise.type || 'choice',
      prompt: editingExercise.exercise.prompt.trim(),
      instruction: editingExercise.exercise.instruction?.trim() || 'Selecciona la respuesta correcta',
      options: editingExercise.exercise.options || [],
      wordBank: editingExercise.exercise.wordBank || [],
      correctSolution: editingExercise.exercise.correctSolution || '',
      phoneticGuide: editingExercise.exercise.phoneticGuide?.trim() || '',
      culturalNote: editingExercise.exercise.culturalNote?.trim() || '',
      audioText: editingExercise.exercise.audioText?.trim() || editingExercise.exercise.prompt.trim(),
      audioLang: editingExercise.exercise.audioLang || 'es'
    };

    if (editingExercise.exercise.id) {
      lsn.exercises = lsn.exercises.map((x) => (x.id === editingExercise.exercise.id ? exData : x));
    } else {
      lsn.exercises.push(exData);
    }

    storage.saveCourse(courseCopy);
    onCoursesUpdated(storage.getCourses());
    setEditingExercise(null);
    sounds.playCorrect();
  };

  // --- DELETE EXERCISE ---
  const handleDeleteExercise = (moduleId: string, lessonId: string, exerciseId: string) => {
    if (!selectedCourse || !window.confirm('¿Eliminar este ejercicio?')) return;
    const courseCopy = { ...selectedCourse };
    const mod = courseCopy.modules.find((m) => m.id === moduleId);
    if (mod) {
      const lsn = mod.lessons.find((l) => l.id === lessonId);
      if (lsn) {
        lsn.exercises = lsn.exercises.filter((x) => x.id !== exerciseId);
        storage.saveCourse(courseCopy);
        onCoursesUpdated(storage.getCourses());
        sounds.playPop();
      }
    }
  };

  // --- VOCABULARY WIZARD GENERATOR ---
  const handleGenerateFromVocab = (e: React.FormEvent) => {
    e.preventDefault();
    const validPairs = vocabPairs.filter((p) => p.term.trim() && p.translation.trim());
    if (validPairs.length === 0 || !wizardModuleId || !selectedCourse) return;

    const courseCopy = { ...selectedCourse };
    const mod = courseCopy.modules.find((m) => m.id === wizardModuleId);
    if (!mod) return;

    const lessonId = `les-wizard-${Date.now()}`;
    const generatedExercises: Exercise[] = [];

    // 1. Multiple choice exercises for each term
    validPairs.forEach((pair, idx) => {
      const distractors = validPairs.filter((_, i) => i !== idx).map((p) => p.translation);
      const options = [pair.translation, ...distractors, 'Otra palabra'].slice(0, 4);
      // shuffle
      options.sort(() => 0.5 - Math.random());

      generatedExercises.push({
        id: `ex-wz-${Date.now()}-${idx}-1`,
        type: 'choice',
        prompt: `¿Qué significa "${pair.term}"?`,
        instruction: 'Selecciona la traducción correcta',
        options,
        correctSolution: pair.translation,
        phoneticGuide: pair.phonetic || undefined,
        audioText: pair.term,
        audioLang: selectedCourse.sourceLang === 'Wayuunaiki' ? 'wayuu' : 'es'
      });
    });

    // 2. Matching card exercise if 2 or more pairs
    if (validPairs.length >= 2) {
      const matchOpts = validPairs.map((p) => `${p.term}:${p.translation}`);
      generatedExercises.push({
        id: `ex-wz-${Date.now()}-match`,
        type: 'match',
        prompt: 'Empareja cada palabra con su significado correcto',
        instruction: 'Toca las fichas de ambas columnas para emparejar',
        options: matchOpts,
        correctSolution: matchOpts.join(',')
      });
    }

    // 3. Word bank exercise for first term
    if (validPairs[0]) {
      const p = validPairs[0];
      const words = p.translation.split(' ');
      const extraWords = ['el', 'agua', 'sol', 'muy', 'bueno'];
      const wordBank = [...words, ...extraWords.slice(0, 3)].sort(() => 0.5 - Math.random());

      generatedExercises.push({
        id: `ex-wz-${Date.now()}-wb`,
        type: 'word-bank',
        prompt: `Traduce al idioma destino: "${p.term}"`,
        instruction: 'Ordena las palabras en el orden correcto',
        wordBank,
        correctSolution: p.translation,
        phoneticGuide: p.phonetic || undefined
      });
    }

    const newLesson: Lesson = {
      id: lessonId,
      title: wizardLessonTitle.trim() || `Vocabulario: ${validPairs[0].term}`,
      description: `Aprende y practica ${validPairs.length} palabras clave con pronunciación`,
      xpReward: 20,
      exercises: generatedExercises
    };

    mod.lessons.push(newLesson);
    setExpandedLessons((prev) => ({ ...prev, [newLesson.id]: true }));

    storage.saveCourse(courseCopy);
    onCoursesUpdated(storage.getCourses());
    setShowVocabWizard(false);
    setWizardLessonTitle('');
    setVocabPairs([
      { term: '', translation: '', phonetic: '' },
      { term: '', translation: '', phonetic: '' },
      { term: '', translation: '', phonetic: '' }
    ]);
    sounds.playComplete();
  };

  const handleTestPreview = (ex: Exercise) => {
    setPreviewExercise(ex);
    setPreviewAnswer(null);
    setPreviewFeedback(null);
  };

  const checkPreview = (ans: string) => {
    sounds.playPop();
    setPreviewAnswer(ans);
    if (previewExercise) {
      const isCorrect = ans.trim().toLowerCase() === String(previewExercise.correctSolution).trim().toLowerCase();
      setPreviewFeedback(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) sounds.playCorrect();
      else sounds.playWrong();
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Course Selector & Action Toolbar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-rose-600 font-bold uppercase tracking-wider">
              Diseñador de Cursos Pedagógicos
            </div>
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-900">
              {selectedCourse?.title}
            </h2>
            <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
              <span>{selectedCourse?.modules.length || 0} unidades</span>
              <span>·</span>
              <span>
                {selectedCourse?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0} lecciones
              </span>
              <span>·</span>
              <span className="text-emerald-700 font-semibold">
                Autor: {selectedCourse?.authorName || user.name}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Switch Course */}
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.sourceFlag} {c.title}
              </option>
            ))}
          </select>

          {/* Vocabulary Wizard Button */}
          <button
            onClick={() => {
              sounds.playPop();
              setWizardModuleId(selectedCourse?.modules[0]?.id || '');
              setShowVocabWizard(true);
            }}
            className="btn-duo flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs rounded-xl shadow-[0_3px_0_#D97706] transition"
            title="Cargar palabras y traducciones para auto-generar ejercicios"
          >
            <Wand2 className="w-4 h-4" />
            <span>Asistente de Vocabulario</span>
          </button>

          {/* New Unit Button */}
          <button
            onClick={() => {
              sounds.playPop();
              setEditingModule({ title: '', description: '' });
            }}
            className="btn-duo flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-[0_3px_0_#BE123C] transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Unidad</span>
          </button>
        </div>
      </div>

      {/* Modules and Lessons Hierarchy Tree */}
      <div className="space-y-5">
        {selectedCourse?.modules.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-display font-bold text-base text-slate-800 mb-1">
              No hay unidades creadas en este curso
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Crea tu primera unidad temática o utiliza el asistente rápido para cargar palabras.
            </p>
            <button
              onClick={() => setEditingModule({ title: '', description: '' })}
              className="btn-duo px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Crear Primera Unidad
            </button>
          </div>
        ) : (
          selectedCourse?.modules.map((module, mIdx) => {
            const isModOpen = expandedModules[module.id] ?? true;

            return (
              <div
                key={module.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Module Bar */}
                <div className="p-4 bg-slate-50/90 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div
                    onClick={() => toggleModule(module.id)}
                    className="flex items-center gap-3 cursor-pointer select-none flex-1"
                  >
                    <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                      {isModOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center shrink-0">
                      U{mIdx + 1}
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                        <span>{module.title}</span>
                        <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                          {module.lessons.length} {module.lessons.length === 1 ? 'lección' : 'lecciones'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1">{module.description}</div>
                    </div>
                  </div>

                  {/* Module Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => {
                        sounds.playPop();
                        setEditingLesson({ moduleId: module.id, title: '', description: '', xpReward: 20 });
                      }}
                      className="btn-duo flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nueva Lección</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playPop();
                        setEditingModule({ id: module.id, title: module.title, description: module.description });
                      }}
                      className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                      title="Editar título de unidad"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Eliminar unidad"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lessons inside Module */}
                {isModOpen && (
                  <div className="p-4 sm:p-5 space-y-4 bg-[#FCFCFA]">
                    {module.lessons.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-white">
                        Esta unidad no tiene lecciones. Haz clic en "Nueva Lección" o usa el asistente de vocabulario.
                      </div>
                    ) : (
                      module.lessons.map((lesson, lIdx) => {
                        const isLsnOpen = expandedLessons[lesson.id] ?? true;

                        return (
                          <div
                            key={lesson.id}
                            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden"
                          >
                            {/* Lesson Bar */}
                            <div className="p-3.5 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div
                                onClick={() => toggleLesson(lesson.id)}
                                className="flex items-center gap-2.5 cursor-pointer select-none flex-1"
                              >
                                <button className="p-0.5 text-slate-400 hover:text-slate-600 rounded">
                                  {isLsnOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>
                                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                                  {lIdx + 1}
                                </div>
                                <div>
                                  <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                                    <span>{lesson.title}</span>
                                    <span className="font-mono text-[10px] text-sky-600 bg-sky-50 px-2 py-0.5 rounded font-bold">
                                      +{lesson.xpReward} XP
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 line-clamp-1">{lesson.description}</div>
                                </div>
                              </div>

                              {/* Lesson Actions */}
                              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                <button
                                  onClick={() => {
                                    sounds.playPop();
                                    setEditingExercise({
                                      moduleId: module.id,
                                      lessonId: lesson.id,
                                      exercise: {
                                        type: 'choice',
                                        instruction: 'Selecciona la opción correcta',
                                        options: ['', '', ''],
                                        correctSolution: '',
                                        audioLang: selectedCourse.sourceLang === 'Wayuunaiki' ? 'wayuu' : 'es'
                                      }
                                    });
                                  }}
                                  className="btn-duo flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Añadir Ejercicio</span>
                                </button>

                                <button
                                  onClick={() => {
                                    sounds.playPop();
                                    setEditingLesson({
                                      moduleId: module.id,
                                      id: lesson.id,
                                      title: lesson.title,
                                      description: lesson.description,
                                      xpReward: lesson.xpReward
                                    });
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
                                  title="Editar lección"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md"
                                  title="Eliminar lección"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Exercises List inside Lesson */}
                            {isLsnOpen && (
                              <div className="p-3 bg-slate-50/50 space-y-2.5">
                                {lesson.exercises.length === 0 ? (
                                  <div className="text-center py-4 text-[11px] text-slate-400">
                                    No hay ejercicios aún. Añade uno con el botón verde.
                                  </div>
                                ) : (
                                  lesson.exercises.map((ex, exIdx) => {
                                    const typeIcon = {
                                      choice: <List className="w-3.5 h-3.5 text-sky-600" />,
                                      'word-bank': <Columns className="w-3.5 h-3.5 text-amber-600" />,
                                      match: <Sparkles className="w-3.5 h-3.5 text-purple-600" />,
                                      phonetic: <Mic className="w-3.5 h-3.5 text-rose-600" />,
                                      translate: <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                    }[ex.type] || <HelpCircle className="w-3.5 h-3.5 text-slate-400" />;

                                    const typeName = {
                                      choice: 'Opción Múltiple',
                                      'word-bank': 'Banco de Palabras',
                                      match: 'Emparejar',
                                      phonetic: 'Pronunciación Fonética',
                                      translate: 'Traducción'
                                    }[ex.type] || ex.type;

                                    return (
                                      <div
                                        key={ex.id}
                                        className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                                      >
                                        <div className="flex items-start gap-2.5">
                                          <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-bold text-slate-500">
                                            #{exIdx + 1}
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                              <span className="inline-flex items-center gap-1 font-bold text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                                {typeIcon}
                                                <span>{typeName}</span>
                                              </span>
                                              {ex.phoneticGuide && (
                                                <span className="text-[10px] font-mono text-rose-600">
                                                  [{ex.phoneticGuide}]
                                                </span>
                                              )}
                                            </div>
                                            <div className="font-bold text-slate-900">{ex.prompt}</div>
                                            <div className="text-[11px] text-slate-500">
                                              Respuesta: <strong className="text-emerald-700">{Array.isArray(ex.correctSolution) ? ex.correctSolution.join(', ') : ex.correctSolution}</strong>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Exercise Actions */}
                                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                          <button
                                            onClick={() => handleTestPreview(ex)}
                                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                                            title="Probar ejercicio en vivo"
                                          >
                                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                                            <span>Probar</span>
                                          </button>

                                          <button
                                            onClick={() => {
                                              sounds.playPop();
                                              setEditingExercise({
                                                moduleId: module.id,
                                                lessonId: lesson.id,
                                                exercise: { ...ex }
                                              });
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
                                            title="Editar ejercicio"
                                          >
                                            <Edit3 className="w-3.5 h-3.5" />
                                          </button>

                                          <button
                                            onClick={() => handleDeleteExercise(module.id, lesson.id, ex.id)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md"
                                            title="Eliminar ejercicio"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: EDIT / CREATE MODULE                                 */}
      {/* ============================================================== */}
      {editingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <h3 className="font-display font-bold text-base text-slate-900 mb-1">
              {editingModule.id ? 'Editar Unidad' : 'Nueva Unidad Temática'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Las unidades agrupan temas pedagógicos (ej. Saludos, Números, La Familia, Naturaleza).
            </p>
            <form onSubmit={handleSaveModule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título de la Unidad *
                </label>
                <input
                  type="text"
                  required
                  value={editingModule.title}
                  onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                  placeholder="Ej: Wounmain: El Territorio y la Tierra"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción pedagógica
                </label>
                <textarea
                  rows={2}
                  value={editingModule.description}
                  onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })}
                  placeholder="Breve resumen de lo que el alumno aprenderá..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingModule(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs"
                >
                  Guardar Unidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EDIT / CREATE LESSON                                 */}
      {/* ============================================================== */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <h3 className="font-display font-bold text-base text-slate-900 mb-1">
              {editingLesson.id ? 'Editar Lección' : 'Nueva Lección Interactiva'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Cada lección es un hito jugable en el mapa de progreso del alumno.
            </p>
            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título de la Lección *
                </label>
                <input
                  type="text"
                  required
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  placeholder="Ej: Jamaya pia: Saludos y Bienvenida"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={editingLesson.description}
                  onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                  placeholder="Ej: Primeras frases de encuentro y respeto"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recompensa en Puntos (XP)
                </label>
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={editingLesson.xpReward}
                  onChange={(e) => setEditingLesson({ ...editingLesson, xpReward: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs"
                >
                  Guardar Lección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: COMPREHENSIVE EXERCISE BUILDER (Words, Types, Audio)   */}
      {/* ============================================================== */}
      {editingExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-bold text-base text-slate-900">
                {editingExercise.exercise.id ? 'Editar Ejercicio' : 'Crear Nuevo Ejercicio de Práctica'}
              </h3>
              <button
                onClick={() => setEditingExercise(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Configura el tipo de ejercicio, las palabras, opciones y notas culturales de pronunciación.
            </p>

            <form onSubmit={handleSaveExercise} className="space-y-4">
              {/* Exercise Type Selector Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tipo de Ejercicio
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { type: 'choice', label: 'Opción Múltiple', icon: <List className="w-3.5 h-3.5" /> },
                    { type: 'word-bank', label: 'Banco de Palabras', icon: <Columns className="w-3.5 h-3.5" /> },
                    { type: 'match', label: 'Emparejar Tarjetas', icon: <Sparkles className="w-3.5 h-3.5" /> },
                    { type: 'phonetic', label: 'Fonética y Audio', icon: <Mic className="w-3.5 h-3.5" /> }
                  ].map((t) => (
                    <button
                      key={t.type}
                      type="button"
                      onClick={() =>
                        setEditingExercise({
                          ...editingExercise,
                          exercise: { ...editingExercise.exercise, type: t.type as ExerciseType }
                        })
                      }
                      className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        editingExercise.exercise.type === t.type
                          ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t.icon}
                      <span className="text-[11px]">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instruction */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instrucción para el Alumno
                </label>
                <input
                  type="text"
                  required
                  value={editingExercise.exercise.instruction || ''}
                  onChange={(e) =>
                    setEditingExercise({
                      ...editingExercise,
                      exercise: { ...editingExercise.exercise, instruction: e.target.value }
                    })
                  }
                  placeholder="Ej: Selecciona la traducción correcta"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              {/* Prompt / Question */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Frase o Palabra a Consultar (Prompt) *
                </label>
                <input
                  type="text"
                  required
                  value={editingExercise.exercise.prompt || ''}
                  onChange={(e) =>
                    setEditingExercise({
                      ...editingExercise,
                      exercise: { ...editingExercise.exercise, prompt: e.target.value }
                    })
                  }
                  placeholder="Ej: ¿Qué significa 'Wüin' en inglés?"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                />
              </div>

              {/* Correct Solution */}
              <div>
                <label className="block text-xs font-bold text-emerald-800 mb-1 flex items-center justify-between">
                  <span>Solución Correcta (Exacta) *</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    Lo que evaluará el sistema
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={String(editingExercise.exercise.correctSolution || '')}
                  onChange={(e) =>
                    setEditingExercise({
                      ...editingExercise,
                      exercise: { ...editingExercise.exercise, correctSolution: e.target.value }
                    })
                  }
                  placeholder="Ej: Water"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-emerald-300 bg-emerald-50/40 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              {/* TYPE SPECIFIC: Multiple choice options */}
              {(editingExercise.exercise.type === 'choice' || editingExercise.exercise.type === 'phonetic') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Opciones / Distractores (Separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={(editingExercise.exercise.options || []).join(', ')}
                    onChange={(e) => {
                      const opts = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      setEditingExercise({
                        ...editingExercise,
                        exercise: { ...editingExercise.exercise, options: opts }
                      });
                    }}
                    placeholder="Ej: Water, Sun, Wind, Fire"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Asegúrate de incluir la respuesta correcta entre las opciones.
                  </p>
                </div>
              )}

              {/* TYPE SPECIFIC: Word Bank Tiles */}
              {editingExercise.exercise.type === 'word-bank' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fichas para el Banco de Palabras (Separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={(editingExercise.exercise.wordBank || []).join(', ')}
                    onChange={(e) => {
                      const tiles = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      setEditingExercise({
                        ...editingExercise,
                        exercise: { ...editingExercise.exercise, wordBank: tiles }
                      });
                    }}
                    placeholder="Ej: The, sun, is, warm, water, cold"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              )}

              {/* TYPE SPECIFIC: Match pairs */}
              {editingExercise.exercise.type === 'match' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Parejas de Emparejamiento (Formato: Término:Traducción, Término:Traducción)
                  </label>
                  <input
                    type="text"
                    value={(editingExercise.exercise.options || []).join(', ')}
                    onChange={(e) => {
                      const pairs = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      setEditingExercise({
                        ...editingExercise,
                        exercise: { ...editingExercise.exercise, options: pairs, correctSolution: pairs.join(',') }
                      });
                    }}
                    placeholder="Ej: Wüin:Water, Ka'i:Sun, Kashí:Moon"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
              )}

              {/* Phonetic guide & cultural note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Guía Fonética Silábica
                  </label>
                  <input
                    type="text"
                    value={editingExercise.exercise.phoneticGuide || ''}
                    onChange={(e) =>
                      setEditingExercise({
                        ...editingExercise,
                        exercise: { ...editingExercise.exercise, phoneticGuide: e.target.value }
                      })
                    }
                    placeholder="Ej: WÜ-in / WAH-ter"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Audio Síntesis (Texto para voz)
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={editingExercise.exercise.audioText || ''}
                      onChange={(e) =>
                        setEditingExercise({
                          ...editingExercise,
                          exercise: { ...editingExercise.exercise, audioText: e.target.value }
                        })
                      }
                      placeholder="Texto para sintetizar"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        sounds.speak(
                          editingExercise.exercise.audioText || editingExercise.exercise.prompt || '',
                          editingExercise.exercise.audioLang as any
                        )
                      }
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                      title="Probar sonido"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nota Cultural / Explicación Etnoeducativa
                </label>
                <textarea
                  rows={2}
                  value={editingExercise.exercise.culturalNote || ''}
                  onChange={(e) =>
                    setEditingExercise({
                      ...editingExercise,
                      exercise: { ...editingExercise.exercise, culturalNote: e.target.value }
                    })
                  }
                  placeholder="Ej: Wüin es el agua, elemento sagrado para la vida y supervivencia en La Guajira..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingExercise(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs"
                >
                  Guardar Ejercicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: VOCABULARY WIZARD (Carga rápida de palabras)           */}
      {/* ============================================================== */}
      {showVocabWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Wand2 className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Asistente Rápido de Carga de Vocabulario
                </h3>
              </div>
              <button
                onClick={() => setShowVocabWizard(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Ingresa palabras en el idioma origen con su traducción. El generador creará automáticamente una lección con ejercicios de opción múltiple, emparejamiento y banco de palabras.
            </p>

            <form onSubmit={handleGenerateFromVocab} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Unidad de Destino *
                </label>
                <select
                  required
                  value={wizardModuleId}
                  onChange={(e) => setWizardModuleId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                >
                  {selectedCourse?.modules.map((m, i) => (
                    <option key={m.id} value={m.id}>
                      Unidad {i + 1}: {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título de la Lección a Generar *
                </label>
                <input
                  type="text"
                  required
                  value={wizardLessonTitle}
                  onChange={(e) => setWizardLessonTitle(e.target.value)}
                  placeholder="Ej: Animales del Desierto / Vocabulario Básico"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                />
              </div>

              {/* Vocab Pairs List */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Pares de Palabras y Traducciones:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setVocabPairs([...vocabPairs, { term: '', translation: '', phonetic: '' }])
                    }
                    className="text-amber-700 hover:text-amber-800 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar otra palabra</span>
                  </button>
                </div>

                {vocabPairs.map((pair, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-2"
                  >
                    <div className="w-6 text-center font-mono font-bold text-xs text-slate-400">
                      {idx + 1}.
                    </div>
                    <input
                      type="text"
                      placeholder={`Palabra en ${selectedCourse?.sourceLang}`}
                      value={pair.term}
                      onChange={(e) => {
                        const copy = [...vocabPairs];
                        copy[idx].term = e.target.value;
                        setVocabPairs(copy);
                      }}
                      className="flex-1 w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-bold"
                    />
                    <span className="text-slate-400 hidden sm:inline">➔</span>
                    <input
                      type="text"
                      placeholder={`Traducción en ${selectedCourse?.targetLang}`}
                      value={pair.translation}
                      onChange={(e) => {
                        const copy = [...vocabPairs];
                        copy[idx].translation = e.target.value;
                        setVocabPairs(copy);
                      }}
                      className="flex-1 w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Fonética (opcional)"
                      value={pair.phonetic}
                      onChange={(e) => {
                        const copy = [...vocabPairs];
                        copy[idx].phonetic = e.target.value;
                        setVocabPairs(copy);
                      }}
                      className="w-full sm:w-28 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-mono text-[11px]"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowVocabWizard(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold shadow-xs transition"
                >
                  Auto-Generar Ejercicios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: LIVE EXERCISE TEST PREVIEW (Sandbox)                  */}
      {/* ============================================================== */}
      {previewExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Simulador de Ejercicio para Alumnos</span>
              </span>
              <button
                onClick={() => setPreviewExercise(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {previewExercise.instruction}
              </div>
              <div className="text-lg font-extrabold text-slate-900 flex items-center justify-between">
                <span>{previewExercise.prompt}</span>
                <button
                  onClick={() => sounds.speak(previewExercise.audioText || previewExercise.prompt, previewExercise.audioLang as any)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                  title="Escuchar audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              {previewExercise.phoneticGuide && (
                <div className="text-xs font-mono text-rose-600 mt-1">
                  Guía: {previewExercise.phoneticGuide}
                </div>
              )}
            </div>

            {/* Simulated Options to click */}
            {previewExercise.options && (
              <div className="space-y-2 mb-5">
                <div className="text-[11px] font-semibold text-slate-400">
                  Prueba respondiendo:
                </div>
                {previewExercise.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => checkPreview(opt)}
                    className={`btn-duo w-full p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                      previewAnswer === opt
                        ? opt.trim().toLowerCase() === String(previewExercise.correctSolution).trim().toLowerCase()
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
                          : 'bg-rose-50 border-rose-400 text-rose-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span>{opt}</span>
                    {previewAnswer === opt && (
                      <span>
                        {opt.trim().toLowerCase() === String(previewExercise.correctSolution).trim().toLowerCase()
                          ? '✓ Correcto'
                          : '✗ Error'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {previewFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2 ${
                  previewFeedback === 'correct'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border border-rose-200 text-rose-900'
                }`}
              >
                {previewFeedback === 'correct' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>
                  {previewFeedback === 'correct'
                    ? '¡Excelente! La respuesta es correcta.'
                    : `Solución correcta esperada: "${previewExercise.correctSolution}"`}
                </span>
              </div>
            )}

            <button
              onClick={() => setPreviewExercise(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
            >
              Cerrar Simulador
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
