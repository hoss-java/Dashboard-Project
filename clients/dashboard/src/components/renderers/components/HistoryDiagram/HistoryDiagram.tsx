// src/components/renderers/components/HistoryDiagram/HistoryDiagram.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { dataRegistry } from '../../../../services/DataRegistry';
import { resolveValue } from '../../../utils/resolveValue';
import type { ItemRendererProps } from '../../../types';

/**
 * HistoryDiagram - renders a line chart from historical data
 * Follows standard pattern: accepts item from JSON config, resolves values
 */
export const HistoryDiagram: React.FC<ItemRendererProps> = ({
  item,
  defaultStyle,
  onItemClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [historyData, setHistoryData] = useState<Array<{ timestamp: number; value: number }>>([]);

  // Resolve configuration from item + defaultStyle
  const dataName = resolveValue(item.content, defaultStyle?.content, '');
  const label = resolveValue(item.label, defaultStyle?.label, 'History Chart');
  const width = resolveValue(item.width, defaultStyle?.width, 600);
  const height = resolveValue(item.height, defaultStyle?.height, 400);
  const minValue = resolveValue(item.minValue, defaultStyle?.minValue, undefined);
  const maxValue = resolveValue(item.maxValue, defaultStyle?.maxValue, undefined);
  const lineColor = resolveValue(item.lineColor, defaultStyle?.lineColor, '#2196F3');

  // Subscribe to data changes and fetch history
  useEffect(() => {
    if (!dataName) {
      console.warn('[HistoryDiagram] No data name provided in item.content');
      return;
    }

    // Ensure data is registered
    if (!dataRegistry.get(dataName)) {
      console.warn(`[HistoryDiagramComponent] Data "${dataName}" not registered`);
      return;
    }

    // Get initial history
    const history = dataRegistry.getHistory(dataName);
    const transformed = history.map((entry) => ({
      timestamp: entry.timestamp,
      value: entry.newValue,
    }));
    setHistoryData(transformed);

    // Subscribe to changes and update history
    const callbackId = `history-diagram-${item.id}-${Math.random()}`;
    const handleChange = () => {
      const updatedHistory = dataRegistry.getHistory(dataName);
      const transformed = updatedHistory.map((entry) => ({
        timestamp: entry.timestamp,
        value: entry.newValue,
      }));
      setHistoryData(transformed);
    };

    dataRegistry.onChange(dataName, callbackId, handleChange);

    return () => {
      dataRegistry.offChange(dataName, callbackId);
    };
  }, [dataName, item.id]);

  /**
   * Draws the complete chart on the canvas
   */
  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle edge cases
    if (!historyData || historyData.length === 0) {
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#999';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No data available', width / 2, height / 2);
      return;
    }

    // ===== 1. SETUP: Calculate padding and drawable area =====
    const padding = { top: 40, right: 20, bottom: 40, left: 50 };
    const drawableWidth = width - padding.left - padding.right;
    const drawableHeight = height - padding.top - padding.bottom;

    // ===== 2. Clear canvas with white background =====
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // ===== 3. Calculate data ranges =====
    const timestamps = historyData.map((point) => point.timestamp);
    const values = historyData.map((point) => point.value);

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
      const y = padding.top + (drawableHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Draw Y-axis labels
      const value = dataMaxValue - (valueRange / gridLines) * i;
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(value.toFixed(2), padding.left - 10, y);
    }

    // ===== 5. Draw X and Y axes =====
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // Draw X-axis labels (timestamps)
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const xLabelCount = Math.min(5, historyData.length);
    for (let i = 0; i < xLabelCount; i++) {
      const index = Math.floor((historyData.length - 1) * (i / (xLabelCount - 1)));
      const point = historyData[index];
      const x = padding.left + (drawableWidth * (point.timestamp - minTime)) / timeRange;
      ctx.fillText(`${Math.round(point.timestamp)}`, x, height - padding.bottom + 10);
    }

    // ===== 6. Draw data line =====
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    let isFirstPoint = true;

    for (const point of historyData) {
      const x = padding.left + (drawableWidth * (point.timestamp - minTime)) / timeRange;
      const y =
        height -
        padding.bottom -
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

    for (const point of historyData) {
      const x = padding.left + (drawableWidth * (point.timestamp - minTime)) / timeRange;
      const y =
        height -
        padding.bottom -
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
    drawChart();
  }, [historyData, width, height, minValue, maxValue, lineColor, label]);

  const onItemClickHandler = () => {
    console.info('[HistoryDiagram] Chart clicked:', item.id);
    if (onItemClick) onItemClick(item.id, item);
  };

  return (
    <Box
      onClick={onItemClickHandler}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: 2,
        backgroundColor: '#fafafa',
        borderRadius: 1,
        border: '1px solid #e0e0e0',
        cursor: 'pointer',
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: '1px solid #ddd',
          borderRadius: 4,
          backgroundColor: '#fff',
        }}
      />
    </Box>
  );
};

export default HistoryDiagram;
.