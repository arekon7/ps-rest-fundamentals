import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validate =
    (schema: AnyZodObject) =>
        async (req: Request, res: Response, next: NextFunction,) => {
            const result = await schema.safeParseAsync({
                params: req.params,
                query: req.query,
                body: req.body,
            });

            if (result.success) {
                return next();
            } else {
                return res.status(400).json({
                    message: "Validation Error",
                    errors: result.error.issues.map((issue) => ({
                        path: issue.path.join(": "),
                        message: issue.message,
                    })),
                });
            }


        }