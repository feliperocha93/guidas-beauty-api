//TODO: Implements class-validator
export class CreateUserDto {
  name: string;
  socialName?: string;
  doc: string;
  whatsapp: string;
  password: string;
}
