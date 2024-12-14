import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskHistoryComponent } from '../task-history/task-history.component';
import {
  Task,
  TASK_PRIORITY,
  TASK_STATUS,
  TaskPriority,
  TaskService,
  TaskStatus,
} from '../task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    DatePipe,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  displayedColumns: string[] = [
    'title',
    'status',
    'priority',
    'dueDate',
    'tags',
    'actions',
  ];

  taskService = inject(TaskService);
  private dialog = inject(MatDialog);

  searchTerm = signal('');
  selectedStatus = signal<TaskStatus | ''>('');
  selectedPriority = signal<TaskPriority | ''>('');
  selectedTags = signal<string[]>([]);

  taskStatuses = Object.values(TASK_STATUS);
  taskPriorities = Object.values(TASK_PRIORITY);

  filteredTasks = computed(() => {
    return this.tasks().filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(this.searchTerm().toLowerCase());
      const matchesStatus =
        !this.selectedStatus() || task.status === this.selectedStatus();
      const matchesPriority =
        !this.selectedPriority() || task.priority === this.selectedPriority();
      const matchesTags =
        this.selectedTags().length === 0 ||
        task.tags.some((tag) => this.selectedTags().includes(tag));

      return matchesSearch && matchesStatus && matchesPriority && matchesTags;
    });
  });

  sortedTasks = computed(() => {
    const filtered = this.filteredTasks();
    const sortState = this.sort()?.active && this.sort()?.direction;

    if (!sortState) return filtered;

    return [...filtered].sort((a, b) => {
      const isAsc = this.sort()?.direction === 'asc';
      switch (this.sort()?.active) {
        case 'title':
          return compare(a.title, b.title, isAsc);
        case 'status':
          return compare(a.status, b.status, isAsc);
        case 'priority':
          return compare(a.priority, b.priority, isAsc);
        case 'dueDate':
          return compare(a.dueDate, b.dueDate, isAsc);
        default:
          return 0;
      }
    });
  });

  private sort = signal<Sort | null>(null);

  setSort(sort: Sort) {
    this.sort.set(sort);
  }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks.set(tasks);
    });
  }

  editTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: task,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tasks.update((tasks) =>
          tasks.map((t) => (t._id === result._id ? result : t))
        );
      }
    });
  }
  deleteTask(task: Task): void {
    if (task._id && confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(task._id).subscribe({
        next: () => {
          this.tasks.update((tasks) => tasks.filter((t) => t._id !== task._id));
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        },
      });
    }
  }

  openNewTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tasks.update((tasks) => [...tasks, result]);
      }
    });
  }

  showHistory(task: Task): void {
    this.dialog.open(TaskHistoryComponent, {
      width: '800px',
      data: task,
    });
  }

  pageSize = signal(10);
  currentPage = signal(0);

  paginatedTasks = computed(() => {
    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    return this.sortedTasks().slice(start, end);
  });

  handlePageEvent(event: PageEvent) {
    this.pageSize.set(event.pageSize);
    this.currentPage.set(event.pageIndex);
  }
}

function compare(a: any, b: any, isAsc: boolean) {
  if (a instanceof Date && b instanceof Date) {
    return (a.getTime() - b.getTime()) * (isAsc ? 1 : -1);
  }
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
