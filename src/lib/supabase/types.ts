export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: {
          id: string;
          created_at: string;
          nombre: string;
          email: string;
          telefono: string | null;
          empresa: string | null;
          notas: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          nombre: string;
          email: string;
          telefono?: string | null;
          empresa?: string | null;
          notas?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          nombre?: string;
          email?: string;
          telefono?: string | null;
          empresa?: string | null;
          notas?: string | null;
        };
      };
      empleados: {
        Row: {
          id: string;
          created_at: string;
          nombre: string;
          email: string;
          cargo: string | null;
          tarifa_hora: number | null;
          activo: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          nombre: string;
          email: string;
          cargo?: string | null;
          tarifa_hora?: number | null;
          activo?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          nombre?: string;
          email?: string;
          cargo?: string | null;
          tarifa_hora?: number | null;
          activo?: boolean;
        };
      };
      proyectos: {
        Row: {
          id: string;
          created_at: string;
          nombre: string;
          descripcion: string | null;
          cliente_id: string;
          estado: string;
          fecha_inicio: string | null;
          fecha_fin: string | null;
          presupuesto: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          nombre: string;
          descripcion?: string | null;
          cliente_id: string;
          estado?: string;
          fecha_inicio?: string | null;
          fecha_fin?: string | null;
          presupuesto?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          nombre?: string;
          descripcion?: string | null;
          cliente_id?: string;
          estado?: string;
          fecha_inicio?: string | null;
          fecha_fin?: string | null;
          presupuesto?: number | null;
        };
      };
      tareas: {
        Row: {
          id: string;
          created_at: string;
          proyecto_id: string;
          nombre: string;
          descripcion: string | null;
          asignado_a: string | null;
          estado: string;
          prioridad: string | null;
          fecha_vencimiento: string | null;
          horas_estimadas: number | null;
          horas_reales: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          proyecto_id: string;
          nombre: string;
          descripcion?: string | null;
          asignado_a?: string | null;
          estado?: string;
          prioridad?: string | null;
          fecha_vencimiento?: string | null;
          horas_estimadas?: number | null;
          horas_reales?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          proyecto_id?: string;
          nombre?: string;
          descripcion?: string | null;
          asignado_a?: string | null;
          estado?: string;
          prioridad?: string | null;
          fecha_vencimiento?: string | null;
          horas_estimadas?: number | null;
          horas_reales?: number | null;
        };
      };
      proyecto_empleado: {
        Row: {
          proyecto_id: string;
          empleado_id: string;
          rol: string | null;
        };
        Insert: {
          proyecto_id: string;
          empleado_id: string;
          rol?: string | null;
        };
        Update: {
          proyecto_id?: string;
          empleado_id?: string;
          rol?: string | null;
        };
      };
    };
  };
}
