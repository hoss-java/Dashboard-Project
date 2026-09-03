// src/components/renderers/components/Text/TextComponent.tsx
import React, { useEffect, useState } from 'react';
import { Typography, SxProps, Theme } from '@mui/material';
import { resolveValue } from '../../utils/resolveValue';
import { dataRegistry } from '../../../services/DataRegistry';
import type { ItemRendererProps } from '../../types';

/**
 * TextComponent - Demonstrates DataRegistry integration with multi-instance support
 *
 * IMPLEMENTATION PATTERN:
 * 1. Generate a unique callback ID for this component instance
 * 2. Register the component as a listener for data changes
 * 3. Update component state when data changes (via onChange callback)
 * 4. Cleanup subscriptions on unmount (via offChange)
 * 5. Use ID-keyed state to support multiple independent instances
 *
 * USAGE:
 * - Set item.content to a registered data name (e.g., "temperature")
 * - The component will automatically display and update when that data changes
 * - History is available via dataRegistry.getHistory(dataName) if needed
 * - Multiple instances can listen to the same or different data independently
 */
export const TextComponent: React.FC<ItemRendererProps> = ({
  item,
  defaultStyle,
  onItemClick,
}) => {
  // Generate unique callback ID for this component instance
  // This allows multiple components to listen to the same data without conflicts
  const callbackId = `text-${item.id}-${Math.random().toString(36).slice(2, 9)}`;

  // ID-keyed state for multiple instances
  const [displayValues, setDisplayValues] = useState<Record<string, any>>({
    [item.id]: '',
  });

  const displayValue = displayValues[item.id] ?? '';

  const fontSize = resolveValue(item.fontSize, defaultStyle?.fontSize, 16);
  const fontWeight = resolveValue(
    item.fontWeight,
    defaultStyle?.fontWeight,
    'normal'
  ) as 'normal' | 'bold' | 'lighter';

  // Try to get content from:
  // 1. Registered data (if item.content matches a registered data name)
  // 2. Item config (static content)
  // 3. Default style
  // 4. Empty string fallback
  const content = displayValue || resolveValue(item.content, defaultStyle?.content, '');

  useEffect(() => {
    // Check if item.content refers to a registered data name
    const dataName = item.content;

    if (!dataName) {
      console.warn('[TextComponent] No content or data name provided for id:', item.id);
      return;
    }

    // Register the data if it hasn't been registered yet
    // This is safe to call even if already registered
    if (!dataRegistry.get(dataName)) {
      dataRegistry.register(dataName, '');
    }

    // Set initial value from registry
    const initialValue = dataRegistry.get(dataName);
    setDisplayValues((prev) => ({
      ...prev,
      [item.id]: initialValue,
    }));

    /**
     * CALLBACK EXPLANATION:
     * When registered data changes, this callback is invoked with:
     * - newValue: The new value of the data
     * - oldValue: The previous value (useful for comparisons)
     *
     * HISTORY USAGE EXAMPLE:
     * You can access the change history if needed:
     * const history = dataRegistry.getHistory(dataName);
     * - history[0] is the oldest change
     * - history[history.length - 1] is the most recent change
     * - Each entry has: { timestamp, oldValue, newValue }
     *
     * Use case: Track trends, display "previous value", or audit changes
     */
    const handleDataChange = (newValue: any, oldValue: any) => {
      console.log(`[TextComponent] Data "${dataName}" changed for id:`, item.id, { oldValue, newValue });

      // Update component display with new value for this specific instance
      setDisplayValues((prev) => ({
        ...prev,
        [item.id]: newValue,
      }));

      // Example: Access history if you need to show trends
      // const history = dataRegistry.getHistory(dataName);
      // console.log('Change history:', history);
    };

    // Subscribe to data changes
    // This registers our callback with a unique ID so we can unsubscribe later
    dataRegistry.onChange(dataName, callbackId, handleDataChange);

    // Cleanup: Unsubscribe when component unmounts or dependencies change
    // This prevents memory leaks and ensures this component doesn't receive
    // notifications after it's been removed from the DOM
    return () => {
      dataRegistry.offChange(dataName, callbackId);
      console.log(`[TextComponent] Unsubscribed from "${dataName}" for id:`, item.id);
    };

    // Re-run effect if item.content or item.id changes (data name or instance changes)
  }, [item.content, item.id]);

  const onItemClickHandler = () => {
    console.info('[TextComponent] Text clicked:', item.id);
    if (onItemClick) onItemClick(item.id, item);
  };

  const getTextSx = (): SxProps<Theme> => ({
    fontSize,
    fontWeight,
    cursor: 'pointer',
    mb: 2,
  });

  return (
    <Typography sx={getTextSx()} onClick={onItemClickHandler}>
      {content}
    </Typography>
  );
};

export default TextComponent;
