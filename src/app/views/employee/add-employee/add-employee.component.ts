import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

import {
  ButtonCloseDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToastCloseDirective,
  ButtonDirective, ColComponent, FormDirective, FormFeedbackComponent, FormLabelDirective,
  GutterDirective, RowDirective
} from '@coreui/angular';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastComponent,
    ToastBodyComponent,
    ToastCloseDirective,
    ButtonDirective,
    ToasterComponent,
    ColComponent,
    FormDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    GutterDirective,
    RowDirective
  ],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  confirmBack = false;
  showConfirmToast = false;
  message: string = "";
  visible = false;
  customStylesValidated = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  employee: Employee = {
    id: '',
    email: '',
    username: '',
    designation: '',
    code: '',
    role: '',
    gender: '',
    user_profile: '',
    mobile: '' ,
    dob: '',
    join_date: new Date(),
    address: '',
    pincode: '',
    city: '',
    skype_email: '',
    blood_group: ''
  };

  constructor(private employeeService: ServiceService, private router: Router) { }

  isAgeValid(dob: any): boolean {
    if (!dob) return false;
    let dobDate: Date;
    if (typeof dob === 'string') {
      const [year, month, day] = dob.split('-').map(Number);
      dobDate = new Date(year, month - 1, day);
    } else {
      dobDate = new Date(dob);
    }
    const today = new Date();
    today.setHours(0,0,0,0);
    dobDate.setHours(0,0,0,0);
    // DOB must be strictly before today
    if (dobDate.getTime() >= today.getTime()) {
      // For error display, return false
      return false;
    }
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    // For error display, return false if under 18
    if (age < 18) {
      return false;
    }
    return true;
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.employee.user_profile = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async submitForm() {
  this.customStylesValidated = true;

  if (
    !this.employee.email ||
    !this.employee.username ||
    !this.employee.gender ||
    !this.employee.mobile ||
    !this.employee.dob ||         // Check if DOB is entered
    !this.employee.join_date ||
    !this.employee.address ||
    this.employee.pincode === '' ||
    !this.employee.city
  ) {
    this.message = 'Please fill all required fields.';
    this.visible = true;
    return;
  }

  if (!this.employee.email.toLowerCase().endsWith('@gmail.com')) {
    this.message = 'Email must be a Gmail address (ending with @gmail.com).';
    this.visible = true;
    return;
  }

  // Age check only happens if DOB exists
  if (!this.isAgeValid(this.employee.dob)) {
    this.message = "Employee must be at least 18 years old.";
    this.visible = true;
    return;
  }


  const auth = getAuth();
  this.employee.id = auth.currentUser?.uid || '';

  if (this.selectedFile) {
    const storage = getStorage();
    const fileRef = ref(storage, `profile_images/${Date.now()}_${this.selectedFile.name}`);
    await uploadBytes(fileRef, this.selectedFile);
    const downloadURL = await getDownloadURL(fileRef);
    this.employee.user_profile = downloadURL;
  }

  this.employeeService.addemployee(this.employee)
    .then(() => {
      this.message = "Employee added successfully";
      this.visible = true;
      setTimeout(() => {
        this.router.navigate(['/employee']);
        this.resetForm();
      }, 1500);
    })
    .catch((err) => {
      console.error('Error adding employee:', err);
    });
}



  backBtn(): void {
    // if( this.employee.email == "" &&
    //   this.employee.username == "" &&
    //   this.employee.designation == "" &&
    //   this.employee.role == "" &&
    //   this.employee.blood_group == "" &&
    //   this.employee.skype_email == "" &&
    //   this.employee.address == "" &&
    //   this.employee.pincode == "" &&
    //   this.employee.city == "" &&
    //   this.employee.mobile == "" &&
    //   this.employee.dob == ""&&
    //   this.employee.gender == "" &&
    //   this.employee.blood_group == ""
    //  ){
    //   this.router.navigate(['/employee']);
    //   return;
    //   }

     const isFormDirty = this.employee.email !== "" ||
    this.employee.username !== "" ||
    this.employee.designation !== "" ||
    this.employee.blood_group !== "" ||
    this.employee.skype_email !== "" ||
    this.employee.address !== "" ||
    this.employee.pincode !== "" && this.employee.pincode !== 0 ||
    this.employee.city !== "" ||
    this.employee.mobile !== "" ||
    this.employee.dob !== "" ||
    this.employee.gender !== "";

  if (!isFormDirty) {
    this.router.navigate(['/employee']);
    return;
  }

      
    // console.log(this.employee.email)
    this.showConfirmToast = true;
    this.confirmBack = false;
  }

  proceedBack(): void {
    this.router.navigate(['/employee']);
  }

  cancelBack(): void {
    this.showConfirmToast = false;
  }

  resetForm(): void {
    this.employee = {
      id: '',
      email: '',
      username: '',
      designation: '',
      gender: '',
      user_profile: '',
      mobile: '',
      dob: new Date(),
      join_date: new Date(),
      address: '',
      pincode: 0,
      city: '',
      skype_email: '',
      blood_group: ''
    };
    this.selectedFile = null;
    this.imagePreview = null;
  }
}
