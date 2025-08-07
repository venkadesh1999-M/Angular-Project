import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee, ServiceService } from './service.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { cilPencil, cilCheckCircle } from '@coreui/icons';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, IconDirective, IconModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  icons = { cilPencil, cilCheckCircle };
  employees$: Observable<Employee[]>;
  employee: Employee[] = [];
  currentUser: User | null = null;

  constructor(
    private employeeService: ServiceService,
    private router: Router,
    private auth: Auth
  ) {
    this.employees$ = this.employeeService.getemployee();
  }

  // ngOnInit(): void {
  //   this.CheckLogin();
  // }

  // CheckLogin() {
  //   onAuthStateChanged(this.auth, (user) => {
  //     if (user) {
  //       this.currentUser = user;

  //       this.employees$.subscribe((data) => {
  //         const isAdmin = data.some(emp => emp.email === user.email && emp.role === 'admin');

  //         this.employee = data
  //           .filter(emp => isAdmin || emp.email === user.email) // admin sees all, user sees own
  //           .map(emp => ({
  //             ...emp,
  //             join_date: this.convertToDate(emp.join_date),
  //             dob: this.convertToDate(emp.dob),
  //           }));

  //         console.log('Filtered Employees:', this.employee);
  //       });
  //     }
  //   });
  // }

  ngOnInit(): void {
      const role = localStorage.getItem("role")
  console.log( 'Role:', role,typeof role);

    this.employees$.subscribe((data) => {
      this.employee = data.map((emp) => {
        return {
          ...emp,
          join_date: this.convertToDate(emp.join_date),
          dob: this.convertToDate(emp.dob), // convert dob if needed
        };
      });
      console.log(this.employee);
    });
  }

  convertToDate(value: any): Date {
    if (value?.seconds !== undefined) {
      return new Date(value.seconds * 1000);
    } else if (value instanceof Date) {
      return value;
    } else if (typeof value === 'string') {
      return new Date(value);
    } else {
      return new Date();
    }
  }

  Performance(index: number) {
    this.router.navigate([`/performance`, index]);
  }

  editBtn(index: number) {
    this.router.navigate([`/show-employee`, index]);
  }

  addBtn(): void {
    this.router.navigate(['/add-employee']);
  }
}
