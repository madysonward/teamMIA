import { Injectable, Provider } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabaseModule, AngularFireDatabase } from "angularfire2/database";
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Injectable()
export class AuthService {
    authState: any = null;
    constructor(private http: Http, 
        private router: Router,
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase  
        ){
            this.afAuth.authState.subscribe((auth) => {
                this.authState = auth
              });  
    }
    // Returns true if user is logged in
    get authenticated(): boolean {
        return this.authState !== null;
    }
    // Returns current user data
    get currentUser(): any {
        return this.authenticated ? this.authState: null;
    }

    // Returns
    get currentUserObservable(): any {
        return this.afAuth.authState
    }

    // Returns current user UID
    get currentUserId(): string {
        return this.authenticated ? this.authState.uid: '';
    }

    //// Email/Password Auth ////
    emailSignUp(email:string, password:string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
            this.authState = user
            this.updateUserData()
        })
        .catch(error => console.log(error));
    }

    emailLogin(email:string, password:string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
            this.authState = user
            this.updateUserData()
        })
       .catch(error => console.log(error));
    }
    // //Sends email allowing user to reset password
    // resetPassword(email: string) {
    //     var auth = firebase.auth();
    //     return auth.sendPasswordResetEmail(email)
    //     .then(() => console.log("email sent"))
    //     .catch((error) => console.log(error))
    // }

    //// Sign Out ////
    signOut(): void {
        this.afAuth.auth.signOut();
        this.router.navigate(['/home'])
    }


    //// Helpers ////
    private updateUserData(): void {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features
    let path = `users/${this.currentUserId}`; // Endpoint on firebase
    let data = {
        email: this.authState.email,
        uid: this.authState.uid
    }
      this.db.object(path).update(data)
      .catch(error => console.log(error));
  
    }

}