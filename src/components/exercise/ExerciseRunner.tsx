import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Exercise } from '../../types';
import { UIStrings } from '../../i18n/translations';

interface ExerciseRunnerProps {
  exercise: Exercise;
  t: UIStrings;
  feedback: 'idle' | 'correct' | 'wrong';
  onAnswer: (isCorrect: boolean) => void;
}

export const ExerciseRunner: React.FC<ExerciseRunnerProps> = ({
  exercise,
  t,
  feedback,
  onAnswer,
}) => {
  // State for Choice / Phonetic
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // State for Word Bank
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<{ id: number; word: string }[]>([]);

  // State for Match
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [leftItems, setLeftItems] = useState<string[]>([]);
  const [rightItems, setRightItems] = useState<string[]>([]);

  // Reset internal exercise state on exercise change
  useEffect(() => {
    setSelectedOption(null);

    // Initialize Word Bank
    if (exercise.type === 'word-bank' && exercise.wordBank) {
      setSelectedWords([]);
      setAvailableWords(
        exercise.wordBank.map((word, index) => ({ id: index, word }))
      );
    }

    // Initialize Match
    if (exercise.type === 'match' && exercise.options) {
      setMatchedPairs([]);
      setSelectedLeft(null);
      setSelectedRight(null);

      const pairs = exercise.options.map((opt) => opt.split(':'));
      const lefts = pairs.map((p) => p[0]);
      const rights = pairs.map((p) => p[1]);

      // Shuffle right items so they don't match index-to-index
      setLeftItems(lefts);
      setRightItems([...rights].sort(() => Math.random() - 0.5));
    }
  }, [exercise.id]);

  // CHOICE / PHONETIC handler
  const handleSelectChoice = (option: string) => {
    if (feedback !== 'idle') return;
    setSelectedOption(option);
    const isCorrect = option === exercise.correctSolution;
    onAnswer(isCorrect);
  };

  // WORD BANK handlers
  const handleAddWord = (item: { id: number; word: string }) => {
    if (feedback !== 'idle') return;
    setSelectedWords([...selectedWords, item.word]);
    setAvailableWords(availableWords.filter((w) => w.id !== item.id));
  };

  const handleRemoveWord = (word: string, indexToRemove: number) => {
    if (feedback !== 'idle') return;
    const newSelected = selectedWords.filter((_, idx) => idx !== indexToRemove);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, { id: Date.now() + Math.random(), word }]);
  };

  const handleCheckWordBank = () => {
    if (feedback !== 'idle') return;
    const constructed = selectedWords.join(' ').trim();
    const target = Array.isArray(exercise.correctSolution)
      ? exercise.correctSolution.join(' ')
      : exercise.correctSolution;
    const isCorrect = constructed.toLowerCase() === target.toLowerCase();
    onAnswer(isCorrect);
  };

  // MATCH handlers
  const handleSelectLeft = (left: string) => {
    if (feedback !== 'idle') return;
    if (matchedPairs.includes(left)) return;
    setSelectedLeft(left);

    if (selectedRight) {
      checkMatch(left, selectedRight);
    }
  };

  const handleSelectRight = (right: string) => {
    if (feedback !== 'idle') return;
    if (matchedPairs.includes(right)) return;
    setSelectedRight(right);

    if (selectedLeft) {
      checkMatch(selectedLeft, right);
    }
  };

  const checkMatch = (left: string, right: string) => {
    // Check if left:right or options contain this pair
    const targetPair = `${left}:${right}`;
    const options = exercise.options || [];
    const isPairValid = options.some(
      (opt) => opt.toLowerCase() === targetPair.toLowerCase()
    );

    if (isPairValid) {
      const newMatched = [...matchedPairs, left, right];
      setMatchedPairs(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if all pairs are matched
      if (newMatched.length === options.length * 2) {
        onAnswer(true);
      }
    } else {
      // Temporarily highlight wrong then clear
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 400);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Exercise Header Details */}
      <View style={styles.badgeRow}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {exercise.type === 'word-bank' && '📝 Banco de Palabras'}
            {exercise.type === 'match' && '🧩 Emparejar'}
            {exercise.type === 'phonetic' && '🔊 Fonética & Sonido'}
            {exercise.type === 'choice' && '✨ Opción Múltiple'}
          </Text>
        </View>
      </View>

      <Text style={styles.instruction}>{exercise.instruction}</Text>
      <Text style={styles.prompt}>{exercise.prompt}</Text>

      {/* Phonetic Pronunciation Guide */}
      {exercise.phoneticGuide && (
        <View style={styles.phoneticCard}>
          <View style={styles.audioIconBadge}>
            <Text style={{ fontSize: 18 }}>🗣️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.phoneticTitle}>Guía de Pronunciación:</Text>
            <Text style={styles.phoneticText}>{exercise.phoneticGuide}</Text>
          </View>
        </View>
      )}

      {/* Cultural Wisdom Box */}
      {exercise.culturalNote && (
        <View style={styles.culturalBox}>
          <Text style={styles.culturalTitle}>🌿 {t.culturalWisdom}</Text>
          <Text style={styles.culturalText}>{exercise.culturalNote}</Text>
        </View>
      )}

      {/* 1. TYPE: CHOICE or PHONETIC */}
      {(exercise.type === 'choice' || exercise.type === 'phonetic') && exercise.options && (
        <View style={styles.optionsList}>
          {exercise.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === exercise.correctSolution;

            let btnStyle = styles.optionBtn;
            if (feedback !== 'idle' && isSelected) {
              btnStyle = isCorrect ? styles.optionBtnCorrect : styles.optionBtnWrong;
            }

            return (
              <TouchableOpacity
                key={i}
                style={btnStyle}
                disabled={feedback !== 'idle'}
                onPress={() => handleSelectChoice(opt)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    feedback !== 'idle' && isSelected && styles.optionTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* 2. TYPE: WORD BANK */}
      {exercise.type === 'word-bank' && (
        <View style={styles.wordBankContainer}>
          {/* Answer Slot Area */}
          <View style={styles.slotArea}>
            <Text style={styles.slotPlaceholder}>
              {selectedWords.length === 0 ? 'Toca las palabras de abajo para formar la frase...' : ''}
            </Text>
            <View style={styles.wordsRow}>
              {selectedWords.map((word, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.selectedWordChip}
                  onPress={() => handleRemoveWord(word, idx)}
                  disabled={feedback !== 'idle'}
                >
                  <Text style={styles.selectedWordText}>{word}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Available Word Bank Chips */}
          <Text style={styles.bankLabel}>Palabras disponibles:</Text>
          <View style={styles.wordsRow}>
            {availableWords.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.availableWordChip}
                onPress={() => handleAddWord(item)}
                disabled={feedback !== 'idle'}
              >
                <Text style={styles.availableWordText}>{item.word}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Check Button */}
          {feedback === 'idle' && (
            <TouchableOpacity
              style={[
                styles.checkBtn,
                selectedWords.length === 0 && styles.checkBtnDisabled,
              ]}
              disabled={selectedWords.length === 0}
              onPress={handleCheckWordBank}
            >
              <Text style={styles.checkBtnText}>Comprobar Frase</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 3. TYPE: MATCH PAIRS */}
      {exercise.type === 'match' && (
        <View style={styles.matchContainer}>
          <Text style={styles.matchInstruction}>
            Toca una palabra de la izquierda y luego su traducción a la derecha:
          </Text>

          <View style={styles.matchColumnsRow}>
            {/* Left Column */}
            <View style={styles.matchColumn}>
              {leftItems.map((item, idx) => {
                const isMatched = matchedPairs.includes(item);
                const isSelected = selectedLeft === item;

                return (
                  <TouchableOpacity
                    key={idx}
                    disabled={isMatched || feedback !== 'idle'}
                    style={[
                      styles.matchCard,
                      isSelected && styles.matchCardSelected,
                      isMatched && styles.matchCardMatched,
                    ]}
                    onPress={() => handleSelectLeft(item)}
                  >
                    <Text
                      style={[
                        styles.matchCardText,
                        isSelected && styles.matchCardTextSelected,
                        isMatched && styles.matchCardTextMatched,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Right Column */}
            <View style={styles.matchColumn}>
              {rightItems.map((item, idx) => {
                const isMatched = matchedPairs.includes(item);
                const isSelected = selectedRight === item;

                return (
                  <TouchableOpacity
                    key={idx}
                    disabled={isMatched || feedback !== 'idle'}
                    style={[
                      styles.matchCard,
                      isSelected && styles.matchCardSelected,
                      isMatched && styles.matchCardMatched,
                    ]}
                    onPress={() => handleSelectRight(item)}
                  >
                    <Text
                      style={[
                        styles.matchCardText,
                        isSelected && styles.matchCardTextSelected,
                        isMatched && styles.matchCardTextMatched,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  typeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
  },
  instruction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginTop: 4,
  },
  prompt: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
    lineHeight: 28,
  },
  phoneticCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    marginTop: 14,
    gap: 12,
  },
  audioIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneticTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
    textTransform: 'uppercase',
  },
  phoneticText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
    marginTop: 2,
  },
  culturalBox: {
    backgroundColor: '#FEF9C3',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#CA8A04',
    marginTop: 14,
  },
  culturalTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#854D0E',
  },
  culturalText: {
    fontSize: 12,
    color: '#713F12',
    marginTop: 2,
    lineHeight: 16,
  },
  optionsList: {
    marginTop: 22,
    gap: 12,
  },
  optionBtn: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  optionBtnCorrect: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  optionBtnWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  optionTextActive: {
    fontWeight: '800',
  },
  wordBankContainer: {
    marginTop: 20,
    gap: 16,
  },
  slotArea: {
    minHeight: 90,
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    padding: 12,
    justifyContent: 'center',
  },
  slotPlaceholder: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    position: 'absolute',
    alignSelf: 'center',
  },
  wordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedWordChip: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#E11D48',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedWordText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  bankLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  availableWordChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  availableWordText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 14,
  },
  checkBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  checkBtnDisabled: {
    opacity: 0.4,
  },
  checkBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 15,
  },
  matchContainer: {
    marginTop: 20,
    gap: 12,
  },
  matchInstruction: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  matchColumnsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  matchColumn: {
    flex: 1,
    gap: 10,
  },
  matchCard: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  matchCardSelected: {
    borderColor: '#E11D48',
    backgroundColor: '#FFF1F2',
  },
  matchCardMatched: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
    opacity: 0.8,
  },
  matchCardText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  matchCardTextSelected: {
    color: '#E11D48',
    fontWeight: '800',
  },
  matchCardTextMatched: {
    color: '#15803D',
    fontWeight: '800',
  },
});
