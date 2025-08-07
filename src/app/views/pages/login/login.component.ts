import { Component, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { Firestore, collection, collectionData, doc, updateDoc, setDoc, getDoc } from '@angular/fire/firestore';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, FormModule } from '@coreui/angular';
import { AuthenticationService } from '../../../authentication.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { ButtonCloseDirective, ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToastCloseDirective, ToasterComponent } from '@coreui/angular';
import { cilLockLocked, cilLockUnlocked } from '@coreui/icons';
import { Employee, ServiceService } from '../../employee/service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ContainerComponent,
    RowComponent, ColComponent,
    ReactiveFormsModule,
    CardGroupComponent,
    TextColorDirective,
    CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective,
    FormControlDirective,
    ButtonDirective, FormModule,
    FormsModule, CommonModule,
    ToastComponent,
    ToastBodyComponent,
    ToastComponent, ButtonDirective, ToastCloseDirective, ToasterComponent,
  ]
})
export class LoginComponent implements OnInit {
  showPassword = false;
  passwordFieldType = 'password';
  // employees$: Observable<Employee[]>
  // employee: Employee[] = []
  customStylesValidated = false;
  email = '';
  password = '';

  message = '';
  public visible = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private firestore: Firestore,
    private employeeService: ServiceService
  ) {

  }

  ngOnInit(): void {

  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.showPassword ? 'text' : 'password';
  }


  LoginBtn() {
    if (this.email === '' || this.password === '') {
      this.customStylesValidated = false;
      return;
    }

    this.authService.login(this.email, this.password)
      .then(async (result) => {
        console.log('Login successful:', result);
        const user = result.user;
        const uid = user.uid;
        localStorage.setItem('uid', uid);


        const docRef = doc(this.firestore, `users/${uid}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("User Data:", data);
          const role = data["role"]
          console.log("My Role",role)
          localStorage.setItem('role', role);
          console.log("Local Storage Role:", localStorage.getItem('role'));
          this.visible = true;
          this.message = 'Login successful!';
          this.customStylesValidated = true;

          // Navigate after short delay
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);

        } else {
         this.visible = true;
          this.message = 'Unauthorized access';
          this.customStylesValidated = false;
        }
        // const employee = this.employee.find((emp) => emp.id === uid) 
        // const role = employee ? employee.role : null
       
        // if (uid && role?.toString() === "1") {
        //   this.visible = true;
        //   this.message = 'Login successful!';
        //   this.customStylesValidated = true;

        //   // Navigate after short delay
        //   setTimeout(() => {
        //     this.router.navigate(['/dashboard']);
        //   }, 1500);
        // } else if (uid && role?.toString() === "3") {
        //   this.visible = true;
        //   this.message = 'Login successful!';
        //   this.customStylesValidated = true;

        //   setTimeout(() => {
        //     this.router.navigate(['/add-employee']);
        //   }, 1500);
        // } else {
        //   this.visible = true;
        //   this.message = 'Unauthorized access';
        //   this.customStylesValidated = false;

        // }

      })
      .catch((error) => {
        this.email = '';
        this.password = '';
        this.visible = true;
        this.message = 'Invalid email or password';
        console.error('Login error:', error);
      });
  }

}

