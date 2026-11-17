export class RegistroDto {
  nombre: string;
  correo: string;
  contrasena: string;
  avatarUrl?: string;
}

export class LoginDto {
  correo: string;
  contrasena: string;
}

export class CrearAutenticacionDto {
  correo: string;
  contrasena: string;
}
