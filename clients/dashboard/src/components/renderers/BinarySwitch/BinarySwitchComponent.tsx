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

  // Detect engine state
  const isEngine = label.toLowerCase().includes("engine");

  // Dynamic colors
  const engineOnColor = "#00ff9d";   // green
  const engineOffColor = "#ff0033";  // red

  const onStatusColor = isEngine ? engineOnColor : "#00ff9d";
  const offStatusColor = isEngine ? engineOffColor : "#00bcd4";

  const borderColor = resolveValue(item.borderColor, defaultStyle?.borderColor, '#11181f');

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

  // Tactical container styling
  const getContainerSx = (): SxProps<Theme> => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap,
    px: 2,
    py: padding,
    backgroundColor: '#2a3440',
    borderRadius: 2,
    border: showBorder ? `1px solid ${isOn ? onStatusColor : borderColor}` : 'none',
    boxShadow: 'none', // removed glow
    transition: 'border-color 0.2s ease',
    cursor: 'pointer',
    width: 'fit-content',
    maxWidth: '168px'
  });

  const getLabelSx = (): SxProps<Theme> => ({
    minWidth: 0,
  });

  const getTitleSx = (): SxProps<Theme> => ({
    fontWeight: 600,
    color: '#ffffff',
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
                backgroundColor: '#2a3440',
              },
            }}
        />
      </Box>
  );
};

export default BinarySwitchComponent;
