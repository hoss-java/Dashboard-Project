// src/components/renderers/components/NumericDisplay/NumericDisplayComponent.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
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

  // 🎖 Tactical colors
    const neonGreen = '#ffffff';
    const neonCyan = '#00bcd4';
    const neonYellow = '#f5a623';
    const matte = '#2a3440';
    const border = '#1f2a33';

  const valueColor = neonGreen;
  const labelColor = neonCyan;

  const backgroundColor = matte;
  const fontSize = resolveValue(item.fontSize, defaultStyle?.fontSize, 32);
  const labelFontSize = resolveValue(item.labelFontSize, defaultStyle?.labelFontSize, 14);
  const fontWeight = resolveValue(item.fontWeight, defaultStyle?.fontWeight, 'bold');
  const alignment = resolveValue(item.alignment, defaultStyle?.alignment, 'center');
  const showUnit = resolveValue(item.showUnit, defaultStyle?.showUnit, true);
  const valueSize = resolveValue(item.valueSize, defaultStyle?.valueSize, 'medium');
  const animateChanges = resolveValue(item.animateChanges, defaultStyle?.animateChanges, false);
  const padding = resolveValue(item.padding, defaultStyle?.padding, 2);
  const gap = resolveValue(item.gap, defaultStyle?.gap, 1);

  const variant = resolveValue(item.variant, defaultStyle?.variant, 'text');

  const barHeight = resolveValue(item.barHeight, defaultStyle?.barHeight, 12);

  const gaugeSize = resolveValue(item.gaugeSize, defaultStyle?.gaugeSize, 120);
  const gaugeThickness = resolveValue(item.gaugeThickness, defaultStyle?.gaugeThickness, 8);

  const thermometerHeight = resolveValue(item.thermometerHeight, defaultStyle?.thermometerHeight, 120);

  const trendWindow = resolveValue(item.trendWindow, defaultStyle?.trendWindow, 10);

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
      default:
        if (showUnit) formatted = `${prefix}${formatted}${suffix}`;
    }
    return formatted;
  };

  const getValueFontSize = (): number => {
    switch (valueSize) {
      case 'small':
        return fontSize * 0.7;
      case 'large':
        return fontSize * 1.3;
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
      setDisplayValues((prev) => ({
        ...prev,
        [item.id]: newValue,
      }));

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
    };
  }, [item.content, item.id, item.value, variant, trendWindow]);

  const onItemClickHandler = () => {
    if (onItemClick) onItemClick(item.id, item);
  };

  const getProgressPercent = (): number => {
    if (maxValue === minValue) return 0;
    return ((displayValue - minValue) / (maxValue - minValue)) * 100;
  };

  // ===== TACTICAL STYLES =====
  const getContainerSx = () => ({
    display: 'flex',
    flexDirection: 'column',
    gap,
    padding,
    backgroundColor: matte,
    border: showBorder ? `1px solid ${border}` : 'none',
    borderRadius: 2,
    boxShadow: '0 0 20px rgba(0,255,157,0.05)',
    cursor: 'pointer',
    alignItems:
        alignment === 'center'
            ? 'center'
            : alignment === 'left'
                ? 'flex-start'
                : 'flex-end',
  });

  const getLabelSx = () => ({
    fontSize: labelFontSize,
    color: labelColor,
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: 1,
    textTransform: 'uppercase',
  });

  const getValueSx = () => ({
    fontSize: getValueFontSize(),
    fontWeight,
    color: neonGreen,
    fontFamily: "'Share Tech Mono', monospace",
    textShadow: '0 0 8px rgba(0,255,157,0.6)',
    transition: animateChanges ? 'transform 0.3s ease, color 0.3s ease' : 'none',
  });

  // ===== RENDER VARIANTS =====

  /**
   * TACTICAL TEXT
   */
  const renderText = () => (
      <>
        {label && (
            <Typography
                sx={{
                  ...getLabelSx(),
                  color: neonCyan,
                }}
            >
              {label}
            </Typography>
        )}

        <Typography sx={getValueSx()}>
          {formatValue(displayValue)}
        </Typography>
      </>
  );

  /**
   * TACTICAL BAR
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
                borderRadius: 2,
                backgroundColor: '#1f2a33',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: neonCyan,
                  boxShadow: '0 0 10px rgba(0,188,212,0.6)',
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
     * TACTICAL GAUGE (Dynamic Color)
     */
    const getGaugeColor = (percent: number) => {
        if (percent >= 50) return "#00ff9d";   // green
        if (percent >= 30) return "#f5a623";    // yellow
        if (percent >= 10) return "#ff0033";    // red
        return "#ff0033";                       // below 10% stays red
    };

    const renderGauge = () => {
        const percent = getProgressPercent();
        const gaugeColor = getGaugeColor(percent);

        return (
            <Box
                sx={{
                    position: "relative",
                    width: gaugeSize,
                    height: gaugeSize,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress
                    variant="determinate"
                    value={percent}
                    size={gaugeSize}
                    thickness={gaugeThickness}
                    sx={{
                        color: gaugeColor,
                        filter: "none",
                        textShadow: "none",
                    }}
                />

                <Typography
                    sx={{
                        position: "absolute",
                        color: gaugeColor,
                        fontFamily: "'Share Tech Mono', monospace",
                        textShadow: "none",
                    }}
                >
                    {formatValue(displayValue)}
                </Typography>
            </Box>
        );
    };

    /**
     * TACTICAL THERMOMETER (WHITE TEXT VERSION)
     */
    const renderThermometer = () => {
        const fillPercent = getProgressPercent();

        // Detect temperature
        const isTemperature = label.toLowerCase().includes("temp");

        // Tactical neon palette
        const neonGreen = "#ffffff";
        const neonCyan = "#00bcd4";
        const neonYellow = "#f5a623"; // temperature color
        const whiteText = "#ffffff";

        // Dynamic colors
        const tubeColor = isTemperature ? neonYellow : neonGreen;
        const fillColor = isTemperature ? neonYellow : neonGreen;
        const bulbColor = isTemperature ? neonYellow : neonGreen;

        const tubeGlow = isTemperature
            ? "none"
            : "none";

        const fillGlow = isTemperature
            ? "none"
            : "none";

        const bulbGlow = isTemperature
            ? "0 0 18px rgba(245,166,35,0.8)"
            : "0 0 18px rgba(0,255,157,0.8)";

        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                {/* Label */}
                {label && (
                    <Typography
                        sx={{
                            ...getLabelSx(),
                            color: isTemperature ? neonYellow : neonCyan,
                        }}
                    >
                        {label}
                    </Typography>
                )}

                {/* Thermometer */}
                <Box sx={{ position: "relative", mt: 2 }}>

                    {/* Tube */}
                    <Box
                        sx={{
                            width: 32,
                            height: thermometerHeight,
                            border: `2px solid ${tubeColor}`,
                            borderRadius: "0 0 18px 18px",
                            backgroundColor: "#0a0f14",
                            overflow: "hidden",
                            boxShadow: tubeGlow,
                        }}
                    >
                        {/* Fill */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: `${fillPercent}%`,
                                backgroundColor: fillColor,
                                boxShadow: fillGlow,
                                transition: animateChanges ? "height 0.5s ease-in-out" : "none",
                            }}
                        />
                    </Box>

                    {/* Bulb */}
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: -20,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 44,
                            height: 44,
                            backgroundColor: bulbColor,
                            borderRadius: "50%",
                            boxShadow: bulbGlow,
                        }}
                    />
                </Box>

                {/* Value (WHITE TEXT) */}
                <Typography
                    sx={{
                        ...getValueSx(),
                        color: whiteText,
                        textShadow: "none",
                        mt: 4,
                    }}
                >
                    {formatValue(displayValue)}
                </Typography>
            </Box>
        );
    };



    /**
   * TACTICAL TREND
   */
  const renderTrend = () => {
    let trendDirection: 'up' | 'down' | 'flat' = 'flat';

    if (trendHistory.length >= 2) {
      const currentValue = trendHistory[trendHistory.length - 1];
      const previousValue = trendHistory[trendHistory.length - 2];
      if (currentValue > previousValue) trendDirection = 'up';
      else if (currentValue < previousValue) trendDirection = 'down';
    }

    const iconStyle = {
      fontSize: 36,
      textShadow: '0 0 10px rgba(0,255,157,0.6)',
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {label && (
              <Typography
                  sx={{
                    ...getLabelSx(),
                    color: neonCyan,
                  }}
              >
                {label}
              </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography sx={getValueSx()}>
              {formatValue(displayValue)}
            </Typography>

            {trendDirection === 'up' && (
                <TrendingUpIcon sx={{ ...iconStyle, color: neonGreen }} />
            )}
            {trendDirection === 'down' && (
                <TrendingDownIcon sx={{ ...iconStyle, color: neonCyan }} />
            )}
            {trendDirection === 'flat' && (
                <Box
                    sx={{
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontSize: 20,
                      fontFamily: "'Share Tech Mono', monospace",
                    }}
                >
                  —
                </Box>
            )}
          </Box>
        </Box>
    );
  };

  // ===== MAIN RENDER =====
  return (
      <Box sx={getContainerSx()} onClick={onItemClickHandler}>
        {variant === 'text' && renderText()}
        {variant === 'bar' && renderBar()}
        {variant === 'gauge' && renderGauge()}
        {variant === 'thermometer' && renderThermometer()}
        {variant === 'trend' && renderTrend()}
      </Box>
  );
};

export default NumericDisplayComponent;
