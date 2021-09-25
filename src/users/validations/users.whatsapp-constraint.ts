import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { getRepository } from 'typeorm';
import { User } from '../entities/user.entity';

@ValidatorConstraint({ name: 'IsWhatsappAlreadyInUse', async: true })
export class IsWhatsappAlreadyInUseConstraint
  implements ValidatorConstraintInterface
{
  async validate(whatsapp: string) {
    const repository = getRepository(User);
    const user = await repository.findOne({ whatsapp });
    return !user;
  }
}

export function IsWhatsappAlreadyInUse(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsWhatsappAlreadyInUseConstraint,
    });
  };
}
