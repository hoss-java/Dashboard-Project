import React from 'react';
import { Box, Switch, Typography } from '@mui/material';
import { resolveValue} from '../../utils/resolveValue';
import type {  ItemRendererProps , BinarySwitchItemStyle} from '../../types';


export const BinarySwitch: React.FC<ItemRendererProps> = ({
  item,
  defaultStyle,
  onItemClick,
}) => {
  const binarySwitchItem = item as BinarySwitchItemStyle;
  const [isOn, setIsOn] = React.useState(Boolean(binarySwitchItem.isOn));
// Resolve values using the standard pattern
  const label = resolveValue(binarySwitchItem.label, defaultStyle?.label, '');
  const onLabel = resolveValue(binarySwitchItem.onLabel, defaultStyle?.onLabel, 'On');
  const offLabel = resolveValue(binarySwitchItem.offLabel, defaultStyle?.offLabel, 'Off');
  const size = resolveValue(binarySwitchItem.size, defaultStyle?.size, 'medium') as 'small' | 'medium' | 'large';
  const showBorder = resolveValue(binarySwitchItem.showBorder, defaultStyle?.showBorder, true);
  const borderColor = resolveValue(binarySwitchItem.borderColor, defaultStyle?.borderColor, 'grey.400');
  const onStatusColor = resolveValue(binarySwitchItem.onStatusColor, defaultStyle?.onStatusColor, 'success.main');
  const offStatusColor = resolveValue(binarySwitchItem.offStatusColor, defaultStyle?.offStatusColor, 'text.secondary');
  const gap = resolveValue(binarySwitchItem.gap, defaultStyle?.gap, 2);
  const padding = resolveValue(binarySwitchItem.padding, defaultStyle?.padding, 1.5);
  const getStatusTextColor = () => (isOn ? onStatusColor : offStatusColor);
  const getSwitchSize = (): 'small' | 'medium' => {
    if (binarySwitchItem.size === 'small') {
      return 'small';
    }

    return 'medium';
  };

  const onToggleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.checked;
    setIsOn(nextValue);
    console.info('[BinarySwitch] new state:', nextValue);

    onItemClick?.(binarySwitchItem.id, {
      ...binarySwitchItem,
      isOn: nextValue,
    });
  };
const getContainerSx = () => ({
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

  const getLabelSx = () => ({
    minWidth: 0,
  });

  const getTitleSx = () => ({
    fontWeight: 600,
  });

  const getStatusTextSx = () => ({
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
            size={getSwitchSize()}
            color="success"
          />
    </Box>

  );
};

export default BinarySwitch;

