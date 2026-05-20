import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DocenteService {
  private url = 'http://localhost:8080/api/docentes'; //ejemplo

  constructor(private http: HttpClient) {}

  crear(docente: any) {
    return this.http.post(this.url, docente);
  }

  listar() {
    return this.http.get(this.url);
  }
}