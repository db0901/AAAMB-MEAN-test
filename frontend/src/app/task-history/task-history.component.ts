import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { Task } from '../task.service';

@Component({
  selector: 'app-task-history',
  standalone: true,
  imports: [MatDialogModule, MatTableModule, DatePipe, MatButtonModule],
  templateUrl: './task-history.component.html',
  styleUrl: './task-history.component.scss',
})
export class TaskHistoryComponent {
  data = inject(MAT_DIALOG_DATA) as Task;
  displayedColumns = ['date', 'field', 'oldValue', 'newValue'];
}
