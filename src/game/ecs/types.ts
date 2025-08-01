export type EntityId = string & { readonly __brand: 'EntityId' };
export type ComponentType = string & { readonly __brand: 'ComponentType' };

export const createEntityId = (): EntityId => 
  crypto.randomUUID() as EntityId;

export const createComponentType = (name: string): ComponentType => 
  name as ComponentType;

export interface Component {
  readonly type: ComponentType;
}

export interface System {
  readonly name: string;
  readonly priority: number;
  update(world: World, deltaTime: number): void;
}

export interface Query {
  readonly required: readonly ComponentType[];
  readonly excluded?: readonly ComponentType[];
}

export interface World {
  createEntity(): EntityId;
  destroyEntity(id: EntityId): void;
  addComponent(entityId: EntityId, component: Component): void;
  removeComponent(entityId: EntityId, componentType: ComponentType): void;
  getComponent<T extends Component>(entityId: EntityId, componentType: ComponentType): T | undefined;
  hasComponent(entityId: EntityId, componentType: ComponentType): boolean;
  query(query: Query): readonly EntityId[];
  registerSystem(system: System): void;
  update(deltaTime: number): void;
}