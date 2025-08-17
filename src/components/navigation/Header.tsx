'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPinIcon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BuyRightIcon } from '@/components/ui/BuyRightLogo';

interface HeaderProps {
  title?: string;
  showLocation?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
}

const locationLabels: { [key: string]: string } = {
  ON: 'Ontario, Canada',
  BC: 'British Columbia, Canada',
  US_CA: 'California, USA',
  US_NY: 'New York, USA',
  US_TX: 'Texas, USA',
  US_FL: 'Florida, USA',
};

export default function Header({
  title,
  showLocation = true,
  showNotifications = true,
  showUserMenu = true,
  showBackButton = false,
  onBackClick,
  className = '',
}: HeaderProps) {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const result = await signOut();
      if (result.success) {
        router.push('/login');
      } else {
        console.error('Sign out failed:', result.error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const getUserDisplayName = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getLocationDisplay = () => {
    if (!profile?.location) return 'Select Location';
    return locationLabels[profile.location] || profile.location;
  };

  return (
    <header className={`bg-white border-b border-gray-200 px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left side - Back button, Logo, and Title */}
        <div className="flex items-center space-x-3">
          {/* Back Button */}
          {showBackButton && (
            <button
              onClick={() => {
                if (onBackClick) {
                  onBackClick();
                } else {
                  router.back();
                }
              }}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          )}

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
            <BuyRightIcon size="sm" />
          </Link>

          {/* Title */}
          {title && (
            <h1 className="text-xl font-semibold text-gray-900">
              {title}
            </h1>
          )}
        </div>

        {/* Center - Location (on larger screens) */}
        {showLocation && profile && (
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4" />
            <span>{getLocationDisplay()}</span>
          </div>
        )}

        {/* Right side - Notifications and User Menu */}
        <div className="flex items-center space-x-3">
          {/* Location (on mobile) */}
          {showLocation && profile && (
            <Link
              href="/profile/location"
              className="md:hidden flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <MapPinIcon className="w-4 h-4" />
              <span className="max-w-24 truncate">{getLocationDisplay().split(',')[0]}</span>
            </Link>
          )}

          {/* Notifications */}
          {showNotifications && user && (
            <button
              type="button"
              className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5" />
              {/* Notification badge - example */}
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>
          )}

          {/* User Menu */}
          {showUserMenu && user && (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 p-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <UserCircleIcon className="w-6 h-6" />
                <span className="hidden sm:block">{getUserDisplayName()}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  {/* User Info */}
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={`${
                            active ? 'bg-gray-50' : ''
                          } flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50`}
                        >
                          <UserCircleIcon className="w-4 h-4 mr-3" />
                          Profile Settings
                        </Link>
                      )}
                    </Menu.Item>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/settings"
                          className={`${
                            active ? 'bg-gray-50' : ''
                          } flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50`}
                        >
                          <Cog6ToothIcon className="w-4 h-4 mr-3" />
                          App Settings
                        </Link>
                      )}
                    </Menu.Item>
                  </div>

                  {/* Sign Out */}
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleSignOut}
                          disabled={isSigningOut}
                          className={`${
                            active ? 'bg-gray-50' : ''
                          } flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50`}
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                          {isSigningOut ? 'Signing out...' : 'Sign out'}
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}

          {/* Sign In Link for unauthenticated users */}
          {showUserMenu && !user && (
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}