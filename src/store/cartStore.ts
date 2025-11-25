import { MenuItem } from '@/services/mockData';
import { create } from 'zustand';

interface CartItem extends MenuItem {
    quantity: number;
    selectedCustomizations?: Record<string, string>;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: MenuItem, customizations?: Record<string, string>) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],

    addItem: (item, customizations) => {
        const existingItem = get().items.find((i) => i.id === item.id);
        if (existingItem) {
            set((state) => ({
                items: state.items.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                ),
            }));
        } else {
            set((state) => ({
                items: [...state.items, { ...item, quantity: 1, selectedCustomizations: customizations }],
            }));
        }
    },

    removeItem: (itemId) => {
        set((state) => ({
            items: state.items.filter((i) => i.id !== itemId),
        }));
    },

    updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(itemId);
        } else {
            set((state) => ({
                items: state.items.map((i) =>
                    i.id === itemId ? { ...i, quantity } : i
                ),
            }));
        }
    },

    clearCart: () => set({ items: [] }),

    getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
}));
