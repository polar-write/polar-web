import create from 'zustand';
import shortid from 'shortid';
import { persist } from 'zustand/middleware';

export interface INote {
  id: string;
  content: string;
  updatedAt: Date;
  createdAt: Date;
  removedAt?: Date | null;
  justSynced?: boolean;
}

type State = {
  auth: any;
  setAuth: (auth: any) => void;
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
    setAuth: (data) => set((state: State) => ({...state, auth: data})),
    showList: true,
    toggleShowList: (show) => set((state: State) => ({...state, showList: show})),
    notes: [],
    setNotes: (notes) => set((state: State) => ({...state, notes})),
    newNote: () => {
      const id = shortid();
      set((state: State) => ({
        ...state,
        notes: [
          {
            id,
            content: '',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            createdAt: new Date(),
            updatedAt: new Date(),
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
        updatedAt: new Date(),
      } : note),
    })),
    deleteNote: (id) => set((state: State) => ({
      ...state,
      notes: state.notes.map(note => note.id === id ? {
        ...note,
        updatedAt: new Date(),
        removedAt: new Date(),
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
    name: 'polar',
  }),
);
