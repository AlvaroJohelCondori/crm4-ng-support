import { Injectable } from '@angular/core';
import { Database, ref, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export interface UsersData {
  Amercado: number;
  AndroidID: string;
  Cargo: string;
  CodOficinaVenta: string;
  CodUsuario: string;
  CodVisita: string;
  CodigoSap: string;
  Division: string;
  DivisionID: string;
  Estado: number;
  Idamercado: number;
  MultiUser: number;
  Nombre: string;
  Organizacion: string;
  Password: string;
  Regional: string;
  RegionalCBZ: string;
  RegionalID: string;
  RolID: string;
  UltimoLogueo: string;
  VersionApp: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private db: Database) {}

  getUsers(): Observable<UsersData[]> {
    return new Observable<UsersData[]>((observer) => {
      const usersRef = ref(this.db, 'UsuarioInfo');
      let unsubscribe: () => void;

      try {
        unsubscribe = onValue(
          usersRef,
          (snapshot) => {
            if (!snapshot.exists()) {
              observer.next([]);
              return;
            }

            const users: UsersData[] = [];
            snapshot.forEach((childSnapshot) => {
              users.push(childSnapshot.val() as UsersData);
              return false;
            });

            observer.next(users);
          },
          (error) => {
            console.error('Error al obtener usuarios:', error);
            observer.error(error);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        observer.error(error);
        return () => {};
      }
    }).pipe(
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    );
  }
}
