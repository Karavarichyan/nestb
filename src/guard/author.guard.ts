import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TransactionService } from 'src/transaction/transaction.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly categoryService: CategoryService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { id, type } = request.params;
    const user = request.user;

    let entity: any;

    switch (type) {
      case 'transaction':
        entity = await this.transactionService.findOne(+id);
        break;
      case 'category':
        entity = await this.categoryService.findOne(+id);
        break;
      default:
        throw new NotFoundException('Invalid type provided');
    }

    if (!entity) throw new NotFoundException(`${type} not found`);

    if (entity.user?.id !== user.id) {
      throw new UnauthorizedException('Access denied');
    }

    return true;
  }
}
