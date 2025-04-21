import type { ModuleProcessor, ProcessingContext } from "./base";
import type { TranspositionModuleConfig, ModuleConfig } from "../types";

interface TranspositionState {
  buffer: Record<string, string[]>;
  outputIndex: Record<string, number>;
}

export class TranspositionProcessor implements ModuleProcessor {
  private state: TranspositionState = {
    buffer: {},
    outputIndex: {}
  };
  
  process(char: string, position: number, config: ModuleConfig, context: Partial<ProcessingContext>): string {
    if (config.type !== "transposition") return char;
    
    const transConfig = config as TranspositionModuleConfig;
    
    // Initialize buffer for this module if needed
    if (!this.state.buffer[config.id]) {
      this.state.buffer[config.id] = [];
      this.state.outputIndex[config.id] = 0;
    }
    
    // Get the current pattern and buffer
    const pattern = transConfig.pattern || [];
    const buffer = this.state.buffer[config.id];
    
    // If pattern is empty, just return the character
    if (!pattern.length) return char;
    
    // Add the character to the buffer
    buffer.push(char);
    
    // If the buffer isn't yet full, return empty for now
    if (buffer.length < pattern.length) {
      return ''; // Will hold the character until the block is complete
    }
    
    // Buffer is full, apply transposition
    const outputIndex = this.state.outputIndex[config.id];
    
    // Check if we've output all characters from this buffer
    if (outputIndex >= pattern.length) {
      // Reset buffer and output index
      this.state.buffer[config.id] = [];
      this.state.outputIndex[config.id] = 0;
      
      // Start a new buffer with the current character
      this.state.buffer[config.id].push(char);
      return '';
    }
    
    // Get the character from the pattern position
    const result = buffer[pattern[outputIndex]];
    
    // Increment output index for next call
    this.state.outputIndex[config.id]++;
    
    return result;
  }
  
  getState(): TranspositionState {
    return this.state;
  }
  
  reset(): void {
    this.state = { buffer: {}, outputIndex: {} };
  }
}