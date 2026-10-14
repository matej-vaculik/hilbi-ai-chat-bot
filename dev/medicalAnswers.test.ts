import { expect, it } from 'vitest';
import { medicalAnswers, selectMedicalAnswer } from './medicalAnswers';

it('contains exactly 100 unique topics and answers, all accessible by preview command', () => {
  expect(medicalAnswers).toHaveLength(100);
  expect(new Set(medicalAnswers.map((item) => item.topic)).size).toBe(100);
  expect(new Set(medicalAnswers.map((item) => item.answer)).size).toBe(100);
  for (const item of medicalAnswers) {
    expect(selectMedicalAnswer(`/demo answer ${item.id}`)).toEqual(item);
  }
});

it('matches each topic using its primary keyword without accidental substring collisions', () => {
  for (const item of medicalAnswers) {
    expect(selectMedicalAnswer(item.keywords[0]).topic).toBe(item.topic);
  }
  expect(selectMedicalAnswer('A fluid question').topic).toBe('Describing symptoms');
});

it('prioritizes urgent topics over routine matches and normalizes punctuation', () => {
  expect(selectMedicalAnswer('I have a cough and chest pain').topic).toBe('Chest pain');
  expect(selectMedicalAnswer("I can't breathe and have asthma").topic).toBe('Severe breathing difficulty');
  expect(selectMedicalAnswer('My tongue swelling started with a rash').topic).toBe('Severe allergic reaction');
  expect(selectMedicalAnswer('I am tired and want to hurt myself').topic).toBe('Immediate mental health safety');
  expect(selectMedicalAnswer('I have one-sided weakness and a headache').topic).toBe('Stroke symptoms');
});
