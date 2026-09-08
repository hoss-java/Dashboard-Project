// src/components/renderers/NumericDisplay/NumericDisplayComponent.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { resolveValue } from '../../utils/resolveValue';
import { dataRegistry } from '../../../services/DataRegistry';
import type { ItemRendererProps } from '../../types';

// Map MUI colour token names → hex for SVG use
const COLOR_MAP: Record<string, string> = {
  primary:   '#4f8ef7',
  secondary: '#a78bfa',
  success:   '#34d399',
  warning:   '#fbbf24',
  error:     '#f87171',
  info:      '#38bdf8',
};
const resolveHex = (c: string) => COLOR_MAP[c] ?? c;

export const NumericDisplayComponent: React.FC<ItemRendererProps> = ({
  item,
  defaultStyle,
  onItemClick,
}) => {
  const [value, setValue] = useState<number>(item.value ?? 0);
  const [trendHistory, setTrendHistory] = useState<number[]>([]);

  // ── Config ──────────────────────────────────────────────────────────────
  const label          = resolveValue(item.label, defaultStyle?.label, '');
  const decimals       = resolveValue(item.decimals, defaultStyle?.decimals, 2);
  const prefix         = resolveValue(item.prefix, defaultStyle?.prefix, '');
  const suffix         = resolveValue(item.suffix, defaultStyle?.suffix, '');
  const format         = resolveValue(item.format, defaultStyle?.format, 'standard');
  const minValue       = resolveValue(item.minValue, defaultStyle?.minValue, 0);
  const maxValue       = resolveValue(item.maxValue, defaultStyle?.maxValue, 100);
  const showBorder     = resolveValue(item.showBorder, defaultStyle?.showBorder, true);
  const valueColor     = resolveValue(item.valueColor, defaultStyle?.valueColor, 'text.primary');
  const labelColor     = resolveValue(item.labelColor, defaultStyle?.labelColor, 'text.secondary');
  const fontSize       = resolveValue(item.fontSize, defaultStyle?.fontSize, 24);
  const labelFontSize  = resolveValue(item.labelFontSize, defaultStyle?.labelFontSize, 12);
  const fontWeight     = resolveValue(item.fontWeight, defaultStyle?.fontWeight, 'bold');
  const alignment      = resolveValue(item.alignment, defaultStyle?.alignment, 'center') as 'left' | 'center' | 'right';
  const showUnit       = resolveValue(item.showUnit, defaultStyle?.showUnit, true);
  const animateChanges = resolveValue(item.animateChanges, defaultStyle?.animateChanges, false);
  const padding        = resolveValue(item.padding, defaultStyle?.padding, 1);
  const gap            = resolveValue(item.gap, defaultStyle?.gap, 0.5);
  const variant        = resolveValue(item.variant, defaultStyle?.variant, 'text') as
    'text' | 'bar' | 'gauge' | 'thermometer' | 'trend';

  const barHeight          = resolveValue(item.barHeight, defaultStyle?.barHeight, 10);
  const barColor           = resolveValue(item.barColor, defaultStyle?.barColor, 'primary');
  const gaugeSize          = resolveValue(item.gaugeSize, defaultStyle?.gaugeSize, 120);
  const gaugeThickness     = resolveValue(item.gaugeThickness, defaultStyle?.gaugeThickness, 8);
  const gaugeColor         = resolveValue(item.gaugeColor, defaultStyle?.gaugeColor, 'primary');
  const thermometerHeight  = resolveValue(item.thermometerHeight, defaultStyle?.thermometerHeight, 120);
  const trendWindow        = resolveValue(item.trendWindow, defaultStyle?.trendWindow, 10);

  // ── Stable callback ID ──────────────────────────────────────────────────
  const callbackId = useMemo(() => `numericDisplay-${item.id}`, [item.id]);

  // ── Data subscription ───────────────────────────────────────────────────
  useEffect(() => {
    const dataName = item.content;
    if (!dataName) {
      setValue(item.value ?? 0);
      return;
    }
    if (!dataRegistry.get(dataName)) dataRegistry.register(dataName, 0);
    setValue(Number(dataRegistry.get(dataName)) || 0);

    const handleChange = (newVal: any) => {
      const n = Number(newVal) || 0;
      setValue(n);
      if (variant === 'trend') {
        setTrendHistory((prev) => [...prev, n].slice(-trendWindow));
      }
    };
    dataRegistry.onChange(dataName, callbackId, handleChange);
    return () => dataRegistry.offChange(dataName, callbackId);
  }, [item.content, item.id, item.value, variant, trendWindow, callbackId]);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const percent = maxValue === minValue ? 0 : ((value - minValue) / (maxValue - minValue)) * 100;
  const clampedPercent = Math.min(100, Math.max(0, percent));

  const formatValue = (v: number): string => {
    if (isNaN(v)) return 'N/A';
    const fixed = v.toFixed(decimals);
    switch (format) {
      case 'currency':   return `${prefix || '$'}${fixed}${suffix ? ` ${suffix}` : ''}`;
      case 'percentage': return `${fixed}${suffix || '%'}`;
      case 'custom':     return `${prefix}${fixed}${suffix}`;
      default:           return showUnit ? `${prefix}${fixed}${suffix}` : fixed;
    }
  };

  const alignItems = alignment === 'center' ? 'center' : alignment === 'left' ? 'flex-start' : 'flex-end';

  const containerSx = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap,
    p: padding,
    border: showBorder ? '1px solid' : 'none',
    borderColor: 'divider',
    borderRadius: 2,
    cursor: 'pointer',
    transition: animateChanges ? 'all 250ms ease' : 'none',
    alignItems,
    '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
  };

  const labelSx = { fontSize: labelFontSize, color: labelColor, fontWeight: 'normal' };
  const valueSx = {
    fontSize,
    fontWeight,
    color: valueColor,
    transition: animateChanges ? 'color 250ms ease' : 'none',
  };

  // ── Variants ─────────────────────────────────────────────────────────────

  const renderBar = () => (
    <Box sx={{ width: '100%' }}>
      {label && <Typography sx={labelSx}>{label}</Typography>}
      <LinearProgress
        variant="determinate"
        value={clampedPercent}
        aria-valuenow={value}
        aria-valuemin={minValue}
        aria-valuemax={maxValue}
        aria-label={label || item.id}
        sx={{
          mt: 1,
          height: barHeight,
          borderRadius: 1,
          bgcolor: 'rgba(255,255,255,0.08)',
          '& .MuiLinearProgress-bar': {
            bgcolor: barColor,
            transition: animateChanges ? 'width 500ms ease' : 'none',
          },
        }}
      />
      <Typography sx={{ ...valueSx, mt: 0.5, fontSize: fontSize * 0.7 }}>
        {formatValue(value)}
      </Typography>
    </Box>
  );

  const renderGauge = () => {
    const hex = resolveHex(gaugeColor);
    const r = gaugeSize * 0.35;
    const circ = Math.PI * r;
    const offset = circ * (1 - clampedPercent / 100);
    const svgH = gaugeSize / 2 + 10;
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5, width: '100%' }}>
        <Box
          role="meter"
          aria-valuenow={value}
          aria-valuemin={minValue}
          aria-valuemax={maxValue}
          aria-label={label || item.id}
          sx={{ flexShrink: 0, width: gaugeSize, height: svgH }}
        >
          <svg width={gaugeSize} height={svgH} viewBox={`0 0 ${gaugeSize} ${svgH}`}>
            <path
              d={`M ${gaugeSize * 0.1} ${gaugeSize / 2} A ${r} ${r} 0 0 1 ${gaugeSize * 0.9} ${gaugeSize / 2}`}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={gaugeThickness}
              fill="none"
            />
            <path
              d={`M ${gaugeSize * 0.1} ${gaugeSize / 2} A ${r} ${r} 0 0 1 ${gaugeSize * 0.9} ${gaugeSize / 2}`}
              stroke={hex}
              strokeWidth={gaugeThickness}
              fill="none"
              strokeDasharray={`${circ - offset} ${circ}`}
              style={{ transition: animateChanges ? 'stroke-dasharray 500ms ease' : 'none' }}
            />
            <circle cx={gaugeSize / 2} cy={gaugeSize / 2} r={4} fill={hex} />
          </svg>
        </Box>
        <Box>
          {label && <Typography sx={labelSx}>{label}</Typography>}
          <Typography sx={valueSx}>{formatValue(value)}</Typography>
        </Box>
      </Box>
    );
  };

  const renderThermometer = () => {
    const hex = resolveHex(gaugeColor);
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, width: '100%' }}>
        {/* Thermometer tube + bulb */}
        <Box
          role="meter"
          aria-valuenow={value}
          aria-valuemin={minValue}
          aria-valuemax={maxValue}
          aria-label={label || item.id}
          sx={{ position: 'relative', flexShrink: 0, pb: '20px' }}
        >
          <Box
            sx={{
              width: 22,
              height: thermometerHeight,
              border: `2px solid ${hex}`,
              borderRadius: '11px 11px 0 0',
              position: 'relative',
              bgcolor: 'rgba(255,255,255,0.04)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: `${clampedPercent}%`,
                bgcolor: hex,
                transition: animateChanges ? 'height 500ms ease' : 'none',
                opacity: 0.85,
              }}
            />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 28,
              height: 28,
              bgcolor: hex,
              borderRadius: '50%',
            }}
          />
        </Box>
        {/* Label + value beside the thermometer */}
        <Box>
          {label && <Typography sx={labelSx}>{label}</Typography>}
          <Typography sx={valueSx}>{formatValue(value)}</Typography>
        </Box>
      </Box>
    );
  };

  const renderTrend = () => {
    let dir: 'up' | 'down' | 'flat' = 'flat';
    if (trendHistory.length >= 2) {
      const last = trendHistory[trendHistory.length - 1];
      const prev = trendHistory[trendHistory.length - 2];
      if (last > prev) dir = 'up';
      else if (last < prev) dir = 'down';
    }
    const trendColor = dir === 'up' ? 'success.main' : dir === 'down' ? 'error.main' : 'text.secondary';
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems }}>
        {label && <Typography sx={labelSx}>{label}</Typography>}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <Typography sx={valueSx}>{formatValue(value)}</Typography>
          {dir === 'up'   && <TrendingUpIcon   sx={{ color: trendColor, fontSize: 22 }} aria-label="trending up" />}
          {dir === 'down' && <TrendingDownIcon sx={{ color: trendColor, fontSize: 22 }} aria-label="trending down" />}
          {dir === 'flat' && <TrendingFlatIcon sx={{ color: trendColor, fontSize: 22 }} aria-label="stable" />}
        </Box>
      </Box>
    );
  };

  const renderText = () => (
    <>
      {label && <Typography sx={labelSx}>{label}</Typography>}
      <Typography sx={valueSx} aria-label={`${label}: ${formatValue(value)}`}>
        {formatValue(value)}
      </Typography>
    </>
  );

  return (
    <Box
      sx={containerSx}
      onClick={() => onItemClick && onItemClick(item.id, item)}
      role="region"
      aria-label={label || item.id}
    >
      {variant === 'bar'         && renderBar()}
      {variant === 'gauge'       && renderGauge()}
      {variant === 'thermometer' && renderThermometer()}
      {variant === 'trend'       && renderTrend()}
      {(variant === 'text' || !variant) && renderText()}
    </Box>
  );
};

export default NumericDisplayComponent;
