import create from 'zustand';
import shortid from 'shortid';
import { persist } from 'zustand/middleware';

export interface INote {
  id: string;
  content: string;
  updatedAt: number;
  createdAt: number;
  removedAt?: number | null;
  justSynced?: boolean;
}

type State = {
  auth: any;
  setAuth: (auth: any) => void;
  syncCode: string | null;
  setSyncCode: (code: string | null) => void;
  showList: boolean;
  toggleShowList: (show: boolean) => void;
  notes: INote[];
  setNotes: (notes: INote[]) => void;
  newNote: () => string;
  editNote: (id: string, content: string) => void;
  removeJustSynced: (id: string) => void;
  duplicateNote: (content: string) => string;
  deleteNote: (id: string) => void;
  lastSync: Date | null;
  setLastSync: () => void;
}

export const useStore = create<State>(
  persist(set => ({
    auth: null,
    syncCode: null,
    setAuth: (data) => set((state: State) => ({...state, auth: data})),
    setSyncCode: (code) => set((state: State) => ({...state, syncCode: code})),

    showList: true,
    toggleShowList: (show) => set((state: State) => ({...state, showList: show})),

    notes: [{
      id: shortid(),
      content: `# Welcome to Polar!\n> Just an editor I guess 🐻‍❄️.\n\n- Made for markdown lovers.\n- Distractions free.\n- Sync across your devices.\n\nWanna *contact*, ~~feature request~~ or **give support**: [quocs.com](https://quocs.com).\n`,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    }],
    setNotes: (notes) => set((state: State) => ({...state, notes})),
    newNote: () => {
      const id = shortid();
      set((state: State) => ({
        ...state,
        notes: [
          {
            id,
            content: '',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          ...state.notes,
        ],
      }));
      return id;
    },
    duplicateNote: (content) => {
      const id = shortid();
      set((state: State) => ({
        ...state,
        notes: [
          {
            id,
            content,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          ...state.notes,
        ],
      }));
      return id;
    },
    editNote: (id, content) => set((state: State) => ({
      ...state,
      notes: state.notes.map(note => note.id === id ? {
        ...note,
        content,
        updatedAt: Date.now(),
      } : note),
    })),
    deleteNote: (id) => set((state: State) => ({
      ...state,
      notes: state.notes.map(note => note.id === id ? {
        ...note,
        updatedAt: Date.now(),
        removedAt: Date.now(),
      } : note),
    })),
    removeJustSynced: (id) => set((state: State) => ({
      ...state,
      notes: state.notes.map(note => note.id === id ? {
        ...note,
        justSynced: false,
      } : note),
    })),

    lastSync: null,
    setLastSync: () => set((state: State) => ({...state, lastSync: new Date()})),
  }), {
    name: '@polaris',
  }),
);
