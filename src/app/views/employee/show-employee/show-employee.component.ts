import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxFormModule,
  DxTabPanelModule,
  DxButtonModule,
  DxSelectBoxModule,
  DxDateBoxModule,
  DxTextBoxModule
} from 'devextreme-angular';
import { Observable } from 'rxjs';
import { Employee, ServiceService } from '../service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { cilImagePlus } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { IconModule } from '@coreui/icons-angular';

import {
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastCloseDirective,
} from '@coreui/angular';

@Component({
  selector: 'app-show-employee',
  standalone: true,
  imports: [
    CommonModule,
    DxFormModule,
    DxTabPanelModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxTextBoxModule,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
        ToastCloseDirective,
     IconModule

  ],
  templateUrl: './show-employee.component.html',
  styleUrls: ['./show-employee.component.scss']
})
export class ShowEmployeeComponent implements OnInit {
  message :string = "";
    confirmBack = false;
  customStylesValidated = false;

  visible = false;
  showConfirmToast = false
    icons = { cilImagePlus };

  bloodGroupList = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  genderList = ['Male', 'Female', 'Other'];

  employeeList = [
    'IT Support Specialist',
    'Junior Software Developer',
    'Senior Software Engineer',
    'Lead Developer',
    'Solutions Architect',
    'Project Manager'
  ];

  employees: Employee[] = [];
  employeeId: number = 0;
  employees$!: Observable<Employee[]>;
  employee: Employee = {
    id: '',
    email: '',
    username: '',
    gender: '',
    designation:'',
    role: '',
    user_profile: '',
    mobile: 0,
    dob: new Date(),
    join_date: new Date(),
    address: '',
    pincode: 0,
    city: '',
    skype_email: '',
    blood_group: ''
  };
  originalEmployee!: Employee;

  constructor(
    private employeeService: ServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.employees$ = this.employeeService.getemployee();

    this.employees$.subscribe((data) => {
      this.employees = data;
      this.employee = this.employees[this.employeeId];

      this.employee.dob = this.convertToDate(this.employee.dob);
      this.employee.join_date = this.convertToDate(this.employee.join_date);

      this.originalEmployee = JSON.parse(JSON.stringify(this.employee));
      this.originalEmployee.dob = new Date(this.originalEmployee.dob);
      this.originalEmployee.join_date = new Date(this.originalEmployee.join_date);
    });
  }

  convertToDate(value: any): Date {
    return (value as any)?.toDate?.() ?? new Date(value);
  }

  hasChanges(): boolean {
    const o = this.originalEmployee;
    const c = this.employee;

    return (
      o.email !== c.email ||
      o.designation !== c.designation ||
      o.username !== c.username ||
      o.gender !== c.gender ||
      o.mobile !== c.mobile ||
      o.join_date?.getTime() !== c.join_date?.getTime() ||
      o.address !== c.address ||
      o.city !== c.city ||
      o.pincode !== c.pincode ||
      o.skype_email !== c.skype_email ||
      o.blood_group !== c.blood_group ||
      o.user_profile !== c.user_profile
    );
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.employee.user_profile = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default.png';
  }

  // backBtn(): void {
  //   this.confirmBack = true;
  // }

  confirmBackNavigation(confirmed: boolean): void {
  this.confirmBack = false;  // Hide toast
  if (confirmed) {
    this.router.navigate(['/employee']); // Navigate if confirmed
  }
}

updateBtn(): void {
  this.customStylesValidated = true;

  const isEmpty = (val: any): boolean =>
    val === null || val === undefined || (typeof val === 'string' && val.trim() === '');

  const isInvalid = (
    isEmpty(this.employee.email) ||
    isEmpty(this.employee.username) ||
    isEmpty(this.employee.address) ||
    isEmpty(this.employee.city) ||
    !this.employee.pincode ||
    !this.employee.mobile || isNaN(Number(this.employee.mobile)) ||
    isEmpty(this.employee.blood_group) ||
    isEmpty(this.employee.gender) ||
    isEmpty(this.employee.designation) ||
    isEmpty(this.employee.skype_email)||
    this.employee.join_date == null ||
    this.employee.dob == null ||
    isEmpty(this.employee.user_profile)
  );

  // Check required fields
  if (isInvalid) {
    this.visible = true;
    this.message = "Please fill all required fields.";
    return;
  }

  //  Check if any actual data has changed
  if (!this.hasChanges()) {
    this.visible = true;
    this.message = "No changes detected to update.";
    return;
  }

  // Prepare clean values with trimmed strings
  const isValidDate = (date: any) =>
    date instanceof Date && !isNaN(date.getTime());

  const cleanEmployee: Partial<Employee> = {
    ...this.employee,
    email: this.employee.email.trim(),
    username: this.employee.username.trim(),
    address: this.employee.address.trim(),
    city: this.employee.city.trim(),
    skype_email: this.employee.skype_email?.trim() || '',
    blood_group: this.employee.blood_group.trim(),
    gender: this.employee.gender.trim(),
    user_profile: this.employee.user_profile.trim(),
    dob: isValidDate(this.employee.dob) ? this.employee.dob : new Date(),
    join_date: isValidDate(this.employee.join_date) ? this.employee.join_date : new Date()
  };

  // ✅ Call update and show message
  this.employeeService.updateEmployee(this.employee.id, cleanEmployee)
    .then(() => {
      this.visible = true;
      this.message = "Employee updated successfully";
      setTimeout(() => {
        this.router.navigate(['/employee']);
      }, 1000);
    })
    .catch((err) => {
      console.error('Error updating employee:', err);
    });
}


  backBtn(): void {
  if (this.hasChanges()) {
    this.showConfirmToast = true; // Show confirmation toast if data is modified
  } else {
    this.router.navigate(['/employee']); // Directly go back if no changes
  }
}

  proceedBack(): void {
    this.router.navigate(['/employee']);
  }

  cancelBack(): void {
    this.showConfirmToast = false;
  }
}
