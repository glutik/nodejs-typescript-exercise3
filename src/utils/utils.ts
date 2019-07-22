import {NextFunction, Request, Response} from 'express';
import {Category, Product} from '../models';

const productsData = require('../data/products.json');
const productsJson: Product[] = productsData.products;
const categoriesData = require('../data/categories.json');
const categoriesJson: Category[] = categoriesData.categories;

export function loadProducts(): Promise<Product[]> {
    return Promise.resolve(productsJson);
}

export function loadCategories(): Promise<Category[]> {
    return Promise.resolve(categoriesJson);
}

export function loadProductsMw(req: Request, res: Response, next: NextFunction) {
    loadProducts()
        .then(products => {
            res.locals.products = products;
            next();
        })
        .catch(next);
}

export function loadCategoriesMw(req: Request, res: Response, next: NextFunction) {
    loadCategories()
        .then(categories => {
            res.locals.categories = categories;
            next();
        })
        .catch(next);
}

export function resolveProductsFromResponse(res: Response) {
    return res.locals.products;
}

export function resolveCategoriesFromResponse(res: Response) {
    return res.locals.categories;
}

export async function findProductsByIndexOrNotFound(req: Request, res: Response, next: NextFunction) {
    const products = await loadProducts();
    findByIndexOrNotFound(products, req, res, next);
}

export async function findCategoriesByIndexOrNotFound(req: Request, res: Response, next: NextFunction) {
    const categories = await loadCategories();
    findByIndexOrNotFound(categories, req, res, next);
}

function findByIndexOrNotFound(entities: Product[] | Category[], req: Request, res: Response, next: NextFunction) {

    try {
        const {id} = req.params;
        const entityIndex = (entities as any[]).findIndex(entity => entity.id === id);

        if (entityIndex < 0) {
            res.sendStatus(404);
            return;
        }

        res.locals.entityIndex = entityIndex;
        next();
    } catch (err) {
        next(err);
    }
}

export function checkIndexLengthOrBadRequest(req: Request, res: Response, next: NextFunction) {
    try {
        const {id} = req.params;
        if (id.length !== 36) {
            throw new Error('input validation error');
            return;
        }
        next();
    } catch (err) {
        next(err);
    }
}

export function checkNameLengthOrConflict(req: Request, res: Response, next: NextFunction) {
    try {
        const {name} = req.body;
        if (name.length < 3) {
            throw new Error('input validation error');
            return;
        }
        next();
    } catch (err) {
        next(err);
    }
}
