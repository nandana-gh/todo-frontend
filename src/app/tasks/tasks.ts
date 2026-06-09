import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading tasks', err)
    });
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;
    
    this.taskService.createTask(this.newTaskTitle).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.newTaskTitle = '';
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error creating task', err)
    });
  }

  toggleTask(task: any) {
    this.taskService.updateTask(task.id, task.isCompleted).subscribe({
      next: () => this.cdr.detectChanges(),
      error: (err) => {
        console.error('Error updating task', err);
        task.isCompleted = !task.isCompleted; // Revert on error
        this.cdr.detectChanges();
      }
    });
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error deleting task', err)
    });
  }

  logout() {
    this.authService.logout();
  }
}
