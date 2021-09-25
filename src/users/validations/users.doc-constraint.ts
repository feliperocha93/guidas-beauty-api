import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { getRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

@ValidatorConstraint({ name: 'IsDocAlreadyInUse', async: true })
export class IsDocAlreadyInUseConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected readonly usersService: UsersService) {}
  async validate(doc: string) {
    const repository = getRepository(User);
    const user = await repository.findOne({ doc });
    return !user;
  }
}

export function IsDocAlreadyInUse(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDocAlreadyInUseConstraint,
    });
  };
}
