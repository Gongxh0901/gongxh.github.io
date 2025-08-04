---
layout: post
title: "Kunpo ECS - 高性能实体组件系统库"
date: 2024-01-08 15:00:00 +0800
categories: ["开源项目"]
tags: ["ECS", "TypeScript", "游戏引擎", "开源"]
excerpt: "Kunpo ECS是一个用TypeScript实现的高性能Entity-Component-System架构库，为游戏和应用提供灵活的实体管理解决方案。"
---

# Kunpo ECS - 高性能实体组件系统库

Kunpo ECS是一个专为游戏开发设计的高性能Entity-Component-System（ECS）架构库，使用TypeScript编写，提供了完整的实体管理、组件系统和系统调度功能。

## 项目背景

### 为什么选择ECS？
传统的面向对象游戏架构在复杂项目中会遇到以下问题：
- **继承层次复杂**：钻石继承问题难以解决
- **代码耦合度高**：组件间依赖关系复杂
- **性能瓶颈**：数据散布影响缓存局部性
- **扩展性差**：新功能添加困难

ECS架构通过数据与逻辑分离的设计，完美解决了这些问题。

## 核心特性

### 🚀 高性能设计
- **数据局部性**：组件按类型连续存储
- **向量化处理**：批量操作相同类型组件
- **零分配**：对象池和预分配内存
- **并行处理**：系统间可并行执行

### 🛠️ 开发友好
- **TypeScript支持**：完整的类型推导
- **装饰器语法**：简化组件和系统定义
- **调试工具**：内置性能分析和可视化
- **热重载**：开发时实时更新

## 快速开始

### 安装
```bash
npm install kunpo-ecs
# 或
yarn add kunpo-ecs
```

### 基础使用
```typescript
import { World, Component, System, Query } from 'kunpo-ecs';

// 定义组件
@Component()
class Position {
    constructor(public x: number = 0, public y: number = 0) {}
}

@Component()
class Velocity {
    constructor(public x: number = 0, public y: number = 0) {}
}

// 定义系统
@System()
class MovementSystem {
    @Query([Position, Velocity])
    entities!: Query<[Position, Velocity]>;
    
    update(deltaTime: number) {
        this.entities.forEach(([position, velocity]) => {
            position.x += velocity.x * deltaTime;
            position.y += velocity.y * deltaTime;
        });
    }
}

// 创建世界并运行
const world = new World();
world.addSystem(new MovementSystem());

// 创建实体
const entity = world.createEntity();
entity.addComponent(Position, 100, 100);
entity.addComponent(Velocity, 50, 0);

// 游戏循环
function gameLoop(deltaTime: number) {
    world.update(deltaTime);
    requestAnimationFrame(() => gameLoop(16.67));
}
gameLoop(16.67);
```

## 核心架构

### 1. 实体管理器
```typescript
export class EntityManager {
    private entities: Map<EntityId, Entity> = new Map();
    private recycledIds: EntityId[] = [];
    private nextId: EntityId = 1;
    
    createEntity(): Entity {
        const id = this.recycledIds.pop() || this.nextId++;
        const entity = new Entity(id, this);
        this.entities.set(id, entity);
        return entity;
    }
    
    destroyEntity(id: EntityId): void {
        const entity = this.entities.get(id);
        if (entity) {
            entity.destroy();
            this.entities.delete(id);
            this.recycledIds.push(id);
        }
    }
}
```

### 2. 组件管理器
```typescript
export class ComponentManager<T> {
    private components: T[] = [];
    private entityToIndex: Map<EntityId, number> = new Map();
    private indexToEntity: Map<number, EntityId> = new Map();
    private freeIndices: number[] = [];
    
    addComponent(entityId: EntityId, component: T): void {
        const index = this.freeIndices.pop() ?? this.components.length;
        
        if (index === this.components.length) {
            this.components.push(component);
        } else {
            this.components[index] = component;
        }
        
        this.entityToIndex.set(entityId, index);
        this.indexToEntity.set(index, entityId);
    }
    
    removeComponent(entityId: EntityId): boolean {
        const index = this.entityToIndex.get(entityId);
        if (index === undefined) return false;
        
        this.entityToIndex.delete(entityId);
        this.indexToEntity.delete(index);
        this.freeIndices.push(index);
        
        return true;
    }
    
    getComponent(entityId: EntityId): T | undefined {
        const index = this.entityToIndex.get(entityId);
        return index !== undefined ? this.components[index] : undefined;
    }
    
    getAllComponents(): T[] {
        return this.components;
    }
}
```

### 3. 查询系统
```typescript
export class QueryManager {
    private queries: Map<string, QueryResult> = new Map();
    
    createQuery<T extends ComponentTypes>(
        components: T
    ): Query<ComponentTuple<T>> {
        const signature = this.getSignature(components);
        
        if (!this.queries.has(signature)) {
            this.queries.set(signature, new QueryResult(components));
        }
        
        return this.queries.get(signature)! as Query<ComponentTuple<T>>;
    }
    
    private getSignature(components: ComponentType[]): string {
        return components
            .map(comp => comp.name)
            .sort()
            .join('|');
    }
}
```

