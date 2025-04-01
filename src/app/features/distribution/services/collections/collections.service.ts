import { Injectable } from '@angular/core';
import { Database, ref, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Visita } from '../../models/collections/collections.interface';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  constructor(private db: Database) {}

  getCollections(): Observable<Visita[]> {
    return new Observable<Visita[]>((observer) => {
      const collectionsRef = ref(this.db, '/Visitas/1100');
      let unsubscribe: () => void;

      try {
        unsubscribe = onValue(
          collectionsRef,
          (snapshot) => {
            if (!snapshot.exists()) {
              observer.next([]);
              return;
            }

            const collections: Visita[] = [];
            snapshot.forEach((childSnapshot) => {
              collections.push(childSnapshot.val() as Visita);
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
