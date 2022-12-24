import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetProject = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.project[data];
    }
    return request.project;
  },
);
