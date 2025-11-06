
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  async transform(value: any) {
    try {
      // parseAsync in case there are async refinements; parse is fine for sync-only
      const parsed = await this.schema.parseAsync(value);
      return parsed;
    } catch (err) {
      if (err instanceof ZodError) {

        const formatted = err.issues.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new BadRequestException({ message: 'Validation failed', errors: formatted });
      }
      throw err;
    }
  }
}
