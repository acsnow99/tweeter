export async function handleError<T>(callback: () => Promise<T>): Promise<T> {
    return await callback();
}