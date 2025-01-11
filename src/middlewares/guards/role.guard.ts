import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.user.role != 'admin') {
      return false;
    }
    return true;
  }
}
