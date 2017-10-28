import {Injectable, Provider} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabaseModule, AngularFireDatabase, AngularFireList, } from "angularfire2/database";
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {SignupService} from "./signup.service";



@Injectable()
export class AuthService {
	authState: any = null;
	user: any[];
	clicks: number = 0;
	clicksRef: AngularFireList<any>;

    constructor(
		private router: Router,
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private signupservice: SignupService
    ){
        this.afAuth.authState.subscribe((auth) => {
            this.authState = auth
		});
		this.clicksRef = db.list("users");
	}
	
    //RETURN TRUE IF USER IS LOGGED IN
    get authenticated(): boolean {
        return this.authState !== null;
    }
    //RETURN CURRENT USER'S DATA
    get currentUser(): any {
        return this.authenticated ? this.authState: null;
    }
    //RETURN
    get currentUserObservable(): any {
        return this.afAuth.authState
    }

    //RETURN CURRENT USER'S UID
    get currentUserId(): string {
        return this.authenticated ? this.authState.uid: '';
	}
	//LEADERBOARDS
		userClicks(user){
		let uid = firebase.auth().currentUser.uid;
		console.log(uid)
		this.db.list(`users/${uid}`,
		ref => {
			ref.child("clicks").transaction(clicks => clicks +1)
			return user
		})
		
	// 	let newClicks = this.clicks + 1;
	// 	this.clicksRef.update(uid, {clicks: newClicks})
	// 	if(uid && this.clicks){
	// 	this.updateUserData(this.clicks + 1)
	// 	}
	// 	return(
	// 	this.db.object("users").update(this.clicks))
		//console.log("users")
	}
	//SIGN UP
    emailSignUp(user, password) {
        return this.afAuth.auth.createUserWithEmailAndPassword(user.email, password)
        .then((newUser) => {
            this.authState = newUser;
			this.updateUserData(user);
			this.router.navigate(['/video']);
        })
		.catch(error => console.log(error));
    }
	//LOGIN W/ EMAIL & PASSWORD
    emailLogin(email:string, password:string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((currentUser) => {
            this.authState = currentUser
          //  this.updateUserData()
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
    //LOG OUT
    signOut(): void {
        this.afAuth.auth.signOut();
        this.router.navigate(['/home'])
	}
	
    //// Helpers ////
    private updateUserData(user): void {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features
    let path = `users/${this.currentUserId}`; // Endpoint on firebase
    let data = {
        fname: user.fname,
        lname: user.lname,
        email: this.authState.email,
        uid: this.authState.uid,
        company: user.company,
		location: user.location,
		clicks: user.clicks
    }
    this.db.list("users").set(this.currentUserId, data)
    .catch(error => console.log(error));
    }
}