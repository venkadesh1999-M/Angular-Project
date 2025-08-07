import { Component, OnInit } from '@angular/core';
import { Holidays, ServiceService } from './service.service'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-holidays',
  standalone:true,
  imports: [FormsModule,CommonModule],
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']})
export class HolidaysComponent implements OnInit{
  holidays$!: Observable<Holidays[]>;
  holidays: Holidays[] = [];

  constructor(private HolidayService: ServiceService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.HolidayService.addAllHolidays();

    this.holidays$ = this.HolidayService.getHolidays();
    this.holidays$.subscribe((data => {
      this.holidays = data;
    }));
  }

  backBtn() {
    this.router.navigate(['/dashboard']);
  }
} 
