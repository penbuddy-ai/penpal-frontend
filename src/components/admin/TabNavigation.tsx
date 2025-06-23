import React from 'react';
import { motion } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
  icon: string;
  count?: number;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * Tab Navigation Component
 * Navigation par onglets pour le dashboard admin
 */
export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const isDisabled = tab.disabled;

          return (
            <motion.button
              key={tab.id}
              onClick={() => !isDisabled && onTabChange(tab.id)}
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className={`
                group inline-flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                ${
                  isActive
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : isDisabled
                      ? 'border-transparent text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                      : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>

              {tab.count !== undefined && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`
                    ml-2 py-0.5 px-2 rounded-full text-xs font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-300'
                    }
                  `}
                >
                  {tab.count}
                </motion.span>
              )}

              {isDisabled && (
                <span className="ml-1 text-xs text-neutral-400 dark:text-neutral-600">(Soon)</span>
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};
