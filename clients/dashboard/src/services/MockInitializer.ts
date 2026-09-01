// src/services/MockInitializer.ts
import { dataRegistry } from './DataRegistry';
import { mockService } from './MockService';

export interface MocksConfig {
  autoStart: boolean;
  mocks: MockDefinition[];
}

export interface MockDefinition {
  name: string;
  id: string;
  initialValue: any;
  maxHistorySize?: number;
  simulator: SimulatorConfig;
}

export type SimulatorType = 'constant' | 'incremental' | 'random' | 'sine' | 'custom';

export interface SimulatorConfig {
  type: SimulatorType;
  interval: number;
  loop?: boolean;
  duration?: number;
  // For 'incremental'
  step?: number;
  // For 'random'
  min?: number;
  max?: number;
  // For 'sine'
  amplitude?: number;
  frequency?: number;
  // For 'custom'
  customFn?: (elapsedTime: number) => any;
}

class MockInitializer {
  initialize(config: MocksConfig): void {
    if (!config || !config.mocks || config.mocks.length === 0) {
      console.warn('MockInitializer: No mocks found in config');
      return;
    }

    config.mocks.forEach((mockDef) => {
      this.validateMockDefinition(mockDef);
      mockService.registerMock(mockDef);

      if (config.autoStart) {
        mockService.startSimulator(mockDef.id);
      }
    });

    console.log(`MockInitializer: Initialized ${config.mocks.length} mock(s)`);
  }

  private validateMockDefinition(mockDef: MockDefinition): void {
    if (!mockDef.id) {
      throw new Error('MockDefinition must have an id');
    }
    if (!mockDef.name) {
      throw new Error('MockDefinition must have a name');
    }
    if (!mockDef.simulator) {
      throw new Error('MockDefinition must have a simulator');
    }
    if (!mockDef.simulator.type) {
      throw new Error('SimulatorConfig must have a type');
    }

    const validTypes: SimulatorType[] = ['constant', 'incremental', 'random', 'sine', 'custom'];
    if (!validTypes.includes(mockDef.simulator.type)) {
      throw new Error(`Invalid simulator type: ${mockDef.simulator.type}`);
    }
  }
}

export const mockInitializer = new MockInitializer();
