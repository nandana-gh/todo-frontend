import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Register Component', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authServiceSpy: any;
  let routerSpy: any;

  beforeEach(async () => {
    authServiceSpy = {
      register: vi.fn()
    };
    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the register component', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if passwords do not match', () => {
    component.username = 'testuser';
    component.password = 'password123';
    component.confirmPassword = 'differentpassword';
    component.onSubmit();
    
    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Passwords do not match.');
  });

  it('should show error if password is too short', () => {
    component.username = 'testuser';
    component.password = '123';
    component.confirmPassword = '123';
    component.onSubmit();
    
    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Password must be at least 6 characters long.');
  });

  it('should navigate to /login on successful registration', () => {
    authServiceSpy.register.mockReturnValue(of({ message: 'Success' }));
    
    component.username = 'testuser';
    component.password = 'password123';
    component.confirmPassword = 'password123';
    component.onSubmit();
    
    expect(authServiceSpy.register).toHaveBeenCalledWith({ 
      username: 'testuser', 
      password: 'password123', 
      confirmPassword: 'password123' 
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
