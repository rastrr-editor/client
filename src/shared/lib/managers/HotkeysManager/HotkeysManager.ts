import EventEmitter from 'eventemitter3';
import { GLOBAL_CONTEXT_NAME, KEY_SEPARATOR } from './constants';
import type {
  HotkeysContext,
  HotkeysManagerEventEmitter,
  HotkeysUnregister,
  IHotkeysManager,
} from './types';
import { getCode } from './utils';

class HotkeysManager implements IHotkeysManager {
  #context: string = GLOBAL_CONTEXT_NAME;
  #emitter: HotkeysManagerEventEmitter;
  #activated: string | null = null;

  readonly #contexts = new Set<string>([GLOBAL_CONTEXT_NAME]);
  readonly #activeKeys = new Set<string>();
  readonly #hotkeys = new Map<string, Map<string, string>>();

  constructor() {
    this.#emitter = new EventEmitter() as HotkeysManagerEventEmitter;

    const handleKeyDown = (e: KeyboardEvent): void => {
      const { code } = e;
      const key = getCode(code);

      if (this.#activeKeys.has(key)) {
        return;
      }

      this.#activeKeys.add(key);
      this.#trigger(e);
    };

    const handleKeyUp = (e: KeyboardEvent): void => {
      const { code } = e;
      const key = getCode(code);
      this.#activeKeys.delete(key);
      this.#trigger(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  }

  public get context(): string {
    return this.#context ?? GLOBAL_CONTEXT_NAME;
  }

  public get activeKeys(): string[] {
    return Array.from(this.#activeKeys);
  }

  public get emitter(): HotkeysManagerEventEmitter {
    return this.#emitter;
  }

  #getContextName(name: HotkeysContext): string {
    if (name !== null && !this.#contexts.has(name)) {
      throw new Error(`"${name}" context is not registered`);
    }

    return name ?? GLOBAL_CONTEXT_NAME;
  }

  #getKeysHash(keys: string[]): string {
    return keys.map((key) => key.toLowerCase()).join(KEY_SEPARATOR);
  }

  #reset(e: KeyboardEvent): void {
    if (this.#activated === null) {
      return;
    }

    this.emitter.emit('deactivated', e, this.#activated);
    this.#activated = null;
  }

  #trigger(e: KeyboardEvent): void {
    const { context, activeKeys } = this;
    const hash = this.#getKeysHash(activeKeys);
    const localAlias = this.#hotkeys.get(hash)?.get(context);
    const globalAlias = this.#hotkeys.get(hash)?.get(GLOBAL_CONTEXT_NAME);
    const alias = localAlias ?? globalAlias;

    this.#reset(e);

    if (alias !== undefined) {
      this.#activated = alias;
      this.emitter.emit('activated', e, alias);
    }
  }

  isActive(alias: string): boolean {
    return alias === this.#activated;
  }

  setContext(name: HotkeysContext): void {
    this.#context = this.#getContextName(name);
  }

  registerContext(name: string): void {
    this.#contexts.add(name);
  }

  register(keys: string[], alias: string, context?: string): HotkeysUnregister {
    const contextName = this.#getContextName(context ?? null);
    const keysHash = this.#getKeysHash(keys);

    if (!this.#hotkeys.has(keysHash)) {
      this.#hotkeys.set(keysHash, new Map());
    }

    this.#hotkeys.get(keysHash)?.set(contextName, alias);

    return () => {
      this.#hotkeys.get(keysHash)?.delete(contextName);
    };
  }
}

export default new HotkeysManager();
