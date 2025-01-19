export const unauthorizedHandle = async (res: Response) => {
    if (res.status === 401) {
        window.location.href = '/login';
        return [];
    }
    if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
};