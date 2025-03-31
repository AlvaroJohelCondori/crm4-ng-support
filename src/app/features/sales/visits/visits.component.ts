import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  ViewChild,
  inject,
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
import { VisitsService } from './services/visits/visits.service';
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

@Component({
  selector: 'app-visits',
  standalone: true,
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
  ],
  templateUrl: './visits.component.html',
  styleUrl: './visits.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly defaultPageSize = 10;

  // Mover columnas a una propiedad readonly
  private readonly DEFAULT_COLUMNS = [
    'ActividadID',
    'FechaIniPlan',
    'Kunnr',
    'NombreCliente',
    'NombreUsuario',
    'Regional',
    'Estado',
  ] as const;

  allColumns = [
    { value: 'Acompanado', viewValue: 'Acompanado' },
    { value: 'ActividadID', viewValue: 'ActividadID' },
    { value: 'CodDivision', viewValue: 'CodDivision' },
    { value: 'CodUsuario', viewValue: 'CodUsuario' },
    { value: 'CodVendedor', viewValue: 'CodVendedor' },
    { value: 'Descripcion', viewValue: 'Descripcion' },
    { value: 'DirCliente', viewValue: 'DirCliente' },
    { value: 'Estado', viewValue: 'Estado' },
    { value: 'FechaCompromiso', viewValue: 'FechaCompromiso' },
    { value: 'FechaCrea', viewValue: 'FechaCrea' },
    { value: 'FechaFinPlan', viewValue: 'FechaFinPlan' },
    { value: 'FechaFinReal', viewValue: 'FechaFinReal' },
    { value: 'FechaIniPlan', viewValue: 'FechaIniPlan' },
    { value: 'FechaIniReal', viewValue: 'FechaIniReal' },
    { value: 'GrupoCliente', viewValue: 'GrupoCliente' },
    { value: 'Kunnr', viewValue: 'Kunnr' },
    { value: 'LatitudPlan', viewValue: 'LatitudPlan' },
    { value: 'LatitudReal', viewValue: 'LatitudReal' },
    { value: 'LongitudPlan', viewValue: 'LongitudPlan' },
    { value: 'LongitudReal', viewValue: 'LongitudReal' },
    { value: 'MotivoNoActividad', viewValue: 'MotivoNoActividad' },
    { value: 'NombreCliente', viewValue: 'NombreCliente' },
    { value: 'NombreUsuario', viewValue: 'NombreUsuario' },
    { value: 'Observacion', viewValue: 'Observacion' },
    { value: 'OrgVenta', viewValue: 'OrgVenta' },
    { value: 'Regional', viewValue: 'Regional' },
    { value: 'RegionalCliente', viewValue: 'RegionalCliente' },
    { value: 'Remoto', viewValue: 'Remoto' },
    { value: 'UsuarioFecha', viewValue: 'UsuarioFecha' },
  ];

  // Estado del componente
  isLoading = true;
  dataSource = new MatTableDataSource<VisitsData>([]);
  displayedColumns: string[] = [...this.DEFAULT_COLUMNS];
  columnsToDisplay: string[] = [...this.DEFAULT_COLUMNS];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private visitsService: VisitsService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadVisits();
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

      // Personalizar la función de filtrado
      this.dataSource.filterPredicate = (data: VisitsData, filter: string) => {
        const searchStr = filter.toLowerCase();
        return Object.values(data).some((value) =>
          value?.toString().toLowerCase().includes(searchStr)
        );
      };

      this.changeDetectorRef.detectChanges();
    }
  }

  loadVisits(): void {
    this.isLoading = true;
    this.changeDetectorRef.markForCheck();

    this.visitsService
      .getVisits()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (visits) => {
          this.dataSource.data = visits;
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar visitas:', error);
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        },
      });
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
