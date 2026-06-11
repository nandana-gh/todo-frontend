import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tasks } from './tasks';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Tasks Component', () => {
  let component: Tasks;
  let fixture: ComponentFixture<Tasks>;
  let taskServiceSpy: any;
  let authServiceSpy: any;

  beforeEach(async () => {
    taskServiceSpy = {
      getTasks: vi.fn().mockReturnValue(of([
        { id: '1', title: 'Task 1', isCompleted: false },
        { id: '2', title: 'Task 2', isCompleted: true }
      ])),
      createTask: vi.fn().mockReturnValue(of({ id: '3', title: 'New Task', isCompleted: false })),
      updateTask: vi.fn().mockReturnValue(of({})),
      deleteTask: vi.fn().mockReturnValue(of({}))
    };

    authServiceSpy = {
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Tasks],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tasks);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the tasks component', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    expect(taskServiceSpy.getTasks).toHaveBeenCalled();
    expect(component.tasks.length).toBe(2);
  });

  it('should add a new task and add it to the top of the list', () => {
    component.newTaskTitle = 'New Task';
    component.addTask();
    
    expect(taskServiceSpy.createTask).toHaveBeenCalledWith('New Task');
    expect(component.tasks.length).toBe(3);
    expect(component.tasks[0].title).toBe('New Task');
    expect(component.newTaskTitle).toBe('');
  });

  it('should call updateTask when toggling a task', () => {
    const task = component.tasks[0];
    task.isCompleted = true; // Simulating checkbox change
    component.toggleTask(task);
    
    expect(taskServiceSpy.updateTask).toHaveBeenCalledWith('1', true);
  });

  it('should delete a task and remove it from the list', () => {
    component.deleteTask('1');
    
    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith('1');
    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].id).toBe('2');
  });
});
