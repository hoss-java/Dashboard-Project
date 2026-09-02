// src/components/renderers/components/HistoryDiagram/HistoryDiagramComponent.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { dataRegistry } from '../../../services/DataRegistry';
import { resolveValue } from '../../utils/resolveValue';
import type { ItemRendererProps } from '../../types';
import type { HistoryDiagramItemStyle } from '../../types';

/**
 * HistoryDiagramComponent - renders a line chart from historical data
 * Follows standard pattern: accepts item from JSON config, resolves values via defaultStyle
 */
export const HistoryDiagramComponent: React.FC<ItemRendererProps> = ({
  item,
  defaultStyle,
  onItemClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartDataCache, setChartDataCache] = useState<
    Record<string, Array<{ timestamp: number; value: number }>>
  >({});
  const [isDataReady, setIsDataReady] = useState(false);

  // Resolve all configuration from item + defaultStyle
  const dataName = resolveValue(item.content, defaultStyle?.content, '');
  const label = resolveValue(item.label, defaultStyle?.label, 'History Chart');
  const width = resolveValue(item.width, defaultStyle?.width, 600);
  const height = resolveValue(item.height, defaultStyle?.height, 400);
  const minValue = resolveValue(item.minValue, defaultStyle?.minValue, undefined);
  const maxValue = resolveValue(item.maxValue, defaultStyle?.maxValue, undefined);
  const lineColor = resolveValue(item.lineColor, defaultStyle?.lineColor, '#2196F3');
  const padding = resolveValue(
    (item as any).padding,
    defaultStyle?.padding,
    2
  );
  const showBorder = resolveValue(
    (item as any).showBorder,
    (defaultStyle as any)?.showBorder,
    true
  );
  const borderColor = resolveValue(
    (item as any).borderColor,
    (defaultStyle as any)?.borderColor,
    '#e0e0e0'
  );
  const backgroundColor = resolveValue(
    (item as any).backgroundColor,
    (defaultStyle as any)?.backgroundColor,
    '#fafafa'
  );

  // Current data for this instance, keyed by item.id
  const currentData = chartDataCache[item.id] || [];

  // Subscribe to data changes and fetch history
  useEffect(() => {
    if (!dataName) {
      console.warn('[HistoryDiagramComponent] No data name provided in item.content');
      setIsDataReady(true);
      return;
    }

    // Ensure data is registered
    if (!dataRegistry.get(dataName)) {
      console.warn(`[HistoryDiagramComponent] Data "${dataName}" not registered`);
      setIsDataReady(true);
      return;
    }

    // Get initial history
    const history = dataRegistry.getHistory(dataName);
    const transformed = history.map((entry) => ({
      timestamp: entry.timestamp,
      value: entry.newValue,
    }));
    setChartDataCache((prev) => ({
      ...prev,
      [item.id]: transformed,
    }));
    setIsDataReady(true);

    // Subscribe to changes and update history
    const callbackId = `history-diagram-${item.id}`;
    const handleChange = () => {
      const updatedHistory = dataRegistry.getHistory(dataName);
      const transformed = updatedHistory.map((entry) => ({
        timestamp: entry.timestamp,
        value: entry.newValue,
      }));
      setChartDataCache((prev) => ({
        ...prev,
        [item.id]: transformed,
      }));
    };

    dataRegistry.onChange(dataName, callbackId, handleChange);

    return () => {
      dataRegistry.offChange(dataName, callbackId);
    };
  }, [dataName, item.id]);

  /**
   * Style getter for the container Box
   */
  const getContainerSx = (): SxProps<Theme> => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: `${padding}rem`,
    backgroundColor: backgroundColor,
    borderRadius: 1,
    border: showBorder ? `1px solid ${borderColor}` : 'none',
    cursor: 'pointer',
  });

  /**
   * Style getter for the canvas element
   */
  const getCanvasSx = (): React.CSSProperties => ({
    border: '1px solid #ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
    display: 'block',
  });

  /**
   * Draws the complete chart on the canvas
   */
  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions at the start
    canvas.width = width;
    canvas.height = height;

    // Handle edge cases: no data
    if (!currentData || currentData.length === 0) {
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#999';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No data available', width / 2, height / 2);
      return;
    }

    // ===== 1. SETUP: Calculate padding and drawable area =====
    const canvasPadding = { top: 40, right: 20, bottom: 40, left: 50 };
    const drawableWidth = width - canvasPadding.left - canvasPadding.right;
    const drawableHeight = height - canvasPadding.top - canvasPadding.bottom;

    // ===== 2. Clear canvas with white background =====
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // ===== 3. Calculate data ranges =====
    const timestamps = currentData.map((point) => {
      if (!point || typeof point.timestamp === 'undefined') {
        console.warn('[HistoryDiagramComponent] Invalid point structure:', point);
        return Date.now();
      }
      return point.timestamp;
    });

    const values = currentData.map((point) => {
      if (!point || typeof point.value === 'undefined') {
        console.warn('[HistoryDiagramComponent] Invalid point value:', point);
        return 0;
      }
      return point.value;
    });

    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const timeRange = maxTime - minTime || 1;

    const dataMinValue = minValue ?? Math.min(...values);
    const dataMaxValue = maxValue ?? Math.max(...values);
    const valueRange = dataMaxValue - dataMinValue || 1;

    // ===== 4. Draw grid lines (5 horizontal lines) =====
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = canvasPadding.top + (drawableHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(canvasPadding.left, y);
      ctx.lineTo(width - canvasPadding.right, y);
      ctx.stroke();

      // Draw Y-axis labels
      const value = dataMaxValue - (valueRange / gridLines) * i;
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(value.toFixed(2), canvasPadding.left - 10, y);
    }

    // ===== 5. Draw X and Y axes =====
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(canvasPadding.left, canvasPadding.top);
    ctx.lineTo(canvasPadding.left, height - canvasPadding.bottom);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(canvasPadding.left, height - canvasPadding.bottom);
    ctx.lineTo(width - canvasPadding.right, height - canvasPadding.bottom);
    ctx.stroke();

    // Draw X-axis labels (timestamps)
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const xLabelCount = Math.min(5, currentData.length);
    for (let i = 0; i < xLabelCount; i++) {
      const index = Math.floor((currentData.length - 1) * (i / (xLabelCount - 1)));
      const point = currentData[index];
      if (point) {
        const x =
          canvasPadding.left +
          (drawableWidth * (point.timestamp - minTime)) / timeRange;
        ctx.fillText(`${Math.round(point.timestamp)}`, x, height - canvasPadding.bottom + 10);
      }
    }

    // ===== 6. Draw data line =====
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    let isFirstPoint = true;

    for (const point of currentData) {
      if (!point) continue;

      const x =
        canvasPadding.left +
        (drawableWidth * (point.timestamp - minTime)) / timeRange;
      const y =
        height -
        canvasPadding.bottom -
        (drawableHeight * (point.value - dataMinValue)) / valueRange;

      if (isFirstPoint) {
        ctx.moveTo(x, y);
        isFirstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // ===== 7. Draw data points as dots =====
    ctx.fillStyle = lineColor;
    const dotRadius = 4;

    for (const point of currentData) {
      if (!point) continue;

      const x =
        canvasPadding.left +
        (drawableWidth * (point.timestamp - minTime)) / timeRange;
      const y =
        height -
        canvasPadding.bottom -
        (drawableHeight * (point.value - dataMinValue)) / valueRange;

      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
      ctx.fill();
    }

    // ===== 8. Draw title/label =====
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(label, width / 2, 10);
  };

  /**
   * Redraw chart when data or configuration changes
   */
  useEffect(() => {
    if (isDataReady) {
      drawChart();
    }
  }, [currentData, width, height, minValue, maxValue, lineColor, label, isDataReady]);

  const onItemClickHandler = () => {
    console.info('[HistoryDiagramComponent] Chart clicked:', item.id);
    if (onItemClick) onItemClick(item.id, item);
  };

  return (
    <Box sx={getContainerSx()} onClick={onItemClickHandler}>
      <canvas ref={canvasRef} style={getCanvasSx()} />
    </Box>
  );
};

export default HistoryDiagramComponent;
