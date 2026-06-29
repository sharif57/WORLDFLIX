"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Globe,
  LayoutGrid,
  Languages as LanguagesIcon,
  Heart,
  X,
  ChevronRight,
  ChevronDown,
  Tv,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import type { Country, Category, Language } from "@/lib/types";
import Image from "next/image";
import { getFlagImageUrl } from "@/lib/utils";

interface SidebarProps {
  countries: Country[];
  categories: Category[];
  languages: Language[];
}

export function Sidebar({ countries, categories, languages }: SidebarProps) {
  const {
    sidebarOpen,
    setSidebarOpen,
    activeView,
    setActiveView,
    filters,
    setCountryFilter,
    setCategoryFilter,
    setLanguageFilter,
    favorites,
    clearFilters,
  } = useAppStore();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => a.name.localeCompare(b.name)),
    [countries]
  );

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const handleNavClick = (view: typeof activeView) => {
    setActiveView(view);
    clearFilters();
    setSidebarOpen(false);
  };

  const handleCountryClick = (code: string) => {
    setActiveView("countries");
    setCountryFilter([code]);
    setSidebarOpen(false);
  };

  const handleCategoryClick = (id: string) => {
    setActiveView("categories");
    setCategoryFilter([id]);
    setSidebarOpen(false);
  };

  const handleLanguageClick = (code: string) => {
    setActiveView("languages");
    setLanguageFilter([code]);
    setSidebarOpen(false);
  };

  const navItems = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "countries" as const, label: "Countries", icon: Globe },
    { id: 'sports' as const, label: 'Sports', icon: Globe },
    { id: "categories" as const, label: "Categories", icon: LayoutGrid },
    { id: "languages" as const, label: "Languages", icon: LanguagesIcon },
    { id: "favorites" as const, label: "Favorites", icon: Heart, count: favorites.length },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-72 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={500}
                height={200}
                className="h-[120px] w-auto object-contain -my-3"
                priority
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {/* Nav items */}
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item?.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === item.id
                    ? "bg-neon/10 text-neon"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                  {item.count !== undefined && item.count > 0 && (
                    <Badge variant="neon" className="ml-auto text-[10px] px-1.5 py-0">
                      {item.count}
                    </Badge>
                  )}
                </button>
              ))}

              <Separator className="my-3" />

              {/* Countries section */}
              <button
                onClick={() => toggleSection("countries")}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Browse Countries
                </span>
                {expandedSection === "countries" ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              <AnimatePresence>
                {expandedSection === "countries" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="max-h-60 overflow-y-auto space-y-0.5 pl-4">
                      {sortedCountries.map((country) => (
                        <button
                          key={country.code}
                          onClick={() => handleCountryClick(country.code)}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${filters.countries.includes(country.code)
                            ? "bg-neon/10 text-neon"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getFlagImageUrl(country.code)}
                            alt=""
                            className="w-4 h-3 object-cover rounded-sm shrink-0"
                            loading="lazy"
                          />
                          <span className="truncate">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Categories section */}
              <button
                onClick={() => toggleSection("categories")}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Browse Categories
                </span>
                {expandedSection === "categories" ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              <AnimatePresence>
                {expandedSection === "categories" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="max-h-60 overflow-y-auto space-y-0.5 pl-4">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.id)}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${filters.categories.includes(cat.id)
                            ? "bg-neon/10 text-neon"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                        >
                          <span className="truncate">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Languages section */}
              <button
                onClick={() => toggleSection("languages")}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="flex items-center gap-2">
                  <LanguagesIcon className="h-4 w-4" />
                  Browse Languages
                </span>
                {expandedSection === "languages" ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              <AnimatePresence>
                {expandedSection === "languages" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="max-h-60 overflow-y-auto space-y-0.5 pl-4">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageClick(lang.code)}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${filters.languages.includes(lang.code)
                            ? "bg-neon/10 text-neon"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                        >
                          <span className="truncate">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-[10px] text-muted-foreground text-center">
              Powered by iptv-org &middot; WORLDFLIX
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
