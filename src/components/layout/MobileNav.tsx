import React from 'react';
import { Home, Compass, PlusSquare, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { route, navigate } = useApp();

  if (route.name === 'landing') return null;

  const items = [
    { key: 'home', label: 'Home', icon: Home, onClick: () => navigate({ name: 'home' }) },
    { key: 'explore', label: 'Explore', icon: Compass, onClick: () => navigate({ name: 'explore' }) },
    { key: 'create', label: 'Create', icon: PlusSquare, onClick: () => navigate({ name: 'create' }) },
    { key: 'profile', label: 'Profile', icon: User, onClick: () => navigate({ name: 'profile' }) },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-white/95 backdrop-blur-md border-t border-zinc-200 flex items-center justify-around px-2"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = route.name === item.key;
        return (
          <button
            key={item.key}
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-11 rounded-xl transition-colors cursor-pointer ${
              active ? 'text-[#E60023]' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[11px] font-semibold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
