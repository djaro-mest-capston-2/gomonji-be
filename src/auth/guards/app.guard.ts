// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { AuthGuard } from '@nestjs/passport';
// import { Request } from 'express';
// import jwtDecode from 'jwt-decode';
// import { AUTH_STRATEGY_KEY } from '../decorators/auth-strategy.decorator';
// import { AuthStrategyType } from '../interfaces';

// @Injectable()
// export class AppGuard extends AuthGuard(['jwt', 'bearer']) {
//   constructor(protected reflector: Reflector) {
//     super(reflector);
//   }

//   canActivate(context: ExecutionContext) {
//     const [authStrategy, authGroups] =
//       this.reflector.getAllAndOverride<AuthStrategyType>(AUTH_STRATEGY_KEY, [
//         context.getHandler(),
//         context.getClass(),
//       ]) || [];
//     const request = context.switchToHttp().getRequest();
//     const authTokenType = this.getAuthTokenType(request);
//     if (
//       authTokenType === 'bearer' &&
//       (authStrategy !== AuthStrategyType.HTTP_BEARER || !authStrategy)
//     ) {
//       return false;
//     }
//     request._authGroups = authGroups || [];

//     return super.canActivate(context);
//   }

//   private getAuthTokenType(req: Request): 'bearer' | 'jwt' {
//     const authToken = String(req.header('authorization'));

//     try {
//       return !req.query?.access_token && jwtDecode(authToken.split(/\s+/)[1])
//         ? 'jwt'
//         : 'bearer';
//     } catch (e) {
//       return 'bearer';
//     }
//   }
// }
