// src/services/MockService.ts

import { dataRegistry } from './DataRegistry';

type SimulatorType = 'constant' | 'incremental' | 'random' | 'sine' | 'custom';

export interface SimulatorConfig {
  type: SimulatorType;
  step?: number; // For 'incremental'
  min?: number; // For 'random'
  max?: number; // For 'random'
  amplitude?: number; // For 'sine'
  frequency?: number; // For 'sine'
  interval?: number; // Milliseconds between updates (default: 1000)
  duration?: number; // Total time to run in ms (null = infinite)
  customFnKey?: string; // Reference to custom function (e.g., 'decayBattery')
  loop?: boolean; // Loop when duration is reached (default: false)
}

export interface MockDefinition {
  name: string;
  id: string;
  initialValue: any;
  maxHistorySize?: number;
  simulator: SimulatorConfig;
}

export interface SimulatorStatus {
  id: string;
  name: string;
  isRunning: boolean;
  isPaused: boolean;
  startTime: number | null;
  pausedTime: number | null;
  elapsedTime: number;
}

// Custom function registry — add your custom functions here
const customFunctions: Record<string, (currentValue: any, timestamp: number, elapsedTime: number) => any> = {
  decayBattery: (currentValue: number, timestamp: number, elapsedTime: number) => {
    // Example: Battery decays over time
    return Math.max(0, currentValue - (elapsedTime / 1000) * 0.1);
  },
  decayFuel: (currentValue: number, timestamp: number, elapsedTime: number) => {
    // Example: Fuel decays over time
    return Math.max(0, currentValue - (elapsedTime / 1000) * 0.05);
  },
  // Add more custom functions as needed
};

class MockService {
  private mocks: Map<string, MockDefinition> = new Map();
  private simulators: Map<string, NodeJS.Timeout | null> = new Map();
  private simulatorStatus: Map<string, SimulatorStatus> = new Map();
  private startTimes: Map<string, number> = new Map();
  private pausedTimes: Map<string, number> = new Map();

  /**
   * Register a mock definition and create it in DataRegistry
   */
  registerMock(config: MockDefinition): void {
    if (this.mocks.has(config.id)) {
      console.warn(`MockService: Mock "${config.id}" already registered`);
      return;
    }

    // Register in DataRegistry
    dataRegistry.register(
      config.name,
      config.initialValue,
      config.maxHistorySize || 50
    );

    // Store mock definition
    this.mocks.set(config.id, config);

    // Initialize simulator status
    this.simulatorStatus.set(config.id, {
      id: config.id,
      name: config.name,
      isRunning: false,
      isPaused: false,
      startTime: null,
      pausedTime: null,
      elapsedTime: 0,
    });

    console.log(`MockService: Registered mock "${config.id}" (${config.name})`);
  }

  /**
   * Start simulator for a mock
   */
  startSimulator(id: string): void {
    if (!this.mocks.has(id)) {
      console.warn(`MockService: Mock "${id}" not found`);
      return;
    }

    if (this.simulators.has(id) && this.simulators.get(id) !== null) {
      console.warn(`MockService: Simulator "${id}" already running`);
      return;
    }

    const mock = this.mocks.get(id)!;
    const config = mock.simulator;
    const interval = config.interval || 1000;

    this.startTimes.set(id, Date.now());
    this.pausedTimes.set(id, 0);

    const status = this.simulatorStatus.get(id)!;
    status.isRunning = true;
    status.isPaused = false;
    status.startTime = Date.now();
    status.pausedTime = null;

    const timer = setInterval(() => {
      this.updateMockValue(id);
    }, interval);

    this.simulators.set(id, timer);
    console.log(`MockService: Started simulator "${id}"`);
  }

  /**
   * Stop simulator for a mock
   */
  stopSimulator(id: string): void {
    if (!this.simulators.has(id)) {
      console.warn(`MockService: Simulator "${id}" not found`);
      return;
    }

    const timer = this.simulators.get(id);
    if (timer) {
      clearInterval(timer);
    }

    this.simulators.set(id, null);
    this.startTimes.delete(id);
    this.pausedTimes.delete(id);

    const status = this.simulatorStatus.get(id)!;
    status.isRunning = false;
    status.isPaused = false;
    status.startTime = null;
    status.pausedTime = null;
    status.elapsedTime = 0;

    console.log(`MockService: Stopped simulator "${id}"`);
  }

