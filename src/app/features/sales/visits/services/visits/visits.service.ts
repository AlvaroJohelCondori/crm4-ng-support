import { Injectable } from '@angular/core';
import { Database, ref, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';

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
      // Referencia al nodo 'visitas' en la base de datos Firebase
      const visitsRef = ref(this.db, ':80/Actividad/BO10');

      // Escuchar cambios en la referencia
      const unsubscribe = onValue(
        visitsRef,
        (snapshot) => {
          const visits: VisitsData[] = [];

          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const visitData = childSnapshot.val() as VisitsData;
              visits.push(visitData);
              return false; // Continuar iterando
            });
          }

          observer.next(visits);
        },
        (error) => {
          console.error('Error al obtener visitas:', error);
          observer.error(error);
        }
      );

      // Devolver función para limpiar suscripción cuando se complete
      return { unsubscribe };
    });
  }
}
