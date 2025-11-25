/* Safe storage wrapper.
   Tries to require AsyncStorage; if not available, falls back to an in-memory Map.
*/
let AsyncStorageImpl: any = null;

try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const mod = require('@react-native-async-storage/async-storage');
    AsyncStorageImpl = mod && (mod.default ?? mod);
} catch (e) {
    AsyncStorageImpl = null;
}

const memory = new Map<string, string>();

export async function getItem(key: string): Promise<string | null> {
    if (AsyncStorageImpl && typeof AsyncStorageImpl.getItem === 'function') {
        return AsyncStorageImpl.getItem(key);
    }
    return memory.has(key) ? memory.get(key) ?? null : null;
}

export async function setItem(key: string, value: string): Promise<void> {
    if (AsyncStorageImpl && typeof AsyncStorageImpl.setItem === 'function') {
        return AsyncStorageImpl.setItem(key, value);
    }
    memory.set(key, value);
}

export async function removeItem(key: string): Promise<void> {
    if (AsyncStorageImpl && typeof AsyncStorageImpl.removeItem === 'function') {
        return AsyncStorageImpl.removeItem(key);
    }
    memory.delete(key);
}

export async function clear(): Promise<void> {
    if (AsyncStorageImpl && typeof AsyncStorageImpl.clear === 'function') {
        return AsyncStorageImpl.clear();
    }
    memory.clear();
}

export default { getItem, setItem, removeItem, clear };
