// src/components/renderers/BinarySwitch/BinarySwitchComponent.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Switch, Typography } from '@mui/material';
import { resolveValue } from '../../utils/resolveValue';
import { dataRegistry } from '../../../services/DataRegistry';
import type { ItemRendererProps } from '../../types';

export const BinarySwitchComponent: React.FC<ItemRendererProps> = ({
  item,
  defaultStyle,
  onItemClick,
}) => {
  const [isOn, setIsOn] = useState<boolean>(Boolean(item.isOn));

  const label        = resolveValue(item.label, defaultStyle?.label, '');
  const onLabel      = resolveValue(item.onLabel, defaultStyle?.onLabel, 'On');
  const offLabel     = resolveValue(item.offLabel, defaultStyle?.offLabel, 'Off');
  const size         = resolveValue(item.size, defaultStyle?.size, 'medium') as 'small' | 'medium';
  const showBorder   = resolveValue(item.showBorder, defaultStyle?.showBorder, true);
  const onColor      = resolveValue(item.onStatusColor, defaultStyle?.onStatusColor, 'success.main');
  const offColor     = resolveValue(item.offStatusColor, defaultStyle?.offStatusColor, 'text.secondary');

  // Stable callback ID — never regenerated on re-render
  const callbackId = useMemo(() => `binarySwitch-${item.id}`, [item.id]);

  // Subscribe to live data
  useEffect(() => {
    const dataName = item.content;
    if (!dataName) return;

    if (!dataRegistry.get(dataName)) {
      dataRegistry.register(dataName, false);
    }
    setIsOn(Boolean(dataRegistry.get(dataName)));

    const handleChange = (newValue: any) => setIsOn(Boolean(newValue));
    dataRegistry.onChange(dataName, callbackId, handleChange);
    return () => dataRegistry.offChange(dataName, callbackId);
  }, [item.content, callbackId]);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.checked;
    setIsOn(next);
    if (item.content) dataRegistry.set(item.content, next);
    if (onItemClick) onItemClick(item.id, { ...item, isOn: next });
  };

  // Keyboard: Space/Enter on the container row
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const next = !isOn;
      setIsOn(next);
      if (item.content) dataRegistry.set(item.content, next);
      if (onItemClick) onItemClick(item.id, { ...item, isOn: next });
    }
  };

  const statusColor = isOn ? onColor : offColor;

  return (
    <Box
      role="group"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`${label} switch, currently ${isOn ? onLabel : offLabel}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 2,
        py: 1.5,
        border: showBorder ? '1px solid' : 'none',
        borderColor: isOn ? 'success.main' : 'divider',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'border-color 250ms ease, background-color 250ms ease',
        bgcolor: isOn ? 'rgba(52,211,153,0.05)' : 'transparent',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        {/* Status dot */}
        <Box
          aria-hidden="true"
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: statusColor,
            flexShrink: 0,
            boxShadow: isOn ? `0 0 6px currentColor` : 'none',
            transition: 'background-color 250ms ease',
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {label}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: statusColor, fontWeight: 600, transition: 'color 250ms ease' }}
          >
            {isOn ? onLabel : offLabel}
          </Typography>
        </Box>
      </Box>

      <Switch
        checked={isOn}
        onChange={handleToggle}
        size={size}
        color="success"
        slotProps={{ input: { 'aria-label': label } as any }}
        onClick={(e) => e.stopPropagation()}
      />
    </Box>
  );
};

export default BinarySwitchComponent;
