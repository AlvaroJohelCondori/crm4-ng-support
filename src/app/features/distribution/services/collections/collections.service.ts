import { Injectable } from '@angular/core';
import { Database, ref, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export interface CollectionsData {
  ActividadID: string;
  CodBanco: string;
  CodRecibo: string;
  Confirmacion: string;
  DZ1: string;
  DZ2: string;
  Descuento: string;
  EsPrepago: string;
  Estado: string;
  Fecha: string;
  FechaDoc: string;
  FechaModificacion: string;
  FormaPago: string;
  FormaPagoSAP: string;
  IdVendedor: string;
  ImpTotalBS: string;
  ImpTotalUSD: string;
  ImporteBS: string;
  ImporteUSD: string;
  KUNNR: string;
  Latitud: string;
  Longitud: string;
  Moneda: string;
  MonedaDoc: string;
  NombreCliente: string;
  NombreDepositante: string;
  Notas: string;
  NroDocumento: string;
  NroPosiciones: string;
  NroReciboManual: string;
  Observacion: string;
  OtroBanco: string;
  ReAnulado: string;
  ReciboID: string;
  RegionalBanco: string;
  SolAnulacion: string;
  TareaID: string;
  TipoCambio: string;
  TotalBS: string;
  TotalUSD: string;
}

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  constructor(private db: Database) {}

  getCollections(): Observable<CollectionsData[]> {
    return new Observable<CollectionsData[]>((observer) => {
      const collectionsRef = ref(this.db, ':80/Pedido');
      let unsubscribe: () => void;

      try {
        unsubscribe = onValue(
          collectionsRef,
          (snapshot) => {
            if (!snapshot.exists()) {
              observer.next([]);
              return;
            }

            const collections: CollectionsData[] = [];
            snapshot.forEach((childSnapshot) => {
              collections.push(childSnapshot.val() as CollectionsData);
              return false;
            });

            observer.next(collections);
          },
          (error) => {
            console.error('Error al obtener colecciones:', error);
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
