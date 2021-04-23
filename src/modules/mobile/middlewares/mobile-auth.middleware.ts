import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request } from "express";
import { ApplicationService } from "../../application/services/application.service";

@Injectable()
export class MobileAuthMiddleware implements NestMiddleware {
    constructor(private applicationService: ApplicationService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.query['access-token'].toString();
        if (!token)
            throw new UnauthorizedException('You are not authorized to perform the operation');
        const app = await this.applicationService.findOneByToken(token);
        if (!app)
            throw new UnauthorizedException('You are not authorized to perform the operation');
        req['application'] = app;
        next();
    }
}