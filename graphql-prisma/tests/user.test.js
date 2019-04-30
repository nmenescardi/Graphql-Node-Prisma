import { getFirstName, isValidPassword } from '../src/utils/user';

test('Should return first name when given full name', () => {
  const firstName = getFirstName('Nicolas Menescardi');

  expect(firstName).toBe('Nicolas');
});

test('Should reject password be shorter than 8 chars', () => {
  const isValid = isValidPassword('123456');

  expect(isValid).toBe(false);
});

test('Should reject password that contain word *password*', () => {
  const isValid = isValidPassword('password123');

  expect(isValid).toBe(false);
});

test('Should validate password', () => {
  const isValid = isValidPassword('validPass123');

  expect(isValid).toBe(true);
});
