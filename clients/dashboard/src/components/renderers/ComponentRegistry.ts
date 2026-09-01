// src/components/renderers/ComponentRegistry.ts
import TextComponent from './Text/TextComponent';
import BoxComponent from './Box/BoxComponent';
import CardComponent from './Card/CardComponent';
import HistoryDiagramComponent from './components/HistoryDiagram/HistoryDiagramComponent';
import componentRegistryConfig from '../config/componentRegistry.json';
import type { FC } from 'react';

export interface ComponentConfig {
  component: FC<any>;
  displayName: string;
  description?: string;
  path: string;
  fileName: string;
}

class ComponentRegistry {
  private registry = new Map<string, ComponentConfig>();

  constructor() {
    this.registerComponents();
  }

  private registerComponents() {
    const componentMap: Record<string, FC<any>> = {
      text: TextComponent,
      box: BoxComponent,
      card: CardComponent,
      historyDiagram: HistoryDiagramComponent,
    };

    componentRegistryConfig.components.forEach((config) => {
      const component = componentMap[config.type];
      if (component !== undefined) {
        this.registry.set(config.type, {
          component,
          displayName: config.displayName,
          description: config.description,
          path: config.path,
          fileName: config.fileName,
        });
      }
    });
  }

  getComponent(type: string): ComponentConfig | undefined {
    return this.registry.get(type);
  }

  getAllComponents(): ComponentConfig[] {
    return Array.from(this.registry.values());
  }
}

export const componentRegistry = new ComponentRegistry();
