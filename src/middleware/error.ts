import {NextFunction, Request, Response} from 'express';

export function customErrorHandler(error: Error, req: Request, res: Response, next: NextFunction){
    if(error.message === 'input validation error'){
        console.log('=== Input Validation Error ===');
        res.sendStatus(400);
    }
    else {
        next(error);
    }
}

export function clientErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (!req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    } else {
        next(err);
    }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    res.status(500);
    res.render('error', { error: err });
}

export function joiError(err: any, req: Request, res: Response, next: NextFunction) {
    if (err && err.isJoi) {
        res.status(400).send(err.details);
    } else {
        next(err);
    }
}