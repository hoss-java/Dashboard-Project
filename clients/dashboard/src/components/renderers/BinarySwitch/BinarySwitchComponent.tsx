// src/components/renderers/components/BinarySwitch/BinarySwitchComponent.tsx
import React from 'react';
import { Box, Switch, Typography, SxProps, Theme } from '@mui/material';
import { resolveValue } from '../../utils/resolveValue';
import type { ItemRendererProps } from '../../types';

export const BinarySwitchComponent: React.FC<ItemRendererProps> = ({
                                                                     item,
                                                                     defaultStyle,
                                                                     onItemClick,
                                                                   }) => {
  const [switchStates, setSwitchStates] = React.useState<Record<string, boolean>>({
    [item.id]: Boolean(item.isOn),
  });

  const isOn = switchStates[item.id] ?? Boolean(item.isOn);

  // Resolve values
  const label = resolveValue(item.label, defaultStyle?.label, '');
  const onLabel = resolveValue(item.onLabel, defaultStyle?.onLabel, 'On');
  const offLabel = resolveValue(item.offLabel, defaultStyle?.offLabel, 'Off');
  const size = resolveValue(item.size, defaultStyle?.size, 'medium') as 'small' | 'medium';

  // Tactical colors
  const onStatusColor = resolveValue(item.onStatusColor, defaultStyle?.onStatusColor, '#00ff9d');   // neon green
  const offStatusColor = resolveValue(item.offStatusColor, defaultStyle?.offStatusColor, '#00bcd4'); // cyan
  const borderColor = resolveValue(item.borderColor, defaultStyle?.borderColor, '#1f2a33');

  const gap = resolveValue(item.gap, defaultStyle?.gap, 2);
  const padding = resolveValue(item.padding, defaultStyle?.padding, 1.5);
  const showBorder = resolveValue(item.showBorder, defaultStyle?.showBorder, true);

  const getStatusTextColor = (): string => (isOn ? onStatusColor : offStatusColor);

  const onToggleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.checked;

    setSwitchStates((prev) => ({
      ...prev,
      [item.id]: nextValue,
    }));

    if (onItemClick) {
      onItemClick(item.id, {
        ...item,
        isOn: nextValue,
      });
    }
  };

  // 🎖️ Tactical container styling
  const getContainerSx = (): SxProps<Theme> => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap,
    px: 2,
    py: padding,
    backgroundColor: '#11181f',
    borderRadius: 2,
    border: showBorder ? `1px solid ${isOn ? onStatusColor : borderColor}` : 'none',
    boxShadow: isOn ? '0 0 12px rgba(0,255,157,0.25)' : '0 0 6px rgba(0,188,212,0.15)',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    width: 'fit-content',
    maxWidth: '168px'
  });

  const getLabelSx = (): SxProps<Theme> => ({
    minWidth: 0,
  });

  const getTitleSx = (): SxProps<Theme> => ({
    fontWeight: 600,
    color: '#00ff9d',
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: 1,
    textTransform: 'uppercase',
  });

  const getStatusTextSx = (): SxProps<Theme> => ({
    color: getStatusTextColor(),
    fontWeight: 600,
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: 1,
    transition: 'color 0.2s ease',
    ...(isOn && {
      animation: 'pulse 1.8s infinite',
    }),
  });

  return (
      <Box sx={getContainerSx()}>
        <Box sx={getLabelSx()}>
          <Typography variant="subtitle2" sx={getTitleSx()}>
            {label}
          </Typography>
          <Typography variant="body2" sx={getStatusTextSx()}>
            {isOn ? onLabel : offLabel}
          </Typography>
        </Box>

        <Switch
            checked={isOn}
            onChange={onToggleHandler}
            size={size}
            sx={{
              '& .MuiSwitch-thumb': {
                backgroundColor: isOn ? onStatusColor : offStatusColor,
              },
              '& .MuiSwitch-track': {
                backgroundColor: '#1f2a33',
              },
            }}
        />
      </Box>
  );
};

export default BinarySwitchComponent;
