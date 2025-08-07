import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormModule, Tabs2Module } from '@coreui/angular';
import { Observable } from 'rxjs';
import { LeaveRequest, ServiceService } from './service.service';
import { Route, Router } from '@angular/router';
import { cilCommentSquare } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';
import { Employee } from '../employee/service.service';
import { Firestore, collection, collectionData, doc, updateDoc, setDoc, getDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [Tabs2Module, CommonModule, FormModule, IconDirective, IconModule, FormsModule],
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss']
})
export class LeaveRequestComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  CasualLeave: LeaveRequest[] = [];
  SickLeave: LeaveRequest[] = [];
  leaveRequest$!: Observable<LeaveRequest[]>;
  selectedRequest?: LeaveRequest;
  isLoading = false;
  isApproving = false;
  icons = { cilCommentSquare };
  selectedEmployeeId: string = '';
  role: string | null = '';
  employeeList: string[] = [];

  constructor(private leaveRequestService: ServiceService, private router: Router, private firestore:Firestore) { }

  ngOnInit(): void {

    this.loadLeaveRequests();
    this.role = localStorage.getItem('role');
    this.onEmployeeChange();
    this.getEmployeName();

  }

  getEmployeName(){
     const docRef = collection(this.firestore, 'users');
            collectionData(docRef).subscribe((data: any[]) => {
              const docData = data.map(user => user.username);
              // Remove duplicates using Set
              this.employeeList = Array.from(new Set(docData));
            });
  }

  loadLeaveRequests(): void {
    const uid = localStorage.getItem('uid');
    const role = localStorage.getItem('role');
    this.leaveRequestService.getLeaveRequests().subscribe((data) => {
      if (role === "3") {
        this.leaveRequests = data.filter((leave) => leave.user_id === uid);
      } else {
        this.leaveRequests = data;
      }
      this.CasualLeave = this.leaveRequests.filter((leave) => leave.leave_type === 'Casual');
      this.SickLeave = this.leaveRequests.filter((leave) => leave.leave_type === 'Sick');
    });
  }


  onEmployeeChange() {
    const uid = localStorage.getItem('uid');
    const role = localStorage.getItem('role');
    this.isLoading = true;

    this.leaveRequestService.getLeaveRequests().subscribe((data) => {
      console.log('Selected employee:', this.selectedEmployeeId);
      if (role === "1") {
        // Admin – filter by selected employee name
        if (this.selectedEmployeeId) {
          this.leaveRequests = data.filter((leave) => leave.name === this.selectedEmployeeId);
        } else {
          this.leaveRequests = data;
        }
      } else if (role === "3") {
        // User – always filter by their own UID (corrected to user_id)
        if (this.selectedEmployeeId) {
          this.leaveRequests = data.filter((leave) => leave.name === this.selectedEmployeeId);
          console.log('Filtered Leave Requests for User:', this.leaveRequests);
        }
      }

      // Apply type-specific filters
      this.CasualLeave = this.leaveRequests.filter((leave) => leave.leave_type === 'Casual');
      this.SickLeave = this.leaveRequests.filter((leave) => leave.leave_type === 'Sick');

      this.isLoading = false;
    }, error => {
      console.error('Error loading leave requests:', error);
      this.isLoading = false;
    });
  }


  addLeave() {
    this.router.navigate(['/Add-leave']);
  }

  review(data: LeaveRequest) {
    this.selectedRequest = data;
    console.log('Selected ID:', this.selectedRequest?.id);
    console.log(this.selectedRequest.status);
  }

  approve() {
    // if (this.isApproving || !this.selectedRequest?.id || this.selectedRequest.status === "Approved") return;
    // this.isApproving = true;
    // if (this.selectedRequest?.id) {
    //   this.leaveRequestService.updateStatus(this.selectedRequest.id, 'Approved').then(() => {
    //     this.selectedRequest!.status = 'Approved'; 
    //     console.log('Status updated to approved.');
    //   }).catch((error) => {
    //     console.log('Error updating status:', error);
    //   }).finally(() => {
    //     this.isApproving = false; // Reset the flag
    //   });
    // }
    if (this.role !== '1') return; // ✅ only admins can approve
    if (this.isApproving || !this.selectedRequest?.id || this.selectedRequest.status === "Approved") return;

    this.isApproving = true;

    this.leaveRequestService.updateStatus(this.selectedRequest.id, 'Approved')
      .then(() => {
        this.selectedRequest!.status = 'Approved';
        console.log('Status updated to approved.');
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      })
      .finally(() => {
        this.isApproving = false;
      });
  }

  reject() {
    // if (this.isApproving || !this.selectedRequest?.id || this.selectedRequest.status === "Rejected") return;
    // this.isApproving = true;
    // if (this.selectedRequest?.id) {
    //   this.leaveRequestService.updateStatus(this.selectedRequest.id, 'Rejected').then(() => {
    //     this.selectedRequest!.status = 'Rejected';
    //     console.log('Status updated to rejected.');
    //   }).catch((error) => {
    //     console.log('Error updating status:', error);
    //   }).finally(() => {
    //     this.isApproving = false; // Reset the flag
    //   });
    // }

    if (this.role !== '1') return; // ✅ only admins can reject
    if (this.isApproving || !this.selectedRequest?.id || this.selectedRequest.status === "Rejected") return;

    this.isApproving = true;

    this.leaveRequestService.updateStatus(this.selectedRequest.id, 'Rejected')
      .then(() => {
        this.selectedRequest!.status = 'Rejected';
        console.log('Status updated to rejected.');
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      })
      .finally(() => {
        this.isApproving = false;
      });
  }

}
