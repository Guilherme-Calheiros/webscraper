'use client';

import { SearchBar } from "./SearchBar";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";
import { useState, useRef, useEffect } from "react";
import { extrairMLB } from "../utils/regex";
import { Menu, X, User, Bell, LogOut, ChevronDown } from "lucide-react";

export function Header({ search = true }) {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const onSearchChange = (e) => {
    setBusca(e.target.value);
  }

  const onSearchSubmit = (e) => {
    e.preventDefault();

    const MLB = extrairMLB(busca);
    if (MLB) {
      router.push(`/produto/${MLB}?url=${encodeURIComponent(busca)}`);
      return;
    }

    router.push(`/busca/${encodeURIComponent(busca)}?page=1`);
  }

  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-secondary text-white shadow-md">
      <div className="mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <h1 
            className="text-xl md:text-2xl font-bold hover:cursor-pointer whitespace-nowrap flex-shrink-0" 
            onClick={() => router.push('/')}
          >
            MeliTrack
          </h1>

          {search && (
            <div className="hidden md:block flex-1 max-w-2xl">
              <SearchBar
                value={busca}
                onChange={onSearchChange}
                onSubmit={onSearchSubmit}
              />
            </div>
          )}

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-secondary flex items-center justify-center font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-sm font-medium max-w-[150px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        router.push('/perfil');
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Meu Perfil
                    </button>
                    
                    <button
                      onClick={() => {
                        router.push('/alertas');
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      Meus Alertas
                    </button>
                    
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-sm font-medium bg-primary text-secondary rounded-md hover:bg-primary/90 transition-colors"
              >
                Entrar
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {search && (
          <div className="md:hidden mt-3">
            <SearchBar
              value={busca}
              onChange={onSearchChange}
              onSubmit={onSearchSubmit}
            />
          </div>
        )}

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2 border-t border-white/20 pt-4">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-white/10 rounded-md">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-white/70 truncate">{user.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    router.push('/perfil');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-white/10 rounded-md transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Meu Perfil
                </button>
                
                <button
                  onClick={() => {
                    router.push('/alertas');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-white/10 rounded-md transition-colors flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Meus Alertas
                </button>
                
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  router.push('/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-sm font-medium bg-primary text-secondary rounded-md hover:bg-primary/90 transition-colors"
              >
                Entrar
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}