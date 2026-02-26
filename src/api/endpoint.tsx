export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
    ITEMS: `${BASE_URL}/items`,
    ORDERS: `${BASE_URL}/orders`,
    BILLS: `${BASE_URL}/bills`,
    BILLINGS: `${BASE_URL}/billings`,
    PAID_BILLINGS: `${BASE_URL}/billings/paid`,
    CATEGORIES: `${BASE_URL}/categories`,
    AUTH: {
        LOGIN: `${BASE_URL}/auth/login`,
        REGISTER: `${BASE_URL}/auth/register`,
    },
};
