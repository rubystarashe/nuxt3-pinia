import type { ToRefs } from 'vue'
import type {
  Store as _Store,
  defineStore as _defineStore,
  storeToRefs,
  DefineStoreOptions,
  StoreDefinition,
  StateTree,
  _GettersTree,
  DefineSetupStoreOptions,
  _ExtractStateFromSetupStore,
  _ExtractGettersFromSetupStore,
  _ExtractActionsFromSetupStore,
  StoreState,
  StoreGetters,
  PiniaCustomStateProperties
} from 'pinia'

type PersistStorage = 'localStorage' | 'sessionStorage'
export interface Store<Id, S, G, A> extends _Store {
  $setup: {
    $persist: boolean | PersistStorage
  },
  toRefs(): storeToRefs<StoreState<S>>
}

export declare function isStoreLoaded(): boolean

export declare function getStore<Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(id: Id, options: Omit<DefineStoreOptions<Id, S, G, A>, 'id'>): Store<Id, S, G, A> 
export declare function getStore<Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(options: DefineStoreOptions<Id, S, G, A>): Store<Id, S, G, A> 
export declare function getStore<Id extends string, SS>(id: Id, storeSetup: () => SS, options?: DefineSetupStoreOptions<Id, _ExtractStateFromSetupStore<SS>, _ExtractGettersFromSetupStore<SS>, _ExtractActionsFromSetupStore<SS>>): Store<Id, _ExtractStateFromSetupStore<SS>, _ExtractGettersFromSetupStore<SS>, _ExtractActionsFromSetupStore<SS>>

export declare function store<Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(id: Id, options: Omit<DefineStoreOptions<Id, S, G, A>, 'id'>): Store<Id, S, G, A> 
export declare function store<Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(options: DefineStoreOptions<Id, S, G, A>): Store<Id, S, G, A> 
export declare function store<Id extends string, SS>(id: Id, storeSetup: () => SS, options?: DefineSetupStoreOptions<Id, _ExtractStateFromSetupStore<SS>, _ExtractGettersFromSetupStore<SS>, _ExtractActionsFromSetupStore<SS>>): Store<Id, _ExtractStateFromSetupStore<SS>, _ExtractGettersFromSetupStore<SS>, _ExtractActionsFromSetupStore<SS>>

export declare function defineStore<Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(id: Id, options: Omit<DefineStoreOptions<Id, S, G, A>, 'id'>): Store<Id, S, G, A> 
export declare function defineStore<Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(options: DefineStoreOptions<Id, S, G, A>): Store<Id, S, G, A> 
export declare function defineStore<Id extends string, SS>(id: Id, storeSetup: () => SS, options?: DefineSetupStoreOptions<Id, _ExtractStateFromSetupStore<SS>, _ExtractGettersFromSetupStore<SS>, _ExtractActionsFromSetupStore<SS>>): Store<Id, _ExtractStateFromSetupStore<SS>, _ExtractGettersFromSetupStore<SS>, _ExtractActionsFromSetupStore<SS>>

export {}
