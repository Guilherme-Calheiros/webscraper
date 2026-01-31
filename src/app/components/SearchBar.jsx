'use client';

import { Search } from "lucide-react";

export function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="relative">
        <input
          className="w-full bg-white text-black pl-4 pr-12 py-2.5 text-sm md:text-base border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          type="text"
          placeholder="URL ou termo de busca"
          value={value}
          onChange={onChange}
          required
        />

        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}