  /**
   * Pause simulator (preserves elapsed time)
   */
  pauseSimulator(id: string): void {
    if (!this.simulators.has(id)) {
      console.warn(`MockService: Simulator "${id}" not found`);
      return;
    }

    const timer = this.simulators.get(id);
    if (!timer) {
      console.warn(`MockService: Simulator "${id}" is not running`);
      return;
    }

    clearInterval(timer);
    this.simulators.set(id, null);

    const status = this.simulatorStatus.get(id)!;
    status.isPaused = true;
    status.pausedTime = Date.now();

    console.log(`MockService: Paused simulator "${id}"`);
  }

  /**
   * Resume simulator (continues from where it paused)
   */
  resumeSimulator(id: string): void {
    if (!this.mocks.has(id)) {
      console.warn(`MockService: Mock "${id}" not found`);
      return;
    }

    const status = this.simulatorStatus.get(id)!;
    if (!status.isPaused) {
      console.warn(`MockService: Simulator "${id}" is not paused`);
      return;
    }

    const mock = this.mocks.get(id)!;
    const config = mock.simulator;
    const interval = config.interval || 1000;
    const pausedDuration = Date.now() - (status.pausedTime || Date.now());

    // Adjust start time to account for pause duration
    const currentStart = this.startTimes.get(id) || Date.now();
    this.startTimes.set(id, currentStart + pausedDuration);

    const timer = setInterval(() => {
      this.updateMockValue(id);
    }, interval);

    this.simulators.set(id, timer);

    status.isPaused = false;
    status.pausedTime = null;

    console.log(`MockService: Resumed simulator "${id}"`);
  }

  /**
   * Update mock value based on simulator config
   */
  private updateMockValue(id: string): void {
    const mock = this.mocks.get(id);
    if (!mock) return;

    const config = mock.simulator;
    const startTime = this.startTimes.get(id) || Date.now();
    const elapsedTime = Date.now() - startTime;

    // Check if duration exceeded
    if (config.duration && elapsedTime > config.duration) {
      if (config.loop) {
        // Reset start time and continue
        this.startTimes.set(id, Date.now());
      } else {
        // Stop simulator
        this.stopSimulator(id);
        return;
      }
    }

    const currentValue = dataRegistry.get(mock.name);
    let newValue: any;

    switch (config.type) {
      case 'constant':
        newValue = currentValue;
        break;

      case 'incremental':
        newValue = currentValue + (config.step || 1);
        break;

      case 'random':
        const min = config.min ?? 0;
        const max = config.max ?? 100;
        newValue = Math.random() * (max - min) + min;
        break;

      case 'sine':
        const amplitude = config.amplitude || 1;
        const frequency = config.frequency || 0.1;
        const initialValue = mock.initialValue;
        newValue =
          initialValue +
          amplitude * Math.sin((elapsedTime / 1000) * frequency * Math.PI * 2);
        break;

      case 'custom':
        const fnKey = config.customFnKey;
        if (fnKey && customFunctions[fnKey]) {
          newValue = customFunctions[fnKey](currentValue, Date.now(), elapsedTime);
        } else {
          console.warn(`MockService: Custom function "${fnKey}" not found for "${id}"`);
          return;
        }
        break;

      default:
        console.warn(`MockService: Unknown simulator type "${config.type}"`);
        return;
    }

    // Update value in registry
    dataRegistry.set(mock.name, newValue);

    // Update elapsed time in status
    const status = this.simulatorStatus.get(id)!;
    status.elapsedTime = elapsedTime;
  }

  /**
   * Get simulator status
   */
  getStatus(id: string): SimulatorStatus | null {
    return this.simulatorStatus.get(id) || null;
  }

  /**
   * Get all mock definitions
   */
  getAllMocks(): MockDefinition[] {
    return Array.from(this.mocks.values());
  }

  /**
   * Get all simulator statuses
   */
  getAllStatuses(): SimulatorStatus[] {
    return Array.from(this.simulatorStatus.values());
  }

  /**
   * Unregister a mock
   */
  unregisterMock(id: string): void {
    if (!this.mocks.has(id)) {
      console.warn(`MockService: Mock "${id}" not found`);
      return;
    }

    // Stop simulator if running
    if (this.simulators.get(id) !== null) {
      this.stopSimulator(id);
    }

    const mock = this.mocks.get(id)!;
    dataRegistry.unregister(mock.name);
    this.mocks.delete(id);
    this.simulators.delete(id);
    this.simulatorStatus.delete(id);
    this.startTimes.delete(id);
    this.pausedTimes.delete(id);

    console.log(`MockService: Unregistered mock "${id}"`);
  }

  /**
   * Debug info
   */
  debug(): void {
    console.log('=== MockService Debug ===');
    console.log('Mocks:', this.getAllMocks());
    console.log('Statuses:', this.getAllStatuses());
  }
}

export const mockService = new MockService();
