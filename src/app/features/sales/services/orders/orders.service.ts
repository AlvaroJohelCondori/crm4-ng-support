import { Injectable } from '@angular/core';
import { Database, ref, onValue, update } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export interface OrdersData {
  ActividadID: string;
  CodCanal: string;
  CodPrioridadEntrega: string;
  CodSector: string;
  CodTipoPago: string;
  CodTipoPedido: string;
  CodUsuario: string;
  ComentarioCompPago: string;
  Condicion1: string;
  Condicion2: string;
  Condicion3: string;
  Condicion4: string;
  ContactoJmID: string;
  ContactoRpID: string;
  ContactoSolID: string;
  DirEntrega: string;
  DirFactura: string;
  Esquema: string;
  Estado: string;
  EstadoSync: string;
  Fecha: string;
  FechaCompromisoPago: string;
  FechaEntrega: string;
  FechaModificacion: string;
  KUNNR: string;
  KunnrDest: string;
  KunnrFact: string;
  Latitud: string;
  Longitud: string;
  LugarEntrega: string;
  Moneda: string;
  MonedaCompromisoPago: string;
  MontoCompromisoPago: string;
  MontoTotal: string;
  Nit: string;
  Nota1: string;
  Nota2: string;
  Nota3: string;
  NroPedido: string;
  NroPosiciones: string;
  NroSAP: string;
  Obs: string;
  OrgVenta: string;
  PedidoID: string;
  Pendiente: string;
  RazonSocial: string;
  Sector: string;
  TareaID: string;
  TipoCambio: string;
  TipoDescCab: string;
  TipoSinc: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private db: Database) {}

  getOrders(): Observable<OrdersData[]> {
    return new Observable<OrdersData[]>((observer) => {
      const ordersRef = ref(this.db, ':80/Pedido');
      let unsubscribe: () => void;

      try {
        unsubscribe = onValue(
          ordersRef,
          (snapshot) => {
            if (!snapshot.exists()) {
              observer.next([]);
              return;
            }

            const orders: OrdersData[] = [];
            snapshot.forEach((childSnapshot) => {
              orders.push(childSnapshot.val() as OrdersData);
              return false;
            });

            observer.next(orders);
          },
          (error) => {
            console.error('Error al obtener pedidos:', error);
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

  updateOrder(order: OrdersData): Promise<void> {
    let auxValue = '0';
    const dateString = order.Fecha;
    const lastDigit = dateString.substring(
      dateString.length - 1,
      dateString.length
    );

    if (lastDigit === '0') {
      auxValue = '1';
    }

    let newDate = dateString.substring(0, dateString.length - 1);
    newDate = newDate + auxValue;

    const orderRef = ref(this.db, `:80/Pedido/${order.PedidoID}`);
    return update(orderRef, { Fecha: newDate });
  }
}
