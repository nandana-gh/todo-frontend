import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5268/api/Tasks';
  private http = inject(HttpClient);

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createTask(title: string): Observable<any> {
    return this.http.post(this.apiUrl, { title });
  }

  updateTask(id: string, isCompleted: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { isCompleted });
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
