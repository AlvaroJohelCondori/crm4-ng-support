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
import { CollectionsService } from '../../services/collections/collections.service';
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
import { Visita } from '../../models/collections/collections.interface';
import { Recibo } from '../../models/collections/collections.interface';

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
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly defaultPageSize = 10;

  private readonly DEFAULT_COLUMNS = [
    'ReciboID',
    'NombreCliente',
    'KUNNR',
    'Estado',
    'ImpTotalBS',
    'Fecha',
    'IdVendedor',
    'FormaPago',
    'NroDocumento',
  ] as const;

  allColumns = [
    { value: 'ActividadID', viewValue: 'ActividadID' },
    { value: 'CodBanco', viewValue: 'CodBanco' },
    { value: 'CodPadre', viewValue: 'CodPadre' },
    { value: 'CodRecibo', viewValue: 'CodRecibo' },
    { value: 'Confirmacion', viewValue: 'Confirmacion' },
    { value: 'DZ1', viewValue: 'DZ1' },
    { value: 'DZ2', viewValue: 'DZ2' },
    { value: 'Descuento', viewValue: 'Descuento' },
    { value: 'Detalles', viewValue: 'Detalles' },
    { value: 'Estado', viewValue: 'Estado' },
    { value: 'Fecha', viewValue: 'Fecha' },
    { value: 'FechaDoc', viewValue: 'FechaDoc' },
    { value: 'FechaModificacion', viewValue: 'FechaModificacion' },
    { value: 'FormaPago', viewValue: 'FormaPago' },
    { value: 'FormaPagoSAP', viewValue: 'FormaPagoSAP' },
    { value: 'IdVendedor', viewValue: 'IdVendedor' },
    { value: 'ImpTotalBS', viewValue: 'ImpTotalBS' },
    { value: 'ImpTotalUSD', viewValue: 'ImpTotalUSD' },
    { value: 'ImporteBS', viewValue: 'ImporteBS' },
    { value: 'ImporteUSD', viewValue: 'ImporteUSD' },
    { value: 'KUNNR', viewValue: 'KUNNR' },
    { value: 'Latitud', viewValue: 'Latitud' },
    { value: 'Longitud', viewValue: 'Longitud' },
    { value: 'Moneda', viewValue: 'Moneda' },
    { value: 'MonedaDoc', viewValue: 'MonedaDoc' },
    { value: 'NombreCliente', viewValue: 'NombreCliente' },
    { value: 'NombreDepositante', viewValue: 'NombreDepositante' },
    { value: 'NombreVendedor', viewValue: 'NombreVendedor' },
    { value: 'Notas', viewValue: 'Notas' },
    { value: 'NroDocumento', viewValue: 'NroDocumento' },
    { value: 'NroPosiciones', viewValue: 'NroPosiciones' },
    { value: 'NroReciboManual', viewValue: 'NroReciboManual' },
    { value: 'Observacion', viewValue: 'Observacion' },
    { value: 'OtroBanco', viewValue: 'OtroBanco' },
    { value: 'ReAnulado', viewValue: 'ReAnulado' },
    { value: 'ReciboID', viewValue: 'ReciboID' },
    { value: 'RegionalBanco', viewValue: 'RegionalBanco' },
    { value: 'SolAnulacion', viewValue: 'SolAnulacion' },
    { value: 'TareaID', viewValue: 'TareaID' },
    { value: 'TipoCambio', viewValue: 'TipoCambio' },
    { value: 'TotalBS', viewValue: 'TotalBS' },
    { value: 'TotalUSD', viewValue: 'TotalUSD' },
    { value: 'fecha', viewValue: 'fecha' },
  ];

  isLoading = true;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [...this.DEFAULT_COLUMNS];
  columnsToDisplay: string[] = [...this.DEFAULT_COLUMNS];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private collectionsService: CollectionsService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.dataSource.data = [];
    this.changeDetectorRef.detectChanges();

    this.collectionsService
      .getCollections()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (data) => {
          console.log('data distribution', data);
          this.processCollectionsData(data);
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          console.error('Error loading collections data:', error);
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

      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const searchStr = filter.toLowerCase();
        return Object.values(data).some((value) =>
          value?.toString().toLowerCase().includes(searchStr)
        );
      };

      this.changeDetectorRef.detectChanges();
    }
  }

  private processCollectionsData(data: Visita[]) {
    const collections: Recibo[] = [];

    data.forEach((visita) => {
      if (visita.Tareas) {
        Object.values(visita.Tareas).forEach((tarea) => {
          if (tarea.Cobranza) {
            Object.values(tarea.Cobranza).forEach((recibo) => {
              collections.push(recibo);
            });
          }
        });
      }
    });

    console.log('Colecciones procesadas:', collections);
    this.dataSource.data = collections;
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
      width: '600px',
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
