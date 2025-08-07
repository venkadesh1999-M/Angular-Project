import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData,doc,updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { addDoc } from 'firebase/firestore'; 
import { inject} from '@angular/core';

export interface Employee {
  id: string;
  email: string;
  username: string;
  code?:string;
  gender: string;
  role?: string;
  designation:string;
  position?: string;
  user_profile: string;
  mobile: string | number;
  dob: Date | string;
  join_date: Date;
  address: string;
  pincode: number | string;
  city: string;
  skype_email: string;
  blood_group: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private employeeCollection;
  constructor(private firestore: Firestore) {
    this.employeeCollection = collection(this.firestore, 'users');
  } 

  getemployee(): Observable<Employee[]> {
    return collectionData(this.employeeCollection, { idField: 'id' }) as Observable<Employee[]>;
  }

  addemployee(employee: Employee): Promise<any> {
    return addDoc(this.employeeCollection, employee);
  }

  updateEmployee(id: string, data: Partial<Employee>): Promise<void> {
    const docRef = doc(this.firestore, `users/${id}`);
    return updateDoc(docRef, data);
  }
}
