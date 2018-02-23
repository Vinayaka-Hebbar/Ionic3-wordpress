import { Component } from '@angular/core';
import { HomePage } from '../home/home'
import { RegisterPage } from '../register/register'
import { NavController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  login_form: FormGroup;
  error_message: string;
  isLogin:any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public authenticationService: AuthenticationService
  ) {}

  ionViewWillLoad() {
    this.login_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.required)
    });
  }

  login(value){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.authenticationService.doLogin(value.username, value.password)
    .subscribe(res => {
       this.authenticationService.setUser({
         token: res.json().token,
         username: value.username,
         displayname: res.json().user_display_name,
         email: res.json().user_email
       });

       loading.dismiss();
       this.navCtrl.setRoot(HomePage);
     },
     err => {
       loading.dismiss();
       this.error_message = "Invalid credentials.";
       console.log(err);
     })
  }

  skipLogin(){
    this.navCtrl.setRoot(HomePage);
  }

  goToRegister(){
    this.navCtrl.push(RegisterPage);
  }

}
