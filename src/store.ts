import create from 'zustand';
import shortid from 'shortid';
import { persist } from 'zustand/middleware';

export interface INote {
  id: string;
  content: string;
  updatedAt: Date;
  createdAt: Date;
}

type State = {
  showList: boolean;
  toggleShowList: (show: boolean) => void;
  notes: INote[];
  newNote: () => string;
  editNote: (id: string, content: string) => void;
  duplicateNote: (content: string) => string;
  deleteNote: (id: string) => void;
}

export const useStore = create<State>(
  persist(set => ({
    showList: true,
    toggleShowList: (show) => set((state: State) => ({...state, showList: show})),
    notes: [],
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
      } : note).sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt)),
    })),
    deleteNote: (id) => set((state: State) => ({
      ...state,
      notes: state.notes.filter(note => note.id !== id),
    }))
  }), {
    name: 'polar',
  })
);
