export interface Item {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
}

export interface CartItem extends Item {
    quantity: number;
}
