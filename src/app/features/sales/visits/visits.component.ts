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
export class VisitsComponent implements AfterViewInit {
  readonly dialog = inject(MatDialog);

  // Todas las columnas disponibles
  allColumns: { value: string; viewValue: string }[] = [
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

  // Columnas seleccionadas por defecto
  displayedColumns: string[] = [
    'ActividadID',
    'FechaIniPlan',
    'Kunnr',
    'NombreCliente',
    'NombreUsuario',
    'Regional',
    'Estado',
  ];

  // Columnas que se muestran actualmente
  columnsToDisplay: string[] = [...this.displayedColumns];

  dataSource: MatTableDataSource<VisitsData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = true;
  defaultPageSize = 10;

  constructor(
    private visitsService: VisitsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<VisitsData>([]);
  }

  ngOnInit() {
    this.loadVisits();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.paginator) {
      this.paginator.pageSize = this.defaultPageSize;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadVisits() {
    this.isLoading = true;
    this.visitsService.getVisits().subscribe({
      next: (visits) => {
        this.dataSource.data = visits;
        this.isLoading = false;
        console.log('Visitas cargadas:', visits.length);
      },
      error: (error) => {
        console.error('Error al cargar visitas:', error);
        this.isLoading = false;
      },
    });
  }

  updateDisplayedColumns(selectedColumns: string[]) {
    if (selectedColumns && selectedColumns.length > 0) {
      this.columnsToDisplay = selectedColumns;
      this.changeDetectorRef.detectChanges();
    } else {
      this.columnsToDisplay = ['ActividadID'];
      this.changeDetectorRef.detectChanges();
    }
  }

  selectAllColumns() {
    this.columnsToDisplay = this.allColumns.map((column) => column.value);
  }

  deselectAllColumns() {
    this.columnsToDisplay = ['ActividadID'];
  }

  areAllColumnsSelected(): boolean {
    return this.allColumns.length === this.columnsToDisplay.length;
  }

  toggleAllColumns(checked: boolean) {
    if (checked) {
      this.selectAllColumns();
    } else {
      this.deselectAllColumns();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '600px',
      data: {
        allColumns: this.allColumns,
        selectedColumns: this.columnsToDisplay,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
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
