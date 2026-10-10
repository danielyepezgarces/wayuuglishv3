import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Lesson, Exercise, User } from '../../types';
import { storage } from '../../services/storageService';
import { sounds } from '../../services/soundEffects';
import { MascotWaraush } from '../MascotWaraush';
import {
  X,
  Heart,
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Flame,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Info
} from 'lucide-react';

interface LessonRunnerProps {
  lesson: Lesson;
  moduleTitle: string;
  user: User;
  onFinish: () => void;
  onQuit: () => void;
}

export const LessonRunner: React.FC<LessonRunnerProps> = ({
  lesson,
  moduleTitle,
  user,
  onFinish,
  onQuit
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hearts, setHearts] = useState(user.hearts);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  // Matching state
  const [matchPairs, setMatchPairs] = useState<{ id: string; text: string; side: 'left' | 'right'; pairKey: string }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [completedPairs, setCompletedPairs] = useState<string[]>([]);

  // Evaluation state
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedStats, setCompletedStats] = useState<{ xpGained: number; newStreak: number } | null>(null);

  const currentExercise: Exercise | undefined = lesson.exercises[currentIdx];
  const progressPercent = Math.round(((currentIdx) / lesson.exercises.length) * 100);

  // Initialize exercise state whenever currentIdx changes
  useEffect(() => {
    if (!currentExercise) return;

    setStatus('idle');
    setSelectedOption(null);

    if (currentExercise.type === 'word-bank' && currentExercise.wordBank) {
      // Shuffle word bank for fun
      const shuffled = [...currentExercise.wordBank].sort(() => 0.5 - Math.random());
      setAvailableWords(shuffled);
      setSelectedWords([]);
    }

    if (currentExercise.type === 'match' && currentExercise.options) {
      // Options format: "Key:Value"
      const lefts: { id: string; text: string; side: 'left'; pairKey: string }[] = [];
      const rights: { id: string; text: string; side: 'right'; pairKey: string }[] = [];

      currentExercise.options.forEach((opt, i) => {
        const [l, r] = opt.split(':');
        lefts.push({ id: `l-${i}`, text: l, side: 'left', pairKey: opt });
        rights.push({ id: `r-${i}`, text: r, side: 'right', pairKey: opt });
      });

      // Shuffle right column
      rights.sort(() => 0.5 - Math.random());
      setMatchPairs([...lefts, ...rights]);
      setSelectedLeft(null);
      setSelectedRight(null);
      setCompletedPairs([]);
    }
  }, [currentIdx, currentExercise]);

  // Audio helper
  const handlePlayAudio = (text?: string, lang?: string) => {
    sounds.playPop();
    if (!text) return;
    const l = (lang === 'wayuu' ? 'wayuu' : lang === 'es' ? 'es' : 'en') as 'wayuu' | 'es' | 'en';
    sounds.speak(text, l);
  };

  // Word bank tap handlers
  const handlePickWord = (word: string, index: number) => {
    sounds.playPop();
    const newAvail = [...availableWords];
    newAvail.splice(index, 1);
    setAvailableWords(newAvail);
    setSelectedWords([...selectedWords, word]);
  };

  const handleReturnWord = (word: string, index: number) => {
    sounds.playPop();
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, word]);
  };

  // Match item click
  const handleMatchClick = (item: { id: string; text: string; side: 'left' | 'right'; pairKey: string }) => {
    sounds.playPop();
    if (completedPairs.includes(item.pairKey)) return;

    if (item.side === 'left') {
      setSelectedLeft(item.id);
      if (selectedRight) {
        // Evaluate pair
        const rightItem = matchPairs.find((m) => m.id === selectedRight);
        if (rightItem && rightItem.pairKey === item.pairKey) {
          // Success
          sounds.playCorrect();
          setCompletedPairs((prev) => [...prev, item.pairKey]);
          setSelectedLeft(null);
          setSelectedRight(null);
        } else {
          sounds.playWrong();
          setTimeout(() => {
            setSelectedLeft(null);
            setSelectedRight(null);
          }, 400);
        }
      }
    } else {
      setSelectedRight(item.id);
      if (selectedLeft) {
        // Evaluate pair
        const leftItem = matchPairs.find((m) => m.id === selectedLeft);
        if (leftItem && leftItem.pairKey === item.pairKey) {
          sounds.playCorrect();
          setCompletedPairs((prev) => [...prev, item.pairKey]);
          setSelectedLeft(null);
          setSelectedRight(null);
        } else {
          sounds.playWrong();
          setTimeout(() => {
            setSelectedLeft(null);
            setSelectedRight(null);
          }, 400);
        }
      }
    }
  };

  // Check Answer Handler
  const handleCheckAnswer = () => {
    if (!currentExercise || status !== 'idle') return;

    let isCorrect = false;

    if (currentExercise.type === 'choice' || currentExercise.type === 'phonetic') {
      isCorrect = selectedOption?.trim().toLowerCase() === String(currentExercise.correctSolution).trim().toLowerCase();
    } else if (currentExercise.type === 'word-bank') {
      const sentence = selectedWords.join(' ').trim().toLowerCase();
      const expected = String(currentExercise.correctSolution).trim().toLowerCase();
      isCorrect = sentence === expected;
    } else if (currentExercise.type === 'match') {
      // All pairs must be completed
      const totalPairsCount = currentExercise.options?.length || 0;
      isCorrect = completedPairs.length >= totalPairsCount;
    }

    if (isCorrect) {
      sounds.playCorrect();
      setStatus('correct');
    } else {
      sounds.playWrong();
      setStatus('wrong');
      const newHearts = storage.deductHeart();
      setHearts(newHearts);
    }
  };

  // Next Question / Finish Handler
  const handleContinue = () => {
    sounds.playPop();
    if (currentIdx + 1 < lesson.exercises.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Completed all exercises!
      const stats = storage.completeLesson(lesson.id, lesson.xpReward);
      setCompletedStats(stats);
      setIsCompleted(true);
      sounds.playComplete();

      // Launch joyful celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E11D48', '#F59E0B', '#10B981', '#0284C7']
      });
    }
  };

  const isCheckDisabled = () => {
    if (!currentExercise || status !== 'idle') return true;
    if (currentExercise.type === 'choice' || currentExercise.type === 'phonetic') {
      return !selectedOption;
    }
    if (currentExercise.type === 'word-bank') {
      return selectedWords.length === 0;
    }
    if (currentExercise.type === 'match') {
      return completedPairs.length < (currentExercise.options?.length || 0);
    }
    return false;
  };

  // --- VICTORY SCREEN ---
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center animate-fade-in">
          <MascotWaraush
            mood="celebrate"
            size="lg"
            message="¡Anasü ma'i! ¡Lección completada!"
          />

          <h2 className="font-display font-extrabold text-2xl text-slate-900 mt-4 mb-1">
            ¡Excelente trabajo!
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Has completado con éxito la lección <strong>{lesson.title}</strong>
          </p>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex flex-col items-center">
              <Sparkles className="w-6 h-6 text-sky-500 mb-1" />
              <span className="font-mono font-black text-xl text-sky-700">+{lesson.xpReward}</span>
              <span className="text-[11px] font-semibold text-sky-600 uppercase">XP Ganados</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex flex-col items-center">
              <Flame className="w-6 h-6 fill-amber-500 text-amber-600 mb-1 animate-pulse" />
              <span className="font-mono font-black text-xl text-amber-700">
                {completedStats?.newStreak || user.streak}
              </span>
              <span className="text-[11px] font-semibold text-amber-600 uppercase">Días de Racha</span>
            </div>
          </div>

          <button
            onClick={onFinish}
            className="btn-duo w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-2xl shadow-[0_5px_0_#BE123C] transition"
          >
            Continuar al Mapa de Rutas
          </button>
        </div>
      </div>
    );
  }

  // --- RUNNER EXERCISE SCREEN ---
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-between">
      {/* Top Bar: Close, Progress, Hearts */}
      <div className="max-w-3xl w-full mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-2 text-slate-400 hover:text-slate-700 rounded-xl transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Fluid Progress Bar */}
        <div className="flex-1 h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-rose-500 rounded-full transition-all duration-300 shadow-xs"
            style={{ width: `${Math.max(progressPercent, 5)}%` }}
          />
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1.5 text-rose-600 font-bold text-sm">
          <Heart className="w-5 h-5 fill-rose-500" />
          <span className="font-mono tabular-nums">{hearts}</span>
        </div>
      </div>

      {/* Main Exercise Area */}
      <div className="max-w-2xl w-full mx-auto px-4 py-6 flex-1 flex flex-col justify-center">
        {currentExercise && (
          <div>
            {/* Header: Instruction */}
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {moduleTitle} · Ejercicio {currentIdx + 1} de {lesson.exercises.length}
              </span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mt-1">
                {currentExercise.instruction}
              </h2>
            </div>

            {/* Prompt Card with Audio Button */}
            <div className="mb-8 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
              <button
                onClick={() => handlePlayAudio(currentExercise.audioText || currentExercise.prompt, currentExercise.audioLang)}
                className="w-12 h-12 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 transition"
                title="Escuchar audio"
              >
                <Volume2 className="w-6 h-6" />
              </button>
              <div className="flex-1">
                <div className="text-lg font-bold text-slate-900 leading-snug">
                  {currentExercise.prompt}
                </div>
                {currentExercise.phoneticGuide && (
                  <div className="text-xs font-mono text-slate-500 mt-1 flex items-center gap-1">
                    <span>Guía fonética:</span>
                    <strong className="text-rose-600 font-semibold">{currentExercise.phoneticGuide}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* --- TYPE 1: Multiple Choice or Phonetic Choice --- */}
            {(currentExercise.type === 'choice' || currentExercise.type === 'phonetic') && currentExercise.options && (
              <div className="space-y-3">
                {currentExercise.options.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        sounds.playPop();
                        setSelectedOption(opt);
                      }}
                      disabled={status !== 'idle'}
                      className={`btn-duo w-full p-4 rounded-2xl border-2 text-left font-semibold text-sm transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-[0_3px_0_#BE123C]'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-[0_3px_0_#CBD5E1]'
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-rose-500 bg-rose-500' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* --- TYPE 2: Word Bank Ordering --- */}
            {currentExercise.type === 'word-bank' && (
              <div>
                {/* Assembled sentence tray */}
                <div className="min-h-[70px] p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-white mb-6 flex flex-wrap gap-2 items-center">
                  {selectedWords.length === 0 ? (
                    <span className="text-xs text-slate-400 select-none">
                      Toca las palabras de abajo para armar la oración aquí...
                    </span>
                  ) : (
                    selectedWords.map((word, i) => (
                      <button
                        key={i}
                        onClick={() => handleReturnWord(word, i)}
                        disabled={status !== 'idle'}
                        className="btn-duo px-3.5 py-2 bg-rose-50 border-2 border-rose-300 text-rose-900 font-bold text-sm rounded-xl shadow-[0_2px_0_#FDA4AF] transition"
                      >
                        {word}
                      </button>
                    ))
                  )}
                </div>

                {/* Available word bank */}
                <div className="flex flex-wrap gap-2.5 justify-center">
                  {availableWords.map((word, i) => (
                    <button
                      key={i}
                      onClick={() => handlePickWord(word, i)}
                      disabled={status !== 'idle'}
                      className="btn-duo px-4 py-2.5 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-sm rounded-xl shadow-[0_3px_0_#E2E8F0] transition active:scale-95"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- TYPE 3: Matching Pairs --- */}
            {currentExercise.type === 'match' && (
              <div className="grid grid-cols-2 gap-3">
                {matchPairs.map((item) => {
                  const isPairDone = completedPairs.includes(item.pairKey);
                  const isLeftSelected = selectedLeft === item.id;
                  const isRightSelected = selectedRight === item.id;
                  const isSelected = isLeftSelected || isRightSelected;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMatchClick(item)}
                      disabled={isPairDone || status !== 'idle'}
                      className={`btn-duo p-4 rounded-2xl border-2 font-bold text-sm text-center transition-all ${
                        isPairDone
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-60 cursor-default'
                          : isSelected
                          ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-[0_3px_0_#BE123C]'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-[0_3px_0_#CBD5E1]'
                      }`}
                    >
                      {item.text}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- BOTTOM EVALUATION SHEET / FOOTER --- */}
      <div
        className={`w-full border-t transition-colors duration-200 ${
          status === 'correct'
            ? 'bg-emerald-100/90 border-emerald-300'
            : status === 'wrong'
            ? 'bg-rose-100/90 border-rose-300'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Feedback message */}
          {status === 'idle' ? (
            <div className="text-xs text-slate-400 hidden sm:block">
              {currentExercise?.culturalNote && (
                <span className="flex items-center gap-1 text-slate-500">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="line-clamp-1">{currentExercise.culturalNote}</span>
                </span>
              )}
            </div>
          ) : status === 'correct' ? (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="font-display font-extrabold text-base text-emerald-900">
                  ¡Excelente! Muy bien hecho
                </div>
                {currentExercise?.culturalNote && (
                  <div className="text-xs text-emerald-800 max-w-md">
                    {currentExercise.culturalNote}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="font-display font-extrabold text-base text-rose-900">
                  Solución correcta:
                </div>
                <div className="text-xs font-semibold text-rose-800">
                  {Array.isArray(currentExercise?.correctSolution)
                    ? currentExercise?.correctSolution.join(', ')
                    : String(currentExercise?.correctSolution)}
                </div>
              </div>
            </div>
          )}

          {/* Action button: Check or Continue */}
          <div className="w-full sm:w-auto">
            {status === 'idle' ? (
              <button
                onClick={handleCheckAnswer}
                disabled={isCheckDisabled()}
                className={`btn-duo w-full sm:w-44 py-3.5 px-6 font-bold text-sm rounded-2xl transition shadow-xs ${
                  isCheckDisabled()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_0_#059669]'
                }`}
              >
                Comprobar
              </button>
            ) : (
              <button
                onClick={handleContinue}
                className={`btn-duo w-full sm:w-44 py-3.5 px-6 font-bold text-sm rounded-2xl transition shadow-xs text-white ${
                  status === 'correct'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_4px_0_#059669]'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-[0_4px_0_#BE123C]'
                }`}
              >
                Continuar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
              ¿Seguro que deseas salir?
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Si sales ahora, perderás el progreso actual de esta lección.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="btn-duo w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Continuar Aprendiendo
              </button>
              <button
                onClick={onQuit}
                className="w-full py-2.5 text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Salir de la Lección
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
