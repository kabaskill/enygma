import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, ModuleConfig, Theme } from './types';
import { useModuleStore } from './moduleStore';
import { useMessageStore } from './messageStore';

interface AppStoreState extends AppState {
  setTheme: (theme: Theme) => void;
  createPreset: (name: string) => void;
  updatePreset: (name: string) => void;
  deletePreset: (name: string) => void;
  loadPreset: (name: string) => void;
  setActivePreset: (name: string) => void;
}

const DEFAULT_PRESETS: Record<string, ModuleConfig[]> = {
  "Enigma": [
    {
      id: "enigma-rotors",
      type: "rotors",
      enabled: true,
      minimized: false,
      showInputOutput: true,
      rotorSettings: [
        { rotor: "I", ringSetting: 0 },
        { rotor: "II", ringSetting: 0 },
        { rotor: "III", ringSetting: 0 }
      ]
    },
    {
      id: "enigma-plugboard",
      type: "plugboard",
      enabled: true,
      minimized: false,
      showInputOutput: true,
      mapping: {}
    },
    {
      id: "enigma-reflector",
      type: "reflector",
      enabled: true,
      minimized: false,
      showInputOutput: true,
      reflectorType: "standard"
    }
  ],
  "Caesar Cipher": [
    {
      id: "caesar",
      type: "shifter",
      enabled: true,
      minimized: false,
      showInputOutput: true,
      shift: 3
    }
  ],
  "Vigenère": [
    {
      id: "vigenere",
      type: "vigenere",
      enabled: true,
      minimized: false,
      showInputOutput: true,
      keyword: "KEY"
    }
  ]
};

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      activePreset: 'Custom',
      presets: DEFAULT_PRESETS,
      
      setTheme: (theme) => set({ theme: theme }),
      
      createPreset: (name) => {
        if (name && name.trim() !== '') {
          const { modules } = useModuleStore.getState();
          set(state => ({
            presets: {
              ...state.presets,
              [name]: JSON.parse(JSON.stringify(modules)) // Deep copy
            },
            activePreset: name
          }));
        }
      },
      
      updatePreset: (name) => {
        if (name && name.trim() !== '' && get().presets[name]) {
          const { modules } = useModuleStore.getState();
          set(state => ({
            presets: {
              ...state.presets,
              [name]: JSON.parse(JSON.stringify(modules)) // Deep copy
            }
          }));
        }
      },
      
      deletePreset: (name) => {
        if (DEFAULT_PRESETS[name]) {
          // Don't allow deleting default presets
          return;
        }
        
        set(state => {
          const newPresets = { ...state.presets };
          delete newPresets[name];
          
          return {
            presets: newPresets,
            activePreset: name === state.activePreset ? 'Custom' : state.activePreset
          };
        });
      },
      
      loadPreset: (name) => {
        const preset = get().presets[name];
        if (preset) {
          const deepCopy = JSON.parse(JSON.stringify(preset));
          useModuleStore.getState().setModules(deepCopy);
          set({ activePreset: name });
          
          // Process any existing message text
          setTimeout(() => {
            useMessageStore.getState().processText();
          }, 0);
        }
      },
      
      setActivePreset: (name) => {
        set({ activePreset: name });
      }
    }),
    {
      name: 'enigma-app-store',
    }
  )
);