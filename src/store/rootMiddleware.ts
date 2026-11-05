import { bookApi } from "./book/api"

export const rootMiddleware = [bookApi.middleware]
