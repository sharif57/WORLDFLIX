"use client";

import {
  Home,
  Globe,
  LayoutGrid,
  Heart,
  Shuffle,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

export function MobileNav() {
  const { activeView, setActiveView, clearFilters, favorites, allChannels, openPlayer } =
    useAppStore();

  const handleNav = (view: typeof activeView) => {
    setActiveView(view);
    clearFilters();
  };

  const handleRandom = () => {
    if (allChannels.length === 0) return;
    const live = allChannels.filter((ch) => ch.isLive);
    const pool = live.length > 0 ? live : allChannels;
    openPlayer(pool[Math.floor(Math.random() * pool.length)]);
  };

  const items = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "countries" as const, label: "Countries", icon: Globe },
    { id: "random" as const, label: "Random", icon: Shuffle },
    { id: "categories" as const, label: "Categories", icon: LayoutGrid },
    { id: "favorites" as const, label: "Favorites", icon: Heart, count: favorites.length },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/50 bg-background/90 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around h-14">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              item.id === "random" ? handleRandom() : handleNav(item.id)
            }
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-medium transition-colors ${
              activeView === item.id
                ? "text-neon"
                : "text-muted-foreground"
            }`}
            aria-label={item.label}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
            {item.count !== undefined && item.count > 0 && (
              <span className="absolute -top-0.5 -right-1 w-4 h-4 bg-neon text-black text-[8px] font-bold rounded-full flex items-center justify-center">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
