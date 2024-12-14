import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Task, TASK_PRIORITY, TASK_STATUS, TaskService } from '../task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TaskFormComponent>);
  private taskService = inject(TaskService);
  private data = inject(MAT_DIALOG_DATA) as Task | undefined;

  isEditMode = !!this.data;
  taskPriorities = Object.values(TASK_PRIORITY);
  taskStatuses = Object.values(TASK_STATUS);
  readonly separatorKeysCodes = [ENTER, COMMA];

  // Custom validator function
  private futureDateValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const selectedDate = new Date(control.value);
    const today = new Date();

    // Reset time parts to compare just the dates
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { pastDate: true };
  }

  taskForm = this.fb.group({
    _id: [this.data?._id],
    title: [
      this.data?.title || '',
      [Validators.required, Validators.minLength(3)],
    ],
    description: [
      this.data?.description || '',
      [Validators.required, Validators.maxLength(500)],
    ],
    status: [this.data?.status || TASK_STATUS.PENDING, Validators.required],
    priority: [this.data?.priority || TASK_PRIORITY.MEDIUM],
    dueDate: [
      this.data?.dueDate || null,
      [Validators.required, this.futureDateValidator.bind(this)],
    ],
    tags: [this.data?.tags || []],
  });

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;

      if (this.isEditMode) {
        const task: Task = {
          _id: this.data!._id,
          title: formValue.title ?? '',
          description: formValue.description ?? '',
          status: formValue.status ?? TASK_STATUS.PENDING,
          priority: formValue.priority ?? TASK_PRIORITY.MEDIUM,
          dueDate: formValue.dueDate ? new Date(formValue.dueDate) : new Date(),
          tags: formValue.tags ?? [],
          createdAt: this.data!.createdAt,
          history: this.data!.history,
        };

        this.taskService.updateTask(task).subscribe({
          next: (result) => {
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Error updating task:', error);
          },
        });
      } else {
        const newTask = {
          title: formValue.title ?? '',
          description: formValue.description ?? '',
          status: formValue.status ?? TASK_STATUS.PENDING,
          priority: formValue.priority ?? TASK_PRIORITY.MEDIUM,
          dueDate: formValue.dueDate ? new Date(formValue.dueDate) : new Date(),
          tags: formValue.tags ?? [],
        };

        this.taskService.createTask(newTask).subscribe({
          next: (result) => {
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Error creating task:', error);
          },
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const currentTags = this.taskForm.get('tags')?.value || [];

    if (value && !currentTags.includes(value)) {
      this.taskForm.patchValue({
        tags: [...currentTags, value],
      });
    }

    event.chipInput!.clear();
  }

  removeTag(tagToRemove: string): void {
    const currentTags = this.taskForm.get('tags')?.value || [];
    this.taskForm.patchValue({
      tags: currentTags.filter((tag: string) => tag !== tagToRemove),
    });
  }
}
