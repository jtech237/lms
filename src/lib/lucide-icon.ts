import * as LucideIcons from 'lucide-react';

type LucideIcon = (typeof LucideIcons)[keyof typeof LucideIcons];

export function getLucideIcon(iconName: string): LucideIcon | null {
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];

  return IconComponent || null;
}
