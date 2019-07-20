import joi from 'joi';
import { NextFunction } from 'express';

export function getOrThrow<T>(value: any, schema: joi.SchemaLike, next?: NextFunction): T | undefined {
  const {error, value: v} = joi.validate(value, schema);
  if (error) {
    if (next) {
      next(error);
      return;
    } else {
      throw error;
    }
  }

  return v;
}
