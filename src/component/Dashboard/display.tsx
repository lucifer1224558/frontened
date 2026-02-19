'use client';

import { Item } from '@/lib/types';
import { useMenu } from '@/context/MenuContext';

interface DisplayProps {
    selectedCategory: string;
    onAddToCart: (item: Item) => void;
}

export default function Display({ selectedCategory, onAddToCart }: DisplayProps) {
    const { items, isLoading, error } = useMenu();

    if (isLoading && items.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#636E72] font-medium">Loading menu...</p>
            </div>
        );
    }

    if (error && items.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="text-4xl">⚠️</div>
                <p className="text-red-500 font-medium">Failed to load menu</p>
                <p className="text-sm text-[#636E72]">{error}</p>
            </div>
        );
    }

    const filteredItems = selectedCategory === 'All'
        ? items
        : items.filter(item => item.category === selectedCategory);

    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-8 overflow-y-auto pr-2 pb-12">
            {filteredItems.map((item) => (
                <div
                    key={item.id}
                    className="flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-2 cursor-pointer group border border-black/5"
                    onClick={() => onAddToCart(item)}
                >
                    <div className="text-[50px] bg-[#F4F7F9] h-[140px] flex items-center justify-center transition-colors group-hover:bg-orange-500/5 relative overflow-hidden">
                        <span className="relative z-10 transition-transform duration-500 group-hover:scale-125">{item.image}</span>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                        <div>
                            <h3 className="text-[16px] font-black text-[#2D3436] leading-tight group-hover:text-orange-500 transition-colors line-clamp-2 min-h-[2.5rem]">{item.name}</h3>
                            <span className="text-[11px] font-bold text-[#B2BEC3] uppercase tracking-wider mt-1 block">{item.category}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <p className="text-xl text-orange-500 font-black">₹{item.price}</p>
                            <button
                                className="w-10 h-10 bg-orange-500 text-white rounded-xl font-black flex items-center justify-center text-2xl transition-all hover:bg-orange-600 hover:rotate-90 shadow-lg shadow-orange-500/20 active:scale-90"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToCart(item);
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
