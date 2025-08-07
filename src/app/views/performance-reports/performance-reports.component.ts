import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { FormModule } from '@coreui/angular';
import { Observable } from 'rxjs';
import { Employee, ServiceService } from '../employee/service.service';
import { type ChartData } from 'chart.js';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-performance-reports',
  standalone: true,
  imports: [CommonModule, FormModule, ChartjsComponent],
  templateUrl: './performance-reports.component.html',
  styleUrls: ['./performance-reports.component.scss']
})
export class PerformanceReportsComponent implements OnInit {
  @ViewChild(ChartjsComponent) chartComponent!: ChartjsComponent;

  data: ChartData = {
    labels: ['Daily', 'Weekly', 'Monthly'],
    datasets: [
      {
        label: 'Estimation (minutes)',
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
        data: [0, 0, 0]
      }
    ]
  };

  dailyTarget = 480;
  weeklyTarget = 2400;
  monthlyTarget = 9600;

  name: string = '';
  employees: Employee[] = [];
  employeeId: number = 0;
  employeeJoinDate: Date = new Date();
  employeeFirebaseId: string = '';
  employees$!: Observable<Employee[]>;
  assignedTarget = { daily: 0, weekly: 0, monthly: 0 };

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    private employeeService: ServiceService,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.employees$ = this.employeeService.getemployee();

    this.employees$.subscribe((data) => {
      this.employees = data;
      const emp = this.employees[this.employeeId];

      this.name = emp.username;
      this.employeeFirebaseId = emp.id;
      console.log('Raw join_date:', emp.join_date);

      // Assign employeeJoinDate as a Date object
      this.employeeJoinDate = this.convertToDate(emp.join_date);
      console.log('Join Date (Date object):', this.employeeJoinDate);

      // Optional: log formatted string version
      console.log('Join Date (YYYY-MM-DD):', this.formatDateToString(this.employeeJoinDate));

      this.getData();
    });
  }

  // Converts input to Date object
  convertToDate(value: any): Date {
    if (value?.seconds !== undefined) {
      // Firestore timestamp
      return new Date(value.seconds * 1000);
    } else if (value instanceof Date) {
      return value;
    } else if (typeof value === 'string') {
      return new Date(value);
    } else {
      return new Date(); 
    }
  }

  // Formats Date object as YYYY-MM-DD string
  formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // month 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async getData(): Promise<void> {
    const taskDatesPath = `timesheet/${this.employeeFirebaseId}/tasks`;
    const today = new Date();
    const todayDateStr = today.toISOString().split('T')[0];
    console.log('Today Date:', todayDateStr);

    try {
      const dateDocsRef = collection(this.firestore, taskDatesPath);
      const dateDocsSnap = await getDocs(dateDocsRef);

      if (dateDocsSnap.empty) return;

      for (const dateDoc of dateDocsSnap.docs) {
        const dateId = dateDoc.id;
        console.log('Processing Date ID:', dateDoc);
        const taskDate = new Date(dateId);
        const taskDateStr = taskDate.toISOString().split('T')[0];
        console.log('Task Date:', taskDateStr);

        if (taskDate < this.employeeJoinDate) continue;

        const detailsPath = `timesheet/${this.employeeFirebaseId}/tasks/${dateId}/details`;
        const detailsRef = collection(this.firestore, detailsPath);
        const detailsSnap = await getDocs(detailsRef);

        for (const detailDoc of detailsSnap.docs) {
          const task = detailDoc.data();
          console.log(task)
          let totalMinutes = 0;

          if ('estimation' in task) {
            totalMinutes = Number(task['estimation']) || 0;
          } else {
            totalMinutes = (Number(task['hours'] || 0) * 60) + Number(task['minutes'] || 0);
          }

          if (taskDateStr === todayDateStr) {
            this.assignedTarget.daily += totalMinutes;
            console.log(this.assignedTarget.daily)
          }

          if (
            taskDate.getFullYear() === today.getFullYear() &&
            taskDate.getMonth() === today.getMonth()
          ) {
            this.assignedTarget.monthly += totalMinutes;
          }

          const diff = today.getTime() - taskDate.getTime();
          if (diff <= 6 * 24 * 60 * 60 * 1000 && diff >= 0) {
            this.assignedTarget.weekly += totalMinutes;
          }
        }
      }

      this.data.datasets[0].data = [
        this.assignedTarget.daily,
        this.assignedTarget.weekly,
        this.assignedTarget.monthly
      ];

      this.cdRef.detectChanges();
      this.chartComponent.chart?.update();
    } catch (error) {
      console.error('Error reading Firestore:', error);
    }
  }

  goBack(): void {
    this.router.navigate(['/employee']);
  }
}
