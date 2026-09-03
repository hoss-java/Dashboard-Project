// src/components/renderers/components/NumericDisplay/NumericDisplayComponent.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  SxProps,
  Theme,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { resolveValue } from '../../utils/resolveValue';
import { dataRegistry } from '../../../services/DataRegistry';
import type { ItemRendererProps } from '../../types';

export const NumericDisplayComponent: React.FC<ItemRendererProps> = ({
  item,
  defaultStyle,
  onItemClick,
}) => {
  const callbackId = `numericDisplay-${item.id}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

  const [displayValues, setDisplayValues] = useState<Record<string, any>>({
    [item.id]: 0,
  });

  const [trendHistory, setTrendHistory] = useState<number[]>([]);

  const displayValue = displayValues[item.id] ?? 0;

  // ===== RESOLVED STYLE PROPERTIES =====
  const label = resolveValue(item.label, defaultStyle?.label, '');
  const decimals = resolveValue(item.decimals, defaultStyle?.decimals, 2);
  const prefix = resolveValue(item.prefix, defaultStyle?.prefix, '');
  const suffix = resolveValue(item.suffix, defaultStyle?.suffix, '');
  const format = resolveValue(item.format, defaultStyle?.format, 'standard');
  const minValue = resolveValue(item.minValue, defaultStyle?.minValue, 0);
  const maxValue = resolveValue(item.maxValue, defaultStyle?.maxValue, 100);
  const showBorder = resolveValue(item.showBorder, defaultStyle?.showBorder, true);
  const borderColor = resolveValue(
    item.borderColor,
    defaultStyle?.borderColor,
    'grey.400'
  );
  const valueColor = resolveValue(
    item.valueColor,
    defaultStyle?.valueColor,
    'text.primary'
  );
  const labelColor = resolveValue(
    item.labelColor,
    defaultStyle?.labelColor,
    'text.secondary'
  );
  const backgroundColor = resolveValue(
    item.backgroundColor,
    defaultStyle?.backgroundColor,
    'background.paper'
  );
  const fontSize = resolveValue(item.fontSize, defaultStyle?.fontSize, 32);
  const labelFontSize = resolveValue(
    item.labelFontSize,
    defaultStyle?.labelFontSize,
    14
  );
  const fontWeight = resolveValue(
    item.fontWeight,
    defaultStyle?.fontWeight,
    'bold'
  ) as 'normal' | 'bold' | 'lighter';
  const alignment = resolveValue(
    item.alignment,
    defaultStyle?.alignment,
    'center'
  ) as 'left' | 'center' | 'right';
  const showUnit = resolveValue(item.showUnit, defaultStyle?.showUnit, true);
  const valueSize = resolveValue(
    item.valueSize,
    defaultStyle?.valueSize,
    'medium'
  );
  const animateChanges = resolveValue(
    item.animateChanges,
    defaultStyle?.animateChanges,
    false
  );
  const padding = resolveValue(item.padding, defaultStyle?.padding, 2);
  const gap = resolveValue(item.gap, defaultStyle?.gap, 1);

  // ===== VARIANT-SPECIFIC PROPERTIES =====
  const variant = resolveValue(
    item.variant,
    defaultStyle?.variant,
    'text'
  ) as 'text' | 'bar' | 'gauge' | 'thermometer' | 'trend';

  const barHeight = resolveValue(item.barHeight, defaultStyle?.barHeight, 12);
  const barColor = resolveValue(item.barColor, defaultStyle?.barColor, 'primary');

  const gaugeSize = resolveValue(item.gaugeSize, defaultStyle?.gaugeSize, 120);
  const gaugeThickness = resolveValue(
    item.gaugeThickness,
    defaultStyle?.gaugeThickness,
    8
  );
  const gaugeColor = resolveValue(
    item.gaugeColor,
    defaultStyle?.gaugeColor,
    'primary'
  );

  const thermometerHeight = resolveValue(
    item.thermometerHeight,
    defaultStyle?.thermometerHeight,
    120
  );

  const trendWindow = resolveValue(
    item.trendWindow,
    defaultStyle?.trendWindow,
    10
  );

  // ===== FORMAT VALUE =====
  const formatValue = (value: number): string => {
    if (isNaN(value)) return 'N/A';
    let formatted = value.toFixed(decimals);
    switch (format) {
      case 'currency':
        formatted = `${prefix || '$'}${formatted}${suffix ? ` ${suffix}` : ''}`;
        break;
      case 'percentage':
        formatted = `${formatted}${suffix || '%'}`;
        break;
      case 'custom':
        formatted = `${prefix}${formatted}${suffix}`;
        break;
      case 'standard':
      default:
        if (showUnit) {
          formatted = `${prefix}${formatted}${suffix}`;
        }
    }
    return formatted;
  };

  // ===== GET FONT SIZE BY VARIANT =====
  const getValueFontSize = (): number => {
    switch (valueSize) {
      case 'small':
        return fontSize * 0.7;
      case 'large':
        return fontSize * 1.3;
      case 'medium':
      default:
        return fontSize;
    }
  };

  // ===== DATA SUBSCRIPTION =====
  useEffect(() => {
    const dataName = item.content;
    if (!dataName) {
      setDisplayValues((prev) => ({
        ...prev,
        [item.id]: item.value ?? 0,
      }));
      return;
    }

    if (!dataRegistry.get(dataName)) {
      dataRegistry.register(dataName, 0);
    }

    const initialValue = dataRegistry.get(dataName);
    setDisplayValues((prev) => ({
      ...prev,
      [item.id]: initialValue,
    }));

    const handleDataChange = (newValue: any) => {
      console.log(`[NumericDisplayComponent] Data "${dataName}" changed:`, newValue);
      setDisplayValues((prev) => ({
        ...prev,
        [item.id]: newValue,
      }));

      // Update trend history for trend variant
      if (variant === 'trend') {
        setTrendHistory((prev) => {
          const updated = [...prev, newValue];
          return updated.slice(-trendWindow);
        });
      }
    };

    dataRegistry.onChange(dataName, callbackId, handleDataChange);

    return () => {
      dataRegistry.offChange(dataName, callbackId);
      console.log(`[NumericDisplayComponent] Unsubscribed from "${dataName}"`);
    };
  }, [item.content, item.id, item.value, variant, trendWindow]);

  const onItemClickHandler = () => {
    console.info('[NumericDisplayComponent] Value clicked:', item.id);
    if (onItemClick) onItemClick(item.id, item);
  };

  // ===== CALCULATE PROGRESS PERCENTAGE =====
  const getProgressPercent = (): number => {
    if (maxValue === minValue) return 0;
    return ((displayValue - minValue) / (maxValue - minValue)) * 100;
  };

  // ===== STYLE GETTERS =====
  const getContainerSx = (): SxProps<Theme> => ({
    display: 'flex',
    flexDirection: 'column',
    gap,
    padding,
    backgroundColor,
    border: showBorder ? `1px solid` : 'none',
    borderColor: showBorder ? borderColor : 'transparent',
    borderRadius: 1,
    cursor: 'pointer',
    transition: animateChanges ? 'all 0.3s ease-in-out' : 'none',
    alignItems: alignment === 'center' ? 'center' : alignment === 'left' ? 'flex-start' : 'flex-end',
  });

  const getLabelSx = (): SxProps<Theme> => ({
    fontSize: labelFontSize,
    color: labelColor,
    fontWeight: 'normal',
    margin: 0,
  });

  const getValueSx = (): SxProps<Theme> => ({
    fontSize: getValueFontSize(),
    fontWeight,
    color: valueColor,
    margin: 0,
    transition: animateChanges
      ? 'transform 0.3s ease-in-out, color 0.3s ease-in-out'
      : 'none',
  });

  // ===== RENDER VARIANTS =====

  /**
   * RENDER BAR: Horizontal progress bar with value and percentage
   */
  const renderBar = () => (
    <Box sx={{ width: '100%' }}>
      {label && <Typography sx={getLabelSx()}>{label}</Typography>}
      <Box sx={{ width: '100%', mt: 1 }}>
        <LinearProgress
          variant="determinate"
          value={Math.min(100, Math.max(0, getProgressPercent()))}
          sx={{
            height: barHeight,
            borderRadius: 1,
            backgroundColor: 'action.disabledBackground',
            '& .MuiLinearProgress-bar': {
              backgroundColor: barColor,
              transition: animateChanges ? 'width 0.5s ease-in-out' : 'none',
            },
          }}
        />
      </Box>
      <Typography sx={{ ...getValueSx(), mt: 1 }}>
        {formatValue(displayValue)}
      </Typography>
    </Box>
  );

  /**
   * RENDER GAUGE: Circular gauge with needle
   */
  const renderGauge = () => {
    const percent = getProgressPercent();

    // Hardcoded colors (no useTheme)
    const colorMap: { [key: string]: string } = {
      primary: '#1976d2',
      secondary: '#dc004e',
      success: '#2e7d32',
      error: '#d32f2f',
      warning: '#f57c00',
      info: '#0288d1',
    };

    const resolvedGaugeColor = typeof gaugeColor === 'string'
      ? colorMap[gaugeColor] || gaugeColor
      : gaugeColor;

    const resolvedBgColor = '#ccc';

    // Calculate arc dimensions
    const radius = gaugeSize * 0.35;
    const circumference = Math.PI * radius; // Half circle
    const strokeOffset = circumference * (1 - percent / 100);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {label && <Typography sx={getLabelSx()}>{label}</Typography>}
        <Box sx={{ position: 'relative', width: gaugeSize, height: gaugeSize / 2 + 20, mt: 2 }}>
          <svg
            width={gaugeSize}
            height={gaugeSize / 2 + 20}
            style={{ position: 'absolute', top: 0, left: 0 }}
            viewBox={`0 0 ${gaugeSize} ${gaugeSize / 2 + 20}`}
          >
            {/* Background arc */}
            <path
              d={`M ${gaugeSize * 0.1} ${gaugeSize / 2} A ${radius} ${radius} 0 0 1 ${gaugeSize * 0.9} ${gaugeSize / 2}`}
              stroke={resolvedBgColor}
              strokeWidth={gaugeThickness}
              fill="none"
            />
            
            {/* Progress arc */}
            <path
              d={`M ${gaugeSize * 0.1} ${gaugeSize / 2} A ${radius} ${radius} 0 0 1 ${gaugeSize * 0.9} ${gaugeSize / 2}`}
              stroke={resolvedGaugeColor}
              strokeWidth={gaugeThickness}
              fill="none"
              strokeDasharray={`${circumference - strokeOffset} ${circumference}`}
              style={{
                transition: animateChanges ? 'stroke-dasharray 0.5s ease-in-out' : 'none',
              }}
            />

            {/* Center dot */}
            <circle
              cx={gaugeSize / 2}
              cy={gaugeSize / 2}
              r={6}
              fill={valueColor}
            />
          </svg>
        </Box>
        <Typography sx={{ ...getValueSx(), mt: 2 }}>
          {formatValue(displayValue)}
        </Typography>
      </Box>
    );
  };

  /**
   * RENDER THERMOMETER: Vertical fill with bulb
   */
  const renderThermometer = () => {
    const fillPercent = getProgressPercent();

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {label && <Typography sx={getLabelSx()}>{label}</Typography>}

        <Box sx={{ position: 'relative', mt: 2 }}>
          {/* Thermometer tube */}
          <Box
            sx={{
              width: 30,
              height: thermometerHeight,
              border: `2px solid ${valueColor}`,
              borderRadius: '0 0 15px 15px',
              position: 'relative',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
            }}
          >
            {/* Fill */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: `${fillPercent}%`,
                backgroundColor: `${gaugeColor}.main`,  // Add .main suffix
                transition: animateChanges ? 'height 0.5s ease-in-out' : 'none',
              }}
            />
          </Box>

          {/* Bulb */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -18,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 40,
              height: 36,
              backgroundColor: `${gaugeColor}.main`,  // Add .main suffix
              borderRadius: '50%',
            }}
          />
        </Box>

        <Typography sx={{ ...getValueSx(), mt: 4 }}>
          {formatValue(displayValue)}
        </Typography>
      </Box>
    );
  };


  /**
   * RENDER TREND: Value with trend indicator (up/down/flat)
   */
  const renderTrend = () => {
    let trendDirection: 'up' | 'down' | 'flat' = 'flat';
    if (trendHistory.length >= 2) {
      const currentValue = trendHistory[trendHistory.length - 1];
      const previousValue = trendHistory[trendHistory.length - 2];
      if (currentValue > previousValue) trendDirection = 'up';
      else if (currentValue < previousValue) trendDirection = 'down';
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {label && <Typography sx={getLabelSx()}>{label}</Typography>}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Typography sx={getValueSx()}>{formatValue(displayValue)}</Typography>
          {trendDirection === 'up' && (
            <TrendingUpIcon sx={{ color: 'success.main', fontSize: 'large' }} />
          )}
          {trendDirection === 'down' && (
            <TrendingDownIcon sx={{ color: 'error.main', fontSize: 'large' }} />
          )}
          {trendDirection === 'flat' && (
            <Box
              sx={{
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                fontSize: 'small',
              }}
            >
              —
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  /**
   * RENDER TEXT: Standard text display (default)
   */
  const renderText = () => (
    <>
      {label && <Typography sx={getLabelSx()}>{label}</Typography>}
      <Typography sx={getValueSx()}>{formatValue(displayValue)}</Typography>
    </>
  );

  // ===== MAIN RENDER =====
  return (
    <Box sx={getContainerSx()} onClick={onItemClickHandler}>
      {(() => {
        switch (variant) {
          case 'bar':
            return renderBar();
          case 'gauge':
            return renderGauge();
          case 'thermometer':
            return renderThermometer();
          case 'trend':
            return renderTrend();
          case 'text':
          default:
            return renderText();
        }
      })()}
    </Box>
  );
};


export default NumericDisplayComponent;