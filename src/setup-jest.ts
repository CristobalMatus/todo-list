// setup-jest.ts
import 'reflect-metadata';
import 'jest-preset-angular/setup-jest';

// Mock localStorage para las pruebas
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock console.warn para suprimir advertencias durante las pruebas
const originalWarn = console.warn;
beforeEach(() => {
  console.warn = jest.fn();
});

afterEach(() => {
  console.warn = originalWarn;
});


