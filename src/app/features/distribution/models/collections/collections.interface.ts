export interface Visita {
  ActividadID: string;
  CodDivision: string;
  CodUsuario: string;
  CodVendedor: string;
  Descripcion: string;
  DirCliente: string;
  Estado: string;
  EstadoMule: string;
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
  Secuencia: string;
  Tareas: Record<string, Tarea>;
  UsuarioFecha: string;
}

export interface Tarea {
  ActividadID: string;
  CodTipoTarea: string;
  CodUsuario: string;
  EsObligatorio: string;
  Estado: string;
  FechaFin: string;
  FechaInicio: string;
  FechaPlan: string;
  Observacion: string;
  TareaID: string;
  TipoTareaID: string;
  UsuarioCrea: string;
  UsuarioFecha?: string;
  Respuesta?: Respuesta;
  Facturas?: Record<string, Factura>;
  Cobranza?: Record<string, Recibo>;
}

export interface Respuesta {
  Fecha: string;
  RespuestaGrupo2: number;
  RespuestaPrincipal: number;
  TareaID: string;
}

export interface Factura {
  ActividadID: string;
  Comentario: string;
  CondPago: string;
  Detalle: Record<string, DetalleFactura>;
  Entrega: string;
  EntregaID: string;
  Estado: string;
  Factura: string;
  MontoBS: string;
  MontoUSD: string;
  Motivo: string;
  TC: string;
  TareaID: string;
}

export interface DetalleFactura {
  ActividadID: string;
  Cantidad: string;
  CodProd: string;
  Entregado: string;
  Factura: string;
  Producto: string;
  Unidad: string;
}

export interface Recibo {
  ActividadID: string;
  CodBanco: string;
  CodPadre: string;
  CodRecibo: string;
  Confirmacion: string;
  DZ1: string;
  DZ2: string;
  Descuento: string;
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
  Latitud: number;
  Longitud: number;
  Moneda: string;
  MonedaDoc: string;
  NombreCliente: string;
  NombreDepositante: string;
  NombreVendedor: string;
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
  fecha: string;
}

export interface ReciboDetalle {
  abonoID: string;
  codFactura: string;
  codRecibo: number;
  codsbo: string;
  contado: number;
  descuento: number;
  facSaldoBS: number;
  facSaldoUSD: number;
  facturaID: string;
  fechaCreacion: string;
  fechaModificacion: string;
  idVendedor: string;
  importeBS: number;
  importeUSD: number;
  kunnr: string;
  montoFacBS: number;
  montoFacUSD: number;
  notaID: string;
  nroDocContable: string;
  observacion: string;
  parcial: string;
  reciboID: string;
  tipo: string;
  tipoCambio: number;
  tipoDocumento: string;
  totalBS: number;
  totalUSD: number;
}
