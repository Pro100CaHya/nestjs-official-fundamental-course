import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("Hi from interceptor! [Before]");
    return next.handle().pipe(map((data) => {
      console.log("Hi from interceptor! [After]");
      return { data }
    }))
  }
}
