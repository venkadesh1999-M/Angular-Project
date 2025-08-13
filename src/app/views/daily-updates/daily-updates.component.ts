import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormModule, LocalStorageService } from '@coreui/angular';
import { Employee, ServiceService } from '../employee/service.service';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc, doc, setDoc, deleteDoc } from '@angular/fire/firestore';

import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ToastBodyComponent,
  ToastComponent,
  ToastCloseDirective,
  ToasterComponent
} from '@coreui/angular';

@Component({
  selector: 'app-daily-updates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormModule,
    // CardComponent,
    // CardBodyComponent,
    ToastComponent,
    ToastBodyComponent,
    ButtonDirective,
    ToastCloseDirective,
    ToasterComponent,
  ],
  templateUrl: './daily-updates.component.html',
  styleUrls: ['./daily-updates.component.scss']
})
export class DailyUpdatesComponent {
  employee: Employee[] = [];
  employeeId: string = '';
  showTask = false;
  showConfirmToast = false;
  confirmToast = false;
  taskToDeleteIndex: number | null = null;

  constructor(
    private employeeService: ServiceService,
    private router: Router,
    private firestore: Firestore
  ) {
    this.employeeService.getemployee().subscribe((data) => {
      this.employee = data;
      // this.employeeId = this.employee[3]?.id || '';

    });

   this.employeeId = localStorage.getItem('uid') || "";
    console.log(this.employeeId)

  }

  totalEstimation = { hours: 0, minutes: 0 };
  message = '';
  visible = false;
  today = new Date().toISOString().split('T')[0];
  isOpen = false;
  showtable = false;

  employeeList: string[] = ['Venkadesh M', 'Brindha R', 'Sangeetha S', 'Suresh K', 'Arun Kumar M', 'Sanjay M'];
  reportList: string[] = ['Nadesh N', 'Maheswari N'];

  Tasks: any[] = [];

  newTask: any = {
    date: this.today,
    employee: '',
    Report: '',
    task: '',
    hours: null,
    minutes: null
  };

  editIndex: number | null = null;
  editDocId: string | null = null;

  updateTotalEstimation() {
    this.totalEstimation.hours = this.Tasks.reduce((sum, task) => sum + task.hours, 0);
    this.totalEstimation.minutes = this.Tasks.reduce((sum, task) => sum + task.minutes, 0);

    if (this.totalEstimation.minutes >= 60) {
      this.totalEstimation.hours += Math.floor(this.totalEstimation.minutes / 60);
      this.totalEstimation.minutes = this.totalEstimation.minutes % 60;
    }
  }

  async addTask() {
    if (!this.employeeId) {
      this.visible = true;
      this.message = 'Employee ID not found!';
      return;
    }

    const task = { ...this.newTask };
    const date = task.date;

    if (task.employee && task.task) {
      try {
        const dateDocRef = doc(this.firestore, `timesheet/${this.employeeId}/tasks/${date}`);
        await setDoc(dateDocRef, { date }, { merge: true });

        const detailsRef = collection(this.firestore, `timesheet/${this.employeeId}/tasks/${date}/details`);

        if (this.editIndex !== null && this.editDocId) {
          const taskDocRef = doc(detailsRef, this.editDocId);
          await setDoc(taskDocRef, {
            hours: task.hours,
            minutes: task.minutes,
            owner: task.Report,
            title: task.task
          }, { merge: true });

          this.Tasks[this.editIndex] = { ...task, docId: this.editDocId };
          this.message = 'Task updated successfully!';
        } else {
          const newDocRef = await addDoc(detailsRef, {
            hours: task.hours,
            minutes: task.minutes,
            owner: task.Report,
            title: task.task
          });

          this.Tasks.push({ ...task, docId: newDocRef.id });
          this.message = 'Task added & saved successfully!';
        }

        this.updateTotalEstimation();
        this.visible = true;
        this.isOpen = false;
        this.showtable = true;
        this.resetNewTask();
        this.showTask = true;
      } catch (error) {
        console.error('Error saving task:', error);
        this.visible = true;
        this.message = 'Error saving task.';
      }
    } else {
      this.visible = true;
      this.message = 'Please fill all fields before saving.';
    }
  }

  editTask(index: number) {
    this.isOpen = true;
    const task = this.Tasks[index];
    this.newTask = {
      date: task.date,
      employee: task.employee,
      Report: task.Report,
      task: task.task,
      hours: task.hours,
      minutes: task.minutes
    };
    this.editIndex = index;
    this.editDocId = task.docId || null;
  }

  confirmRemoveTask(index: number) {
    this.taskToDeleteIndex = index;
    this.showConfirmToast = true;
    this.confirmToast = false;
  }

  async removeTaskConfirmed() {
    if (this.taskToDeleteIndex === null) return;
    const index = this.taskToDeleteIndex;
    const task = this.Tasks[index];

    if (task.docId) {
      const taskDocRef = doc(this.firestore, `timesheet/${this.employeeId}/tasks/${task.date}/details/${task.docId}`);
      try {
        await deleteDoc(taskDocRef);
        this.Tasks.splice(index, 1);
        this.updateTotalEstimation();
        if (this.Tasks.length === 0) {
          this.showtable = false;
        }
        this.message = 'Task deleted successfully!';
        this.visible = true;
      } catch (error) {
        console.error('Error deleting task:', error);
        this.message = 'Error deleting task.';
        this.visible = true;
      }
    } else {
      this.Tasks.splice(index, 1);
      this.updateTotalEstimation();
      if (this.Tasks.length === 0) {
        this.showtable = false;
      }
    }
    this.taskToDeleteIndex = null;
    this.showConfirmToast = false;
  }

  cancelRemoveTask() {
    this.taskToDeleteIndex = null;
    this.showConfirmToast = false;
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
    this.resetNewTask();
  }

  resetNewTask() {
    this.newTask = {
      date: this.today,
      employee: '',
      Report: '',
      task: '',
      hours: null,
      minutes: null
    };
    this.editIndex = null;
    this.editDocId = null;
  }

  backBtn() {
    const isFormDirty =
      !this.newTask.employee &&
      !this.newTask.Report &&
      !this.newTask.task &&
      this.newTask.hours === null &&
      this.newTask.minutes === null;

    if (isFormDirty) {
      this.router.navigate(['/Daily-Updates']);
      return;
    }
    this.showConfirmToast = true;
    this.confirmToast = false;
  }

  proceedBack() {
    this.router.navigate(['/Daily-Updates']);
  }

  cancelBack() {
    this.showConfirmToast = false;
  }
}
