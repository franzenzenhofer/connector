import { EntityId, ComponentType, Component, System, Query, World, createEntityId } from './types';

export class ECSWorld implements World {
  private entities = new Set<EntityId>();
  private components = new Map<EntityId, Map<ComponentType, Component>>();
  private systems: System[] = [];
  private queryCache = new Map<string, Set<EntityId>>();

  createEntity(): EntityId {
    const id = createEntityId();
    this.entities.add(id);
    this.components.set(id, new Map());
    return id;
  }

  destroyEntity(id: EntityId): void {
    if (!this.entities.has(id)) {
      throw new Error(`Entity ${id} does not exist`);
    }
    
    this.entities.delete(id);
    this.components.delete(id);
    
    // Clear query cache entries containing this entity
    for (const cache of this.queryCache.values()) {
      cache.delete(id);
    }
  }

  addComponent(entityId: EntityId, component: Component): void {
    const entityComponents = this.components.get(entityId);
    if (!entityComponents) {
      throw new Error(`Entity ${entityId} does not exist`);
    }
    
    entityComponents.set(component.type, component);
    this.invalidateQueryCache();
  }

  removeComponent(entityId: EntityId, componentType: ComponentType): void {
    const entityComponents = this.components.get(entityId);
    if (!entityComponents) {
      throw new Error(`Entity ${entityId} does not exist`);
    }
    
    entityComponents.delete(componentType);
    this.invalidateQueryCache();
  }

  getComponent<T extends Component>(entityId: EntityId, componentType: ComponentType): T | undefined {
    const entityComponents = this.components.get(entityId);
    return entityComponents?.get(componentType) as T | undefined;
  }

  hasComponent(entityId: EntityId, componentType: ComponentType): boolean {
    const entityComponents = this.components.get(entityId);
    return entityComponents?.has(componentType) ?? false;
  }

  query(query: Query): readonly EntityId[] {
    const cacheKey = this.getQueryCacheKey(query);
    
    if (this.queryCache.has(cacheKey)) {
      return Array.from(this.queryCache.get(cacheKey)!);
    }
    
    const results = new Set<EntityId>();
    
    for (const [entityId, components] of this.components) {
      const hasAllRequired = query.required.every(type => components.has(type));
      const hasNoExcluded = !query.excluded || 
        query.excluded.every(type => !components.has(type));
      
      if (hasAllRequired && hasNoExcluded) {
        results.add(entityId);
      }
    }
    
    this.queryCache.set(cacheKey, results);
    return Array.from(results);
  }

  registerSystem(system: System): void {
    this.systems.push(system);
    this.systems.sort((a, b) => a.priority - b.priority);
  }

  update(deltaTime: number): void {
    for (const system of this.systems) {
      system.update(this, deltaTime);
    }
  }

  private getQueryCacheKey(query: Query): string {
    const required = [...query.required].sort().join(',');
    const excluded = query.excluded ? [...query.excluded].sort().join(',') : '';
    return `${required}|${excluded}`;
  }

  private invalidateQueryCache(): void {
    this.queryCache.clear();
  }
}