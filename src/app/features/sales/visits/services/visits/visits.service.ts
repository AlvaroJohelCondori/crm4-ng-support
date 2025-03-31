import { Injectable } from '@angular/core';
import { Database, ref, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { distinctUntilChanged, shareReplay } from 'rxjs/operators';

export interface VisitsData {
  Acompanado: string;
  ActividadID: string;
  CodDivision: string;
  CodUsuario: string;
  CodVendedor: string;
  Descripcion: string;
  DirCliente: string;
  Estado: string;
  FechaCompromiso: string;
  FechaCrea: string;
  FechaFinPlan: string;
  FechaFinReal: string;
  FechaIniPlan: string;
  FechaIniReal: string;
  GrupoCliente: string;
  Kunnr: string;
  LatitudPlan: string;
  LatitudReal: string;
  LongitudPlan: string;
  LongitudReal: string;
  MotivoNoActividad: string;
  NombreCliente: string;
  NombreUsuario: string;
  Observacion: string;
  OrgVenta: string;
  Regional: string;
  RegionalCliente: string;
  Remoto: string;
  UsuarioFecha: string;
}

@Injectable({
  providedIn: 'root',
})
export class VisitsService {
  constructor(private db: Database) {}

  getVisits(): Observable<VisitsData[]> {
    return new Observable<VisitsData[]>((observer) => {
      const visitsRef = ref(this.db, ':80/Actividad/BO10');
      let unsubscribe: () => void;

      try {
        unsubscribe = onValue(
          visitsRef,
          (snapshot) => {
            if (!snapshot.exists()) {
              observer.next([]);
              return;
            }

            const visits: VisitsData[] = [];
            snapshot.forEach((childSnapshot) => {
              visits.push(childSnapshot.val() as VisitsData);
              return false;
            });

            observer.next(visits);
          },
          (error) => {
            console.error('Error al obtener visitas:', error);
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
      ),
      shareReplay(1)
    );
  }
}
