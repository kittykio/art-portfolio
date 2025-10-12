'use client';

import { FC } from 'react';

// Defines the allowed sorting options and includes 'null' to represent no sorting/default state.
export type SortOption = 'mostPopular' | 'newest' | 'oldest' | null;

type SortTabsProps = {
  // The currently active sort option.
  sortBy: SortOption;
  // Callback function to handle the change in sorting preference.
  onChange: (option: SortOption) => void;
};

/**
 * A tab-based component for selecting a sorting preference, designed to work as a toggle.
 * Clicking an active tab deselects it (sets sortBy to null).
 */
const SortTabs: FC<SortTabsProps> = ({ sortBy, onChange }) => {
  // Array defining the visible sort tabs.
  const options = [
    { key: 'mostPopular', label: 'Most Popular' },
    { key: 'newest', label: 'Newest' },
    { key: 'oldest', label: 'Oldest' },
  ] as const; // 'as const' enforces the string literal types for keys.

  /**
   * Handles button click, toggling the sort option.
   * If the clicked key is already active, it sets the sort option to null (off).
   * Otherwise, it sets the sort option to the clicked key (on).
   */
  const handleClick = (key: Exclude<SortOption, null>) => {
    // Only pass the key type that is not null, as null is handled by the toggle logic.
    onChange(sortBy === key ? null : key);
  };

  return (
    <div className="flex justify-center pb-16">
      <div className="inline-flex rounded-lg overflow-hidden border border-lgdg-300">
        {options.map(({ key, label }) => {
          const isActive = sortBy === key;

          return (
            <button
              key={key}
              // Cast key to the non-null type before passing to handleClick
              onClick={() => handleClick(key)}
              className={`px-6 py-2 text-sm transition-colors
              ${
                isActive
                  ? // Active state styling (primary color)
                    'bg-flame-500 hover:bg-flame-700 text-gray-100'
                  : // Inactive state styling (transparent with hover effects)
                    'bg-bg hover:bg-lgdg-100'
              }
              ${key != 'oldest' ? 'border-r border-r-lgdg-300' : ''}
            `}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SortTabs;
