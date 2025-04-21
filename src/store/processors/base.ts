import type { ModuleConfig, CharacterSetOption } from "../types";

export interface ProcessingContext {
  characterSet: CharacterSetOption;
  position: number;
  inputChar: string;
  outputChar: string;
  moduleId: string;
}

/**
 * Base interface for all module processors
 */
export interface ModuleProcessor {
  process(char: string, position: number, config: ModuleConfig, context: Partial<ProcessingContext>): string;
  updateState?(moduleId: string, config: ModuleConfig): boolean;
  getState?(): Record<string, any>;
  reset?(): void;
}

// Utility functions for processor implementations
export function getAlphabetForCharSet(charSet: CharacterSetOption): string {
  switch (charSet) {
    case "uppercase":
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    case "full":
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    case "extended":
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/";
    default:
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
}

export function charIndex(char: string, alphabet: string): number {
  return alphabet.indexOf(char);
}

export function charAtIndex(index: number, alphabet: string): string {
  const wrappedIndex = ((index % alphabet.length) + alphabet.length) % alphabet.length;
  return alphabet[wrappedIndex];
}

export function shiftChar(char: string, shift: number, alphabet: string): string {
  const index = charIndex(char, alphabet);
  if (index === -1) return char;
  return charAtIndex(index + shift, alphabet);
}

/**
 * Helper to preserve character case when processing
 */
export function preserveCase(originalChar: string, resultChar: string): string {
  const isLowerCase = originalChar === originalChar.toLowerCase() && 
                      originalChar !== originalChar.toUpperCase();
  
  if (isLowerCase) {
    return resultChar.toLowerCase();
  }
  return resultChar.toUpperCase();
}