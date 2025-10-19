import { Context, Next } from "hono";

export const middleware = async (c: Context, next: Next) => {
    const authorization = c.req.header('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authorization.split(' ')[1];
    if (token !== c.env.API_TOKEN) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    await next();
}