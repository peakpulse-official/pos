
"use client";

import * as icons from 'lucide-react';

interface DynamicIconProps extends icons.LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const LucideIcon = icons[name as keyof typeof icons] as icons.LucideIcon;

  if (!LucideIcon || typeof LucideIcon !== 'function') {
    // Return a fallback icon if the name is not a valid Lucide icon
    return <icons.HelpCircle {...props} />;
  }

  return <LucideIcon {...props} />;
};
