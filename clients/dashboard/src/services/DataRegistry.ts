// src/services/DataRegistry.ts

type ChangeCallback = (newValue: any, oldValue: any) => void;

interface HistoryEntry {
  timestamp: number;
  oldValue: any;
  newValue: any;
}

interface RegisteredData {
  value: any;
  history: HistoryEntry[];
  maxHistory: number;
  callbacks: Map<string, ChangeCallback>;
}

class DataRegistry {
  private data: Map<string, RegisteredData> = new Map();

  register(name: string, initialValue: any, maxHistorySize: number = 50): void {
    if (this.data.has(name)) {
      // Already registered - update maxHistory if needed
      const registered = this.data.get(name)!;
      const oldMaxHistory = registered.maxHistory;
      registered.maxHistory = maxHistorySize;

      console.log(
        `DataRegistry: "${name}" already registered. Updated maxHistory: ${oldMaxHistory} → ${maxHistorySize}`
      );
      return;
    }

    // First registration
    this.data.set(name, {
      value: initialValue,
      history: [],
      maxHistory: maxHistorySize,
      callbacks: new Map(),
    });

    console.log(`DataRegistry: Registered "${name}"`);
  }

  get(name: string): any {
    if (!this.data.has(name)) {
      console.warn(`DataRegistry: "${name}" not registered`);
      return undefined;
    }
    return this.data.get(name)!.value;
  }

  set(name: string, newValue: any): void {
    if (!this.data.has(name)) {
      console.warn(`DataRegistry: "${name}" not registered. Use register() first.`);
      return;
    }

    const registered = this.data.get(name)!;
    const oldValue = registered.value;

    // Only update if value actually changed
    if (oldValue === newValue) {
      return;
    }

    registered.value = newValue;

    // Add to history
    registered.history.push({
      timestamp: Date.now(),
      oldValue,
      newValue,
    });

    // Trim history to maxHistory size
    if (registered.history.length > registered.maxHistory) {
      registered.history = registered.history.slice(
        -registered.maxHistory
      );
    }

    // Trigger all callbacks
    registered.callbacks.forEach((callback) => {
      callback(newValue, oldValue);
    });
  }

  onChange(
    name: string,
    callbackId: string,
    callback: ChangeCallback
  ): void {
    if (!this.data.has(name)) {
      console.warn(`DataRegistry: "${name}" not registered`);
      return;
    }

    const registered = this.data.get(name)!;
    registered.callbacks.set(callbackId, callback);
  }

  offChange(name: string, callbackId: string): void {
    if (!this.data.has(name)) {
      console.warn(`DataRegistry: "${name}" not registered`);
      return;
    }

    const registered = this.data.get(name)!;
    registered.callbacks.delete(callbackId);
  }

  getHistory(name: string): HistoryEntry[] {
    if (!this.data.has(name)) {
      console.warn(`DataRegistry: "${name}" not registered`);
      return [];
    }

    return [...this.data.get(name)!.history];
  }

  clearHistory(name: string): void {
    if (!this.data.has(name)) {
      console.warn(`DataRegistry: "${name}" not registered`);
      return;
    }

    this.data.get(name)!.history = [];
  }

  unregister(name: string): void {
    if (!this.data.has(name)) {
      console.warn(`DataRegistry: "${name}" not registered`);
      return;
    }

    this.data.delete(name);
    console.log(`DataRegistry: Unregistered "${name}"`);
  }

  debug(): void {
    console.log('=== DataRegistry Debug ===');
    this.data.forEach((registered, name) => {
      console.log(`"${name}":`, {
        value: registered.value,
        maxHistory: registered.maxHistory,
        historyLength: registered.history.length,
        callbackCount: registered.callbacks.size,
        history: registered.history,
      });
    });
  }
}

export const dataRegistry = new DataRegistry();
