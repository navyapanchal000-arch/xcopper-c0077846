import React from 'react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onToggleMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onToggleMenu,
}) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#0A0A0C] border-b border-[#B87333]/30 text-white">
      {/* Menu Button Left */}
      <button 
        onClick={onToggleSidebar}
        className="p-2 rounded-md hover:bg-white/5 text-[#B87333]"
      >
        ☰
      </button>

      {/* App Title */}
      <h1 className="text-lg font-bold tracking-wider text-[#D4AF37]">
        X-COPPER AI
      </h1>

      {/* Profile/Menu Right */}
      <button 
        onClick={onToggleMenu}
        className="p-2 rounded-md hover:bg-white/5 text-[#B87333]"
      >
        ⋮
      </button>
    </header>
  );
};

export default Header;
