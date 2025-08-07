import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { Router } from '@angular/router';
import { Employee, ServiceService } from '../../employee/service.service';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FormModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  employee: Employee[] = [];
  allTaskData: any[] = [];
  selectedTaskData:any[] =[];
  selectedEmployeeId: string = ''
  employeeName:string = '';
  visible= false;
  selectDatavisible = false
  isLoading = false;
  constructor(
    private router: Router,
    private employeeService: ServiceService,
    private firestore: Firestore,
    
  ) {}

  ngOnInit(): void {
    this.loadAllData();
    this.visible = true;
    this.selectDatavisible = false;
  }

  onEmployeeChange(){
     if (this.selectedEmployeeId) {
      this.getData();
      this.selectDatavisible = true;
      this.visible = false;
    }else{
      this.selectDatavisible = false;
      this.visible = true;
      this.selectedTaskData = [];
      this.employeeName = '';
    }
  }

  async getData() {
  this.selectedTaskData = []; // ✅ Clear previously filtered data

  this.employeeService.getemployee().subscribe((data) => {
    this.employeeName = data.find(emp => emp.id === this.selectedEmployeeId)?.username || '';
  });

  const taskDatesRef = collection(this.firestore, `timesheet/${this.selectedEmployeeId}/tasks`);
  const taskDatesSnap = await getDocs(taskDatesRef);

  for (const dateDoc of taskDatesSnap.docs) {
    const date = dateDoc.id;
    const detailsRef = collection(this.firestore, `timesheet/${this.selectedEmployeeId}/tasks/${date}/details`);
    const detailsSnap = await getDocs(detailsRef);

    for (const taskDoc of detailsSnap.docs) {
      const task = taskDoc.data();

      let totalMinutes = 0;
      if ('estimation' in task) {
        totalMinutes = Number(task['estimation']) || 0;
      } else {
        const hrs = Number(task['hours']) || 0;
        const mins = Number(task['minutes']) || 0;
        totalMinutes = hrs * 60 + mins;
      }

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      this.selectedTaskData.push({
        date: date,
        employeeName: this.employeeName,
        title: task['title'],
        estimation: totalMinutes,
        hours: hours,
        minutes: minutes,
        owner: task['owner'] || 'N/A'
      });
    }
  }
  console.log('Filtered task data:', this.selectedTaskData);
}



  async loadAllData() {
    this.employeeService.getemployee().subscribe(async (data) => {
      this.employee = data;
      const allTasks: any[] = [];

      for (const emp of this.employee) {
        const empId = emp.id;
        const empName = emp.username;

        const taskDatesRef = collection(this.firestore, `timesheet/${empId}/tasks`);
        const taskDatesSnap = await getDocs(taskDatesRef);

        for (const dateDoc of taskDatesSnap.docs) {
          const date = dateDoc.id;

          const detailsRef = collection(this.firestore, `timesheet/${empId}/tasks/${date}/details`);
          const detailsSnap = await getDocs(detailsRef);

          for (const taskDoc of detailsSnap.docs) {
            const task = taskDoc.data();

            // Convert all to minutes
            let totalMinutes = 0;
            if ('estimation' in task) {
              totalMinutes = Number(task['estimation']) || 0;
            } else {
              const hrs = Number(task['hours']) || 0;
              const mins = Number(task['minutes']) || 0;
              totalMinutes = hrs * 60 + mins;
            }

            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            allTasks.push({
              employeeName: empName,
              employeeId: empId,
              date: date,
              title: task['title'],
              estimation: totalMinutes,
              hours: hours,
              minutes: minutes,
              owner: task['owner'] || 'N/A'
            });
          }
        }
      }

      this.allTaskData = allTasks;
      // console.log('All task data:', this.allTaskData);
    });
  }

 

  addtimesheet() {
    this.router.navigate(['/Task-List']);
  }
}
