type DebounceFunction<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void;

function useDebounce<T extends (...args: any[]) => void>(func: T, wait: number): DebounceFunction<T> {
    let timeout: NodeJS.Timeout;

    return function(...args: Parameters<T>): void {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

export default useDebounce;
