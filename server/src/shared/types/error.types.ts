export interface AppError extends Error {
    status: string;
    name: string;
    errorCode?: string;

}