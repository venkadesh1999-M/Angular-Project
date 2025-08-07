import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut,createUserWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private auth: Auth) {}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }


  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // You can also set the username in the user's profile if needed
        const user = userCredential.user;
        // For example, you can use Firestore to store additional user information
        // firestore.collection('users').doc(user.uid).set({ username });
      })
      .catch((error) => {
        console.error('Error during registration:', error);
        throw error; // Propagate the error to the caller
      });
  }
}
