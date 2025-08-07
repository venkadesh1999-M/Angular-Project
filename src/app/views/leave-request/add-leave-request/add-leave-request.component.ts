import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveRequest, ServiceService } from '../service.service';
import { ButtonCloseDirective, ToastBodyComponent, ToastComponent, ToastHeaderComponent, ButtonDirective, ToastCloseDirective, ToasterComponent } from '@coreui/angular';
import { Firestore, collection, collectionData, doc, updateDoc, setDoc, getDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-add-leave-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastComponent,
    ToastBodyComponent,
    ToastComponent, ButtonDirective, ToastCloseDirective, ToasterComponent,
  ],
  templateUrl: './add-leave-request.component.html',
  styleUrls: ['./add-leave-request.component.scss']
})
export class AddLeaveRequestComponent {
  visible = false;
  message: string | boolean = true;
  showConfirmToast = false;
  confirmToast = false;
  leaverequest: LeaveRequest = {
    name: '',
    leave_day: '',
    start_date: '',
    end_date: '',
    leave_type: '',
    leave_reason: '',
    no_of_days: '',
    status: 'Pending',
    medical_doc: '',
  };


  nameOptions: string[] = ['Brindha R', 'Maheswari N', 'Nadesh N', 'Venkadesh M'];
  isAdmin: boolean = false;


  constructor(private service: ServiceService, private router: Router, private firestore: Firestore) { }

  async ngOnInit() {
    const userId =  localStorage.getItem('uid');
    const role = localStorage.getItem('role');
    this.isAdmin = role === '1';
    console.log("role:", role);
    const docRef = doc(this.firestore, `users/${userId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData =  docSnap.data();
      console.log("User data:", userData);
      if (!this.isAdmin) {
        this.leaverequest.name = userData['username'] || '';
        this.nameOptions = [];
      }
      else {
        const docRef = collection(this.firestore, 'users');
        collectionData(docRef).subscribe((data: any[]) => {
          const docData = data.map(user => user.username);
          // Remove duplicates using Set
          this.nameOptions = Array.from(new Set(docData));
          console.log("Available names:", this.nameOptions);
        });
      }
      // For admin, keep dropdown as is
      console.log("User data:", userData['username']);
    }
  }

  backBtn() {
    const isFormDirty = !this.leaverequest.name &&
      !this.leaverequest.leave_day &&
      !this.leaverequest.start_date &&
      !this.leaverequest.end_date &&
      !this.leaverequest.leave_type &&
      !this.leaverequest.leave_reason &&
      !this.leaverequest.no_of_days &&
      !this.leaverequest.leave_day

    if (isFormDirty) {
      this.router.navigate(['/leave']);
      return;
    }
    this.showConfirmToast = true;
    this.confirmToast = false
    // this.router.navigate(['/leave']);
  }

  proceedBack() {
    this.router.navigate(['/leave']);
  }
  cancelBack() {
    this.showConfirmToast = false;
  }


  get isMedicalDocRequired(): boolean {
  const { start_date, end_date } = this.leaverequest;

  if (start_date && end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);
    
    const diffInTime = end.getTime() - start.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24) + 1;

    console.log('Duration in days:', diffInDays);
    return diffInDays > 3;
  }

  return false;
}

  submitBtn(): void {
    const req = this.leaverequest;

    if (
      req.name &&
      req.leave_type &&
      req.start_date &&
      req.end_date &&
      req.leave_reason
    ) {
      const start = new Date(req.start_date);
      const end = new Date(req.end_date);

      if (end < start) {
        this.message = "Strart date cannot be after end date.";
        this.visible = true;
        return;
      }

      this.service.addLeaveRequest(req).then(() => {
        this.message = "Successfully added leave request.";
        this.visible = true;
        setTimeout(() => {
          this.leaverequest.name = '';
          this.leaverequest.leave_day = '';
          this.leaverequest.start_date = '';
          this.leaverequest.end_date = '';
          this.leaverequest.leave_type = '';
          this.leaverequest.leave_reason = '';
          this.leaverequest.no_of_days = 0;
          this.leaverequest.status = 'Pending';
          this.leaverequest.medical_doc = '';
          this.leaverequest.user_profile = '';
          this.router.navigate(['/leave']);
        }, 2000);
      });
    } else {
      // this.message = false;
      // this.visible = true;
    }
  }
}
