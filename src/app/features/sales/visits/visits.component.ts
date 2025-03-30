import { Component, AfterViewInit, ViewChild } from '@angular/core';
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
  ],
  templateUrl: './visits.component.html',
  styleUrl: './visits.component.scss',
})
export class VisitsComponent implements AfterViewInit {
  // Todas las columnas disponibles
  allColumns: { value: string; viewValue: string }[] = [
    { value: 'ActividadID', viewValue: 'ID Actividad' },
    { value: 'FechaIniPlan', viewValue: 'Fecha Planificada' },
    { value: 'Kunnr', viewValue: 'Código Cliente' },
    { value: 'NombreCliente', viewValue: 'Nombre Cliente' },
    { value: 'NombreUsuario', viewValue: 'Nombre Usuario' },
    { value: 'Regional', viewValue: 'Regional' },
    { value: 'Estado', viewValue: 'Estado' },
    { value: 'Descripcion', viewValue: 'Descripción' },
    { value: 'FechaCrea', viewValue: 'Fecha Creación' },
    { value: 'DirCliente', viewValue: 'Dirección Cliente' },
    { value: 'GrupoCliente', viewValue: 'Grupo Cliente' },
    { value: 'CodUsuario', viewValue: 'Código Usuario' },
    { value: 'CodVendedor', viewValue: 'Código Vendedor' },
    { value: 'OrgVenta', viewValue: 'Organización Venta' },
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

  constructor(private visitsService: VisitsService) {
    this.dataSource = new MatTableDataSource<VisitsData>([]);
  }

  ngOnInit() {
    this.loadVisits();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  // Método para actualizar las columnas mostradas
  updateDisplayedColumns(selectedColumns: string[]) {
    if (selectedColumns && selectedColumns.length > 0) {
      this.columnsToDisplay = [...selectedColumns];
    } else {
      // Si no hay columnas seleccionadas, mostrar al menos una
      this.columnsToDisplay = ['ActividadID'];
    }
  }
}
