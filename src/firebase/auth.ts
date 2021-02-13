import firebase from 'firebase';
import toast from 'react-hot-toast';

export async function signInWithGithub() {
  const provider = new firebase.auth.GithubAuthProvider();

  try {
    await firebase.auth().signInWithRedirect(provider);
    // const result = await firebase.auth().getRedirectResult();
    // const result = await firebase.auth().signInWithPopup(provider);
    // const {uid, displayName, email, photoURL} = (result.user as any);
    // return {uid, displayName, email, photoURL};
    return null;
  } catch (error) {
    toast.error(error.message);
  }
}

export async function signOut() {
  firebase.auth().signOut();
}
