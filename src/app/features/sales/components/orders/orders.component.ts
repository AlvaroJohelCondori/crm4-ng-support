import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  ViewChild,
  Input,
  Inject,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrdersService } from '../../services/orders/orders.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
    MatDividerModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly defaultPageSize = 10;

  private readonly DEFAULT_COLUMNS = [
    'PedidoID',
    'NroSAP',
    'Estado',
    'Fecha',
    'MontoTotal',
    'CodUsuario',
    'RazonSocial',
    'KUNNR',
  ] as const;

  allColumns = [
    { value: 'ActividadID', viewValue: 'ActividadID' },
    { value: 'CodCanal', viewValue: 'CodCanal' },
    { value: 'CodPrioridadEntrega', viewValue: 'CodPrioridadEntrega' },
    { value: 'CodSector', viewValue: 'CodSector' },
    { value: 'CodTipoPago', viewValue: 'CodTipoPago' },
    { value: 'CodTipoPedido', viewValue: 'CodTipoPedido' },
    { value: 'CodUsuario', viewValue: 'CodUsuario' },
    { value: 'ComentarioCompPago', viewValue: 'ComentarioCompPago' },
    { value: 'Condicion1', viewValue: 'Condicion1' },
    { value: 'Condicion2', viewValue: 'Condicion2' },
    { value: 'Condicion3', viewValue: 'Condicion3' },
    { value: 'Condicion4', viewValue: 'Condicion4' },
    { value: 'ContactoJmID', viewValue: 'ContactoJmID' },
    { value: 'ContactoRpID', viewValue: 'ContactoRpID' },
    { value: 'ContactoSolID', viewValue: 'ContactoSolID' },
    { value: 'DirEntrega', viewValue: 'DirEntrega' },
    { value: 'DirFactura', viewValue: 'DirFactura' },
    { value: 'Esquema', viewValue: 'Esquema' },
    { value: 'Estado', viewValue: 'Estado' },
    { value: 'EstadoSync', viewValue: 'EstadoSync' },
    { value: 'Fecha', viewValue: 'Fecha' },
    { value: 'FechaCompromisoPago', viewValue: 'FechaCompromisoPago' },
    { value: 'FechaEntrega', viewValue: 'FechaEntrega' },
    { value: 'FechaModificacion', viewValue: 'FechaModificacion' },
    { value: 'KUNNR', viewValue: 'KUNNR' },
    { value: 'KunnrDest', viewValue: 'KunnrDest' },
    { value: 'KunnrFact', viewValue: 'KunnrFact' },
    { value: 'Latitud', viewValue: 'Latitud' },
    { value: 'Longitud', viewValue: 'Longitud' },
    { value: 'LugarEntrega', viewValue: 'LugarEntrega' },
    { value: 'Moneda', viewValue: 'Moneda' },
    { value: 'MonedaCompromisoPago', viewValue: 'MonedaCompromisoPago' },
    { value: 'MontoCompromisoPago', viewValue: 'MontoCompromisoPago' },
    { value: 'MontoTotal', viewValue: 'MontoTotal' },
    { value: 'Nit', viewValue: 'Nit' },
    { value: 'Nota1', viewValue: 'Nota1' },
    { value: 'Nota2', viewValue: 'Nota2' },
    { value: 'Nota3', viewValue: 'Nota3' },
    { value: 'NroPedido', viewValue: 'NroPedido' },
    { value: 'NroPosiciones', viewValue: 'NroPosiciones' },
    { value: 'NroSAP', viewValue: 'NroSAP' },
    { value: 'Obs', viewValue: 'Obs' },
    { value: 'OrgVenta', viewValue: 'OrgVenta' },
    { value: 'PedidoID', viewValue: 'PedidoID' },
    { value: 'Pendiente', viewValue: 'Pendiente' },
    { value: 'RazonSocial', viewValue: 'RazonSocial' },
    { value: 'Sector', viewValue: 'Sector' },
    { value: 'TareaID', viewValue: 'TareaID' },
    { value: 'TipoCambio', viewValue: 'TipoCambio' },
    { value: 'TipoDescCab', viewValue: 'TipoDescCab' },
    { value: 'TipoSinc', viewValue: 'TipoSinc' },
  ];

  isLoading = true;
  dataSource = new MatTableDataSource<OrdersData>([]);
  displayedColumns: string[] = [...this.DEFAULT_COLUMNS];
  columnsToDisplay: string[] = [...this.DEFAULT_COLUMNS];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ordersService: OrdersService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.dataSource.data = [];
    this.changeDetectorRef.detectChanges();

    this.ordersService
      .getOrders()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (data) => {
          this.processOrdersData(data);
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          console.error('Error loading orders data:', error);
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        },
      });
  }

  ngAfterViewInit(): void {
    this.initializeDataSource();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeDataSource(): void {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator.pageSize = this.defaultPageSize;
      this.paginator.pageIndex = 0;

      this.dataSource.filterPredicate = (data: OrdersData, filter: string) => {
        const searchStr = filter.toLowerCase();
        return Object.values(data).some((value) =>
          value?.toString().toLowerCase().includes(searchStr)
        );
      };

      this.changeDetectorRef.detectChanges();
    }
  }

  private processOrdersData(data: OrdersData[]) {
    this.dataSource.data = data;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateDisplayedColumns(selectedColumns: string[]): void {
    if (selectedColumns?.length) {
      this.columnsToDisplay = selectedColumns;
    } else {
      this.columnsToDisplay = [this.DEFAULT_COLUMNS[0]];
    }
    this.changeDetectorRef.markForCheck();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '800px',
      maxWidth: '90vw',
      data: {
        allColumns: this.allColumns,
        selectedColumns: [...this.columnsToDisplay],
      },
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.updateDisplayedColumns(result);
        }
      });
  }

  copyToClipboard(content: any): void {
    if (content !== null && content !== undefined) {
      const textToCopy = content.toString();
      navigator.clipboard.writeText(textToCopy).then(
        () => {
          this.snackBar.open(`Copiado: ${textToCopy}`, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        },
        (err) => {
          console.error('Error al copiar: ', err);
          this.snackBar.open('No se pudo copiar al portapapeles', 'Cerrar', {
            duration: 3000,
          });
        }
      );
    }
  }

  updateOrderDate(order: OrdersData) {
    this.ordersService
      .updateOrder(order)
      .then(() => {
        this.snackBar.open('Fecha actualizada correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        // Recargar datos
        this.ngOnInit();
      })
      .catch((error) => {
        console.error('Error al actualizar fecha:', error);
        this.snackBar.open('Error al actualizar la fecha', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      });
  }

  hasEmptyRequiredFields(row: OrdersData): boolean {
    return !!(
      !row.Estado ||
      row.Estado.trim() === '' ||
      !row.NroSAP ||
      row.NroSAP.trim() === '' ||
      (row.NroSAP && row.NroSAP.includes('HCRM'))
    );
  }
}

@Component({
  selector: 'dialog-columns',
  templateUrl: 'dialog-columns.html',
  styleUrls: ['dialog-columns.scss'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    CommonModule,
    FormsModule,
    MatDividerModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentExampleDialog implements OnInit {
  @Input() allColumns: { value: string; viewValue: string }[] = [];
  @Input() selectedColumns: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.allColumns = this.data.allColumns;
    this.selectedColumns = this.data.selectedColumns;
  }

  areAllColumnsSelected(): boolean {
    return this.allColumns.length === this.selectedColumns.length;
  }

  toggleAllColumns(checked: boolean) {
    this.selectedColumns = checked
      ? this.allColumns.map((col) => col.value)
      : ['ActividadID'];
    this.changeDetectorRef.detectChanges();
  }

  toggleColumn(columnValue: string, checked: boolean) {
    if (checked) {
      if (!this.selectedColumns.includes(columnValue)) {
        this.selectedColumns.push(columnValue);
      }
    } else {
      this.selectedColumns = this.selectedColumns.filter(
        (col) => col !== columnValue
      );
      if (this.selectedColumns.length === 0) {
        this.selectedColumns = ['ActividadID'];
      }
    }
    this.changeDetectorRef.detectChanges();
  }
}
