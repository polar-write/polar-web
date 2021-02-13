import firebase from 'firebase'
import toast from 'react-hot-toast';
import { INote } from '../store';

const db = firebase.firestore();

export const getNotes = (uid: string) => {
  return db.collection('notes')
      .doc(uid)
      .collection('notes')
      .get();
}

export const uploadNotes = async (uid: string, notes: INote[]) => {
  const doc = db.collection('notes').doc(uid);
  
  const docData = await doc.get();
  
  let lastSync: any = null;

  if (docData.exists) {
    lastSync = ((docData.data() as any).lastSync as any);
  }

  const batch = db.batch();

  const notesToSync = lastSync ? notes.filter(note => note.updatedAt > lastSync.toDate()) : notes;

  console.log('notesToSync', notesToSync);

  if (notesToSync.length) {
    notesToSync.forEach(note => {
      batch.set(doc.collection('notes').doc(note.id), note);
    });
    batch.set(doc, {lastSync: new Date()});
    batch.commit().then(() => console.log('updated'));
    return true;
  }

  console.log('nothing to upload');
  return false;
}

export const streamNotes = (uid: string, observer: any) => {
  return db.collection('notes')
      .doc(uid)
      .collection('notes')
      .orderBy('updatedAt')
      .onSnapshot(observer);
};
