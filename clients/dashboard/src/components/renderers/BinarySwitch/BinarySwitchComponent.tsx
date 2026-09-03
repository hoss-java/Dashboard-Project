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
  // ID-keyed state for multiple instances
  const [switchStates, setSwitchStates] = React.useState<Record<string, boolean>>({
    [item.id]: Boolean(item.isOn),
  });

  const isOn = switchStates[item.id] ?? Boolean(item.isOn);

  // Resolve values using the standard pattern
  const label = resolveValue(item.label, defaultStyle?.label, '');
  const onLabel = resolveValue(item.onLabel, defaultStyle?.onLabel, 'On');
  const offLabel = resolveValue(item.offLabel, defaultStyle?.offLabel, 'Off');
  const size = resolveValue(item.size, defaultStyle?.size, 'medium') as 'small' | 'medium';
  const showBorder = resolveValue(item.showBorder, defaultStyle?.showBorder, true);
  const borderColor = resolveValue(item.borderColor, defaultStyle?.borderColor, 'grey.400');
  const onStatusColor = resolveValue(item.onStatusColor, defaultStyle?.onStatusColor, 'success.main');
  const offStatusColor = resolveValue(item.offStatusColor, defaultStyle?.offStatusColor, 'text.secondary');
  const gap = resolveValue(item.gap, defaultStyle?.gap, 2);
  const padding = resolveValue(item.padding, defaultStyle?.padding, 1.5);

  const getStatusTextColor = (): string => (isOn ? onStatusColor : offStatusColor);

  const onToggleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.checked;
    
    // Update state for this specific instance
    setSwitchStates((prev) => ({
      ...prev,
      [item.id]: nextValue,
    }));

    console.info('[BinarySwitchComponent] new state for id:', item.id, nextValue);

    if (onItemClick) {
      onItemClick(item.id, {
        ...item,
        isOn: nextValue,
      });
    }
  };

  const getContainerSx = (): SxProps<Theme> => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap,
    px: 2,
    py: padding,
    ...(showBorder && {
      border: '1px solid',
      borderColor: isOn ? onStatusColor : borderColor,
    }),
    borderRadius: 1,
    transition: 'border-color 0.2s ease, background-color 0.2s ease',
    cursor: 'pointer',
  });

  const getLabelSx = (): SxProps<Theme> => ({
    minWidth: 0,
  });

  const getTitleSx = (): SxProps<Theme> => ({
    fontWeight: 600,
  });

  const getStatusTextSx = (): SxProps<Theme> => ({
    color: getStatusTextColor(),
    fontWeight: 600,
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
        color="success"
      />
    </Box>
  );
};

export default BinarySwitchComponent;
