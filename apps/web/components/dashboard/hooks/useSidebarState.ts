"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "stoneai-sidebar-collapsed";
const MOBILE_BREAKPOINT = 768;

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setCollapsed(true);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed, ready]);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((current) => !current);
  }, []);

  const openMobile = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return {
    collapsed: isMobile ? false : collapsed,
    collapsedPreference: collapsed,
    toggleCollapsed,
    mobileOpen,
    openMobile,
    closeMobile,
    isMobile,
    ready,
  };
}
