import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly configService: ConfigService
    ) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        console.log("Hi from guard!");
        const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());

        if (isPublic) {
            return true;
        }

        const request = context
            .switchToHttp()
            .getRequest<Request>();
        const authHeader = request.headers["authorization"];

        return authHeader === this.configService.get("API_KEY");
    }
}