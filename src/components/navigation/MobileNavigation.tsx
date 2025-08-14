'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { 
  HomeIcon, 
  MapIcon, 
  CalculatorIcon, 
  ChartBarIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MapIcon as MapIconSolid,
  CalculatorIcon as CalculatorIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  WrenchScrewdriverIcon as WrenchScrewdriverIconSolid,
} from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
import { useComplexity } from '@/components/common/ComplexityToggle';

interface NavItem {
  name: string;
  shortName?: string; // For compact display
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string;
  notification?: boolean;
  progress?: number; // For progress indicators
  requiresAuth?: boolean;
  requiresOnboarding?: boolean;
  experienceLevel?: 'beginner' | 'experienced' | 'adaptive' | 'all';
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    shortName: 'Home',
    href: '/dashboard',
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
    requiresAuth: true,
    requiresOnboarding: true,
    experienceLevel: 'all',
  },
  {
    name: 'Calculators',
    shortName: 'Calc',
    href: '/calculators',
    icon: CalculatorIcon,
    activeIcon: CalculatorIconSolid,
    requiresAuth: true,
    requiresOnboarding: true,
    experienceLevel: 'all',
  },
  {
    name: 'Progress',
    shortName: 'Stats',
    href: '/progress',
    icon: ChartBarIcon,
    activeIcon: ChartBarIconSolid,
    requiresAuth: true,
    requiresOnboarding: true,
    experienceLevel: 'experienced',
  },
  {
    name: 'Tools',
    shortName: 'More',
    href: '/tools',
    icon: WrenchScrewdriverIcon,
    activeIcon: WrenchScrewdriverIconSolid,
    requiresAuth: true,
    requiresOnboarding: true,
    experienceLevel: 'experienced',
  },
];

export default function MobileNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const { mode: complexityMode, isBeginnerMode, isExperiencedMode } = useComplexity();
  
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Hide/show navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Don't show navigation on auth pages or if user isn't authenticated
  if (!user || pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/onboarding')) {
    return null;
  }

  // Filter nav items based on user state and complexity mode
  const filteredNavItems = navItems.filter(item => {
    if (item.requiresAuth && !user) return false;
    if (item.requiresOnboarding && (!profile || !profile.location)) return false;
    
    // Filter by experience level
    if (item.experienceLevel === 'beginner' && !isBeginnerMode) return false;
    if (item.experienceLevel === 'experienced' && isBeginnerMode) return false;
    
    return true;
  });

  // Limit items for beginner mode
  const displayItems = isBeginnerMode ? filteredNavItems.slice(0, 3) : filteredNavItems;
  
  // Update selected index when pathname changes
  useEffect(() => {
    const activeIndex = displayItems.findIndex(item => 
      pathname === item.href || pathname.startsWith(item.href + '/')
    );
    if (activeIndex !== -1) {
      setSelectedIndex(activeIndex);
    }
  }, [pathname, displayItems]);

  // Gesture handling for horizontal navigation
  const navX = useMotionValue(0);
  const handlePan = (event: any, info: PanInfo) => {
    const { offset } = info;
    
    if (Math.abs(offset.x) > 50 && Math.abs(offset.y) < 30) {
      if (offset.x > 50 && selectedIndex > 0) {
        // Swipe right - go to previous tab
        const newIndex = selectedIndex - 1;
        setSelectedIndex(newIndex);
        router.push(displayItems[newIndex].href);
      } else if (offset.x < -50 && selectedIndex < displayItems.length - 1) {
        // Swipe left - go to next tab
        const newIndex = selectedIndex + 1;
        setSelectedIndex(newIndex);
        router.push(displayItems[newIndex].href);
      }
    }
    
    navX.set(0);
  };

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface-elevated/95 backdrop-blur-sm border-t border-border-light px-2 pb-safe-bottom"
      animate={{ 
        y: isHidden ? '100%' : '0%',
        opacity: isHidden ? 0.8 : 1
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ x: navX }}
      onPan={handlePan}
    >
      <div className="flex justify-around items-center h-16 relative">
        {/* Active indicator background */}
        <motion.div
          className="absolute top-2 h-12 bg-journey-path/10 rounded-xl border border-journey-path/20"
          style={{
            left: `${(selectedIndex / displayItems.length) * 100}%`,
            width: `${100 / displayItems.length}%`,
          }}
          animate={{
            x: `${selectedIndex * (100 / displayItems.length)}%`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        
        {displayItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = isActive ? item.activeIcon : item.icon;
          const displayName = isExperiencedMode && item.shortName ? item.shortName : item.name;
          
          return (
            <motion.div
              key={item.name}
              className="flex-1 relative z-10"
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className={`
                  flex flex-col items-center justify-center touch-target-lg px-2 py-2 
                  text-xs font-medium transition-all duration-200 rounded-xl
                  ${isActive
                    ? 'text-journey-path'
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                <motion.div 
                  className="relative mb-1"
                  animate={{ 
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className="icon-lg" />
                  
                  {/* Enhanced badges and notifications */}
                  {item.badge && (
                    <motion.span 
                      className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-journey-current rounded-full shadow-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                  
                  {item.notification && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-journey-current rounded-full shadow-sm"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  {/* Progress indicator for specific items */}
                  {item.progress !== undefined && item.progress > 0 && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-surface-tertiary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-journey-completed rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  )}
                </motion.div>
                
                <motion.span 
                  className="truncate max-w-16 text-center"
                  animate={{ 
                    fontWeight: isActive ? 600 : 400,
                    opacity: isActive ? 1 : 0.8
                  }}
                >
                  {displayName}
                </motion.span>
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      {/* Gesture hint for beginners */}
      {isBeginnerMode && (
        <motion.div 
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-surface-overlay rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <p className="text-xs text-white text-center">
            Swipe to navigate
          </p>
        </motion.div>
      )}
      
      {/* Home indicator for iPhone X+ devices */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-border-medium rounded-full opacity-30" />
    </motion.nav>
  );
}

// Helper component for adding safe area padding on iOS devices
export function MobileNavigationSpacer() {
  return <div className="h-16 pb-safe-bottom" />;
}