import {Component, OnInit} from '@angular/core';
import {NgForm, Form} from '@angular/forms';
import {AuthService} from "../auth/auth.service";
import {Injectable, Provider} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabaseModule, AngularFireDatabase, AngularFireList ,AngularFireObject} from "angularfire2/database";
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	users: any[];
	clicks: number = 0;
	//uid = this.authservice.authState.uid;
	constructor(
		private authservice: AuthService,
		private db: AngularFireDatabase
	) {}
    
	ngOnInit() {
		this.authservice.getUsers()
		.subscribe(
			user => {
			this.users = user.reverse() }),
			(error) => console.log(error)
	}
	// 	this.authservice.getClicks().subscribe(users => {
	// 		this.users = users
	// 	})
	// }
}