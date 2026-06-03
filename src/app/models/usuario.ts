export interface Usuario {
    idUsuario?: number;
    username?: string;
    password?: string;
    cargo?: string;
    estado?:boolean;
    idPersona: number | undefined; 
    nombrePersona?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
}
  