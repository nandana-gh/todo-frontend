import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: any;
  let routerSpy: any;

  beforeEach(async () => {
    authServiceSpy = {
      login: vi.fn()
    };
    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message on invalid credentials', () => {
    authServiceSpy.login.mockReturnValue(throwError(() => ({ error: { message: 'Invalid username or password.' } })));
    
    component.username = 'testuser';
    component.password = 'wrongpass';
    component.onSubmit();
    
    expect(authServiceSpy.login).toHaveBeenCalledWith({ username: 'testuser', password: 'wrongpass' });
    expect(component.errorMessage).toBe('Invalid username or password.');
  });

  it('should navigate to /tasks on successful login', () => {
    authServiceSpy.login.mockReturnValue(of({ token: 'fake-jwt-token' }));
    
    component.username = 'testuser';
    component.password = 'correctpass';
    component.onSubmit();
    
    expect(authServiceSpy.login).toHaveBeenCalledWith({ username: 'testuser', password: 'correctpass' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  });
});
