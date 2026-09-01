import React from 'react';
import { Box, Switch, Typography } from '@mui/material';

import type { Item, ItemRendererProps } from '../../types';

type BinarySwitchItem = Item & {
  isOn: boolean;
  label: string;
  onLabel: string;
  offLabel: string;
  size?: 'small' | 'medium';
};

function BinarySwitch({ item, onItemClick }: ItemRendererProps) {
  const binarySwitchItem = item as BinarySwitchItem;
  const [isOn, setIsOn] = React.useState(Boolean(binarySwitchItem.isOn));

  const getStatusTextColor = () => (isOn ? 'success.main' : 'text.secondary');

  const onToggleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.checked;
    setIsOn(nextValue);
    console.info('[BinarySwitch] new state:', nextValue);

    onItemClick?.(binarySwitchItem.id, {
      ...binarySwitchItem,
      isOn: nextValue,
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 2,
        py: 1.5,
        border: '1px solid',
        borderColor: isOn ? 'success.main' : 'grey.400',
        borderRadius: 1,
        transition: 'border-color 0.2s ease, background-color 0.2s ease',
        color: isOn ? 'success.50' : 'grey.50',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {binarySwitchItem.label}
        </Typography>
        <Typography variant="body2" sx={{ color: getStatusTextColor(), fontWeight: 600 }}>
          {isOn ? binarySwitchItem.onLabel : binarySwitchItem.offLabel}
        </Typography>
      </Box>

      <Switch
        checked={isOn}
        onChange={onToggleHandler}
        size={binarySwitchItem.size ?? 'medium'}
        color="success"
      />
    </Box>
  );
}

export default BinarySwitch;
