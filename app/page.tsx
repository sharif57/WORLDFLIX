"use client";

import { useMemo, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { InlinePlayer } from "@/components/InlinePlayer";
import { ChannelGrid } from "@/components/ChannelGrid";
import { FavoritesView } from "@/components/FavoritesView";
import { useChannels } from "@/hooks/useChannels";
import { useAppStore } from "@/lib/store";
import { Tv } from "lucide-react";

export default function HomePage() {
  const {
    channels,
    allChannels,
    trendingChannels,
    localChannels,
    countries,
    categories,
    languages,
    isLoading,
    error,
  } = useChannels();

  const activeView = useAppStore((s) => s.activeView);
  const filters = useAppStore((s) => s.filters);
  const openPlayer = useAppStore((s) => s.openPlayer);
  const currentChannel = useAppStore((s) => s.currentChannel);
  const hydrateFavorites = useAppStore((s) => s.hydrateFavorites);
  const userCountry = useAppStore((s) => s.userCountry);
  const userCountryName = useAppStore((s) => s.userCountryName);
  const userCountryFlag = useAppStore((s) => s.userCountryFlag);
  const setUserCountry = useAppStore((s) => s.setUserCountry);
  const hasAutoPlayed = useRef(false);

  // Hydrate favorites from localStorage on client mount
  useEffect(() => {
    hydrateFavorites();
  }, [hydrateFavorites]);

  // Detect user country via IP geolocation (with fallback)
  useEffect(() => {
    if (userCountry) return;

    const codeToFlag = (code: string) =>
      code
        .toUpperCase()
        .split("")
        .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
        .join("");

    // Try primary API, then fallback
    fetch("https://ipapi.co/json/")
      .then((res) => {
        if (!res.ok) throw new Error("ipapi failed");
        return res.json();
      })
      .then((data) => {
        if (data?.country_code && data?.country_name) {
          const code = data.country_code.toUpperCase();
          setUserCountry(code, data.country_name, codeToFlag(code));
        } else {
          throw new Error("no data");
        }
      })
      .catch(() => {
        // Fallback API
        fetch("https://ipwho.is/")
          .then((res) => res.json())
          .then((data) => {
            if (data?.country_code && data?.country) {
              const code = data.country_code.toUpperCase();
              setUserCountry(code, data.country, codeToFlag(code));
            }
          })
          .catch(() => { });
      });
  }, [userCountry, setUserCountry]);

  // Auto-play: prefer local channel, fallback to random from top 50
  useEffect(() => {
    if (hasAutoPlayed.current) return;
    if (allChannels.length === 0) return;

    // Wait a moment for country detection, but don't block forever
    if (!userCountry) {
      // Set a short timeout — if country isn't detected in 1.5s, play global
      const timer = setTimeout(() => {
        if (hasAutoPlayed.current) return;
        hasAutoPlayed.current = true;
        const top = allChannels.slice(0, 50);
        const random = top[Math.floor(Math.random() * top.length)];
        openPlayer(random);
      }, 1500);
      return () => clearTimeout(timer);
    }

    hasAutoPlayed.current = true;

    // Try local channels first
    if (localChannels.length > 0) {
      const top = localChannels.slice(0, Math.min(20, localChannels.length));
      const random = top[Math.floor(Math.random() * top.length)];
      openPlayer(random);
    } else {
      // Fallback to global top 50
      const top = allChannels.slice(0, 50);
      const random = top[Math.floor(Math.random() * top.length)];
      openPlayer(random);
    }
  }, [allChannels, localChannels, userCountry, openPlayer]);

  const viewTitle = useMemo(() => {
    switch (activeView) {
      case "countries": {
        if (filters.countries.length === 1) {
          const country = countries.find(
            (c) => c.code === filters.countries[0]
          );
          return country ? `${country.flag} ${country.name}` : "Countries";
        }
        return "All Countries";
      }
      case "categories": {
        if (filters.categories.length === 1) {
          const cat = categories.find((c) => c.id === filters.categories[0]);
          return cat ? cat.name : "Categories";
        }
        return "All Categories";
      }
      case "languages": {
        if (filters.languages.length === 1) {
          const lang = languages.find(
            (l) => l.code === filters.languages[0]
          );
          return lang ? lang.name : "Languages";
        }
        return "All Languages";
      }
      case "sports":
        return "Sports Channels";
      default:
        return "";
    }
  }, [activeView, filters, countries, categories, languages]);

  const isFiltered =
    filters.search ||
    filters.countries.length > 0 ||
    filters.categories.length > 0 ||
    filters.languages.length > 0;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Failed to load channels</h1>
          <p className="text-muted-foreground">
            Please check your connection and refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        countries={countries}
        categories={categories}
        languages={languages}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          {/* Loading state — full page */}
          {isLoading && allChannels.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-neon/20 border-t-neon animate-spin" />
                <Tv className="absolute inset-0 m-auto h-8 w-8 text-neon" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">WORLDFLIX</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Loading thousands of live channels...
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-[1800px] mx-auto">
              {/* Player — always visible at the top */}
              <div className="p-2 sm:p-3 md:p-4 lg:p-6 pb-0 sm:pb-0 md:pb-0 lg:pb-0">
                <InlinePlayer />
              </div>

              {/* Channel sections below */}
              <div className="p-2 sm:p-3 md:p-4 lg:p-6 space-y-6 sm:space-y-8">
                {/* Search results */}
                {isFiltered && (
                  <ChannelGrid
                    channels={channels}
                    isLoading={false}
                    title={
                      filters.search
                        ? `Results for "${filters.search}"`
                        : viewTitle
                    }
                  />
                )}

                {/* Home — local + trending + all */}
                {!isFiltered && activeView === "home" && (
                  <>
                    {/* Local channels from user's country — shown first */}
                    {localChannels.length > 0 && userCountryName && (
                      <ChannelGrid
                        channels={localChannels}
                        isLoading={false}
                        title={`${userCountryFlag || ""} ${userCountryName} Channels`}
                        pageSize={12}
                        showLoadMore={localChannels.length > 12}
                      />
                    )}

                    {trendingChannels.length > 0 && (
                      <ChannelGrid
                        channels={trendingChannels}
                        isLoading={false}
                        title="Trending Now"
                        pageSize={12}
                        showLoadMore={false}
                      />
                    )}
                    <ChannelGrid
                      channels={channels}
                      isLoading={false}
                      title="All Channels"
                      pageSize={24}
                      showLoadMore={true}
                    />
                  </>
                )}

                {/* Favorites */}
                {!isFiltered && activeView === "favorites" && (
                  <FavoritesView allChannels={allChannels} />
                )}

                {/* Browse views */}
                {!isFiltered &&
                  (activeView === "countries" ||
                    activeView === "categories" ||
                    activeView === "languages" ||
                    activeView === "sports") && (
                    <ChannelGrid
                      channels={
                        activeView === "sports"
                          ? allChannels.filter((ch) =>
                            ch.categories?.some(
                              (cat) =>
                                cat.toLowerCase() === "sports" ||
                                cat.toLowerCase() === "sport"
                            )
                          )
                          : channels
                      }
                      isLoading={false}
                      title={viewTitle}
                    />
                  )}
              </div>
            </div>
          )}
        </main>

        <MobileNav />
      </div>
    </div>
  );
}
