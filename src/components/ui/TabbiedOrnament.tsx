'use client';

import React, { useEffect, useState } from 'react';
import { TabbiedPattern } from 'tabbied/react';
import type { PatternDefinition } from 'tabbied';
import {
  radius,
  bauhaus,
  dotmatrix,
  quartercirclequilt,
  isometricblocks,
  crosslattice,
} from 'tabbied/patterns';

export type TabbiedPresetName = 'radius' | 'bauhaus' | 'dotmatrix' | 'quilt' | 'blocks' | 'lattice';

const PRESETS: Record<TabbiedPresetName, PatternDefinition> = {
  radius,
  bauhaus,
  dotmatrix,
  quilt: quartercirclequilt,
  blocks: isometricblocks,
  lattice: crosslattice,
};

interface TabbiedOrnamentProps {
  preset?: TabbiedPresetName;
  seed?: string;
  palette?: string[];
  className?: string;
  redrawInterval?: number;
  fit?: 'grid' | 'cover' | 'fixed';
  opacity?: number;
}

export const TabbiedOrnament: React.FC<TabbiedOrnamentProps> = ({
  preset = 'radius',
  seed = 'praktis-pos',
  palette = ['transparent', '#E0511F', '#F97316', '#FDBA74'],
  className = '',
  redrawInterval,
  fit = 'cover',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`overflow-hidden pointer-events-none ${className}`} aria-hidden="true" />;
  }

  const selectedPattern = PRESETS[preset] || radius;

  return (
    <div className={`overflow-hidden pointer-events-none select-none ${className}`} aria-hidden="true">
      <TabbiedPattern
        pattern={selectedPattern}
        seed={seed}
        palette={palette}
        fit={fit}
        redrawInterval={redrawInterval}
      />
    </div>
  );
};