## 高级特性

### 1. 事件系统
```typescript
@Component()
class Health {
    constructor(
        public current: number = 100,
        public max: number = 100
    ) {}
}

@System()
class HealthSystem {
    @Query([Health])
    entities!: Query<[Health]>;
    
    update() {
        this.entities.forEach((entity, [health]) => {
            if (health.current <= 0) {
                // 发送死亡事件
                EventBus.emit('entity-death', { entityId: entity.id });
            }
        });
    }
}
```

### 2. 资源管理
```typescript
@Resource()
class Time {
    constructor(
        public total: number = 0,
        public delta: number = 0
    ) {}
}

@System()
class TimeSystem {
    @Inject(Time)
    time!: Time;
    
    update(deltaTime: number) {
        this.time.delta = deltaTime;
        this.time.total += deltaTime;
    }
}
```

### 3. 系统调度
```typescript
export class SystemScheduler {
    private systems: System[] = [];
    private dependencyGraph: Map<System, System[]> = new Map();
    
    addSystem(system: System, dependencies: System[] = []): void {
        this.systems.push(system);
        this.dependencyGraph.set(system, dependencies);
    }
    
    update(deltaTime: number): void {
        const executionOrder = this.topologicalSort();
        
        for (const system of executionOrder) {
            system.update(deltaTime);
        }
    }
    
    private topologicalSort(): System[] {
        // 拓扑排序实现
        // ...
    }
}
```

## 性能优化

### 1. 内存池管理
```typescript
export class ObjectPool<T> {
    private pool: T[] = [];
    private createFn: () => T;
    private resetFn: (obj: T) => void;
    
    constructor(createFn: () => T, resetFn: (obj: T) => void) {
        this.createFn = createFn;
        this.resetFn = resetFn;
    }
    
    acquire(): T {
        const obj = this.pool.pop();
        return obj || this.createFn();
    }
    
    release(obj: T): void {
        this.resetFn(obj);
        this.pool.push(obj);
    }
}
```

### 2. 批量操作
```typescript
@System()
class RenderSystem {
    @Query([Position, Sprite])
    renderables!: Query<[Position, Sprite]>;
    
    update() {
        // 按层级分组
        const layers = new Map<number, Array<[Position, Sprite]>>();
        
        this.renderables.forEach(([position, sprite]) => {
            const layer = sprite.layer;
            if (!layers.has(layer)) {
                layers.set(layer, []);
            }
            layers.get(layer)!.push([position, sprite]);
        });
        
        // 批量渲染
        for (const [layer, entities] of layers) {
            this.batchRender(entities);
        }
    }
}
```

## 开发工具

### 1. 性能分析器
```typescript
export class Profiler {
    private measurements: Map<string, number[]> = new Map();
    
    measure<T>(name: string, fn: () => T): T {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        if (!this.measurements.has(name)) {
            this.measurements.set(name, []);
        }
        this.measurements.get(name)!.push(end - start);
        
        return result;
    }
    
    getReport(): ProfileReport {
        const report: ProfileReport = {};
        
        for (const [name, times] of this.measurements) {
            const avg = times.reduce((a, b) => a + b) / times.length;
            const min = Math.min(...times);
            const max = Math.max(...times);
            
            report[name] = { avg, min, max, count: times.length };
        }
        
        return report;
    }
}
```

### 2. 实体检查器
```typescript
export class EntityInspector {
    inspectEntity(entity: Entity): EntityInfo {
        const components = entity.getAllComponents();
        const info: EntityInfo = {
            id: entity.id,
            components: components.map(comp => ({
                type: comp.constructor.name,
                data: JSON.stringify(comp, null, 2)
            }))
        };
        
        return info;
    }
    
    visualizeWorld(world: World): WorldVisualization {
        // 生成世界状态的可视化数据
        // ...
    }
}
```

## 项目状态

### 当前版本：v2.1.0
- ✅ 核心ECS架构
- ✅ TypeScript类型支持
- ✅ 查询系统优化
- ✅ 事件系统
- ✅ 性能分析工具

### 开发中功能
- 🚧 可视化调试工具
- 🚧 序列化支持
- 🚧 多线程Worker支持

### 计划功能
- 📋 WebAssembly加速
- 📋 网络同步
- 📋 场景管理

## 项目链接

- **GitHub**: [https://github.com/gongxh0901/kunpo-ecs](https://github.com/gongxh0901/kunpo-ecs)
- **NPM**: [kunpo-ecs](https://www.npmjs.com/package/kunpo-ecs)
- **文档**: [API文档](https://kunpo-ecs.docs.com)
- **示例**: [在线演示](https://kunpo-ecs-demo.com)

## 贡献指南

欢迎开发者参与Kunpo ECS的开发：

1. **Issue报告**：发现bug或提出功能建议
2. **代码贡献**：提交Pull Request
3. **文档完善**：改进文档和示例
4. **性能测试**：提供性能测试案例

Kunpo ECS旨在为游戏开发者提供一个高性能、易用的ECS解决方案，让复杂的游戏逻辑变得简单而高效。 