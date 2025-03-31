import { Injectable } from '@angular/core';
import { Database, ref, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export interface UsersData {
  Cargo: string;
  CodOficinaVenta: string;
  CodUsuario: string;
  CodigoSap: string;
  Contrasena: string;
  DiasToleranciaTipoCambioCobranza: string;
  DiasToleranciaTipoCambioFactura: string;
  DiasToleranciaTipoCambioPedido: string;
  Division: string;
  DivisionID: string;
  EnUso: string;
  Estado: string;
  Fecha: string;
  FotoImage: string;
  ImeiDevice: string;
  Mercado: string;
  MercadoID: string;
  MultiUser: string;
  Nombre: string;
  Organizacion: string;
  Principal: string;
  PuedeModificarDiasToleranciaTipoCambio: string;
  Regional: string;
  RegionalCBZ: string;
  RegionalID: string;
  RolID: string;
  Token_FCM: string;
  UsuarioID: string;
  Var1: string;
  VersionApp: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private db: Database) {}

  getUsers(): Observable<UsersData[]> {
    return new Observable<UsersData[]>((observer) => {
      const usersRef = ref(this.db, ':80/Usuario');
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
