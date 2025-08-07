import { Injectable } from '@angular/core';
import { Firestore,addDoc,collection, collectionData,getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Holidays{
   id?: string;
  name: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
   holidays: Holidays[] = [
 { name: "New Year's Day", date: "2025-01-01" },
  { name: "Pongal", date: "2025-01-14" },
  { name: "Republic Day", date: "2025-01-15" },
  { name: "Holi", date: "2025-03-29" },
  { name: "Independence Day", date: "2025-08-15" },
  { name: "Ayudha Puja", date: "2025-10-01" },
  { name: "Gandhi Jayanti", date: "2025-10-02" },
  { name: "Diwali", date: "2025-11-01" },
  { name: "Christmas Day", date: "2025-12-25" }

  ]
  
  private holidaysCollection;

  constructor(private firestore:Firestore){
     this.holidaysCollection  = collection(this.firestore, 'Holidays')
  }

  getHolidays():Observable<Holidays[]>{
    return collectionData(this.holidaysCollection,{ idField:'id'}) as Observable<Holidays[]>;

  }

  // addAllHolidays(): void {
  //   this.holidays.forEach((holiday) => {
  //     addDoc(this.holidaysCollection,holiday)
  //   })
  // }

  async addAllHolidays(): Promise<void> {
  const snapshot = await getDocs(this.holidaysCollection);
  if (snapshot.empty) {
    this.holidays.forEach((holiday) => {
      addDoc(this.holidaysCollection, holiday);
    });
  }
}
}
