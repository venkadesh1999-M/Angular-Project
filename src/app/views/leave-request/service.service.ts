import { Injectable } from '@angular/core';
import { addDoc, doc, Firestore,setDoc,collection,collectionData } from '@angular/fire/firestore';
import {  } from 'firebase/firestore';
import { Observable } from 'rxjs';


export interface LeaveRequest {
  id?:string;
  user_id?: string;    
  name: string;
  emp_code?: string;
  leave_day: string;
  start_date: string;
  end_date: string;
  leave_type: string;
  leave_reason?: string;
  no_of_days: string | number;
  status: string;
  medical_doc: string;
  user_profile?: string;
}
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private leavecollection;
    constructor(private firestore:Firestore){
      this.leavecollection = collection(this.firestore,'leave_request_form')
    }

    getLeaveRequests() : Observable<LeaveRequest[]>{
      return collectionData(this.leavecollection, { idField: 'id' }) as Observable<LeaveRequest[]>;
    }

    updateStatus(id:string,status:string): Promise<void>{
      const leaveDocRef = doc(this.firestore, 'leave_request_form', id);
      return setDoc(leaveDocRef, { status: status }, { merge: true });
    }

    addLeaveRequest(leaveRequest: LeaveRequest): Promise<any> {
    const uid = localStorage.getItem('uid');
    console.log('Adding Leave Request for User ID:', uid);
    const newDocRef = doc(this.leavecollection);
    const dataWithUserId = { ...leaveRequest, user_id: uid };
    return setDoc(newDocRef, dataWithUserId);
  }
}
