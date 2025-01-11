import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable()
export class UsersInterceptor implements NestInterceptor {
  logger: Logger = new Logger(UsersInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    this.logger.log(`Incomming Request: ${request.method}, ${request.url}`);

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => this.logger.log(`Outgoing response: ${Date.now() - now}`)),
      );

    // return next.handle().pipe(
    //   map((user) => {
    //     console.log(user);
    //   }),
    // );
  }
}

@Injectable()
export class ExeptionInterceptor implements NestInterceptor {
  logger: Logger = new Logger(ExeptionInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: Error) => {
        this.logger.log(`An error: ${err.message}`);
        return throwError(new HttpException(err.message, 500));
      }),
    );
  }
}
