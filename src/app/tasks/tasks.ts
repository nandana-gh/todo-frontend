import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class Tasks implements OnInit {
  tasks: any[] = [];
  newTaskTitle = '';
  currentPage = 1;
  pageSize = 6;
  
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);

  ngOnInit() {
    this.loadTasks();
  }

  get paginatedTasks() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.tasks.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.tasks.length / this.pageSize));
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.tasks = data;
        });
      },
      error: (err) => console.error('Error loading tasks', err)
    });
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;
    
    this.taskService.createTask(this.newTaskTitle).subscribe({
      next: (task) => {
        this.ngZone.run(() => {
          this.tasks.unshift(task);
          this.currentPage = 1;
          this.newTaskTitle = '';
        });
      },
      error: (err) => console.error('Error creating task', err)
    });
  }

  toggleTask(task: any) {
    this.taskService.updateTask(task.id, task.isCompleted).subscribe({
      next: () => {},
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Error updating task', err);
          task.isCompleted = !task.isCompleted; // Revert on error
        });
      }
    });
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.tasks = this.tasks.filter(t => t.id !== id);
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
          }
        });
      },
      error: (err) => console.error('Error deleting task', err)
    });
  }

  logout() {
    this.authService.logout();
  }
}
