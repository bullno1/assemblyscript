abstract class BaseRegistry {
  private static INSTANCES: BaseRegistry | null = null;

  private next: BaseRegistry | null = null;

  constructor() {
    this.next = BaseRegistry.INSTANCES;
    BaseRegistry.INSTANCES = this;
  }

  static finalizeAll(ptr: usize): void {
    for (let i = BaseRegistry.INSTANCES; i !== null; i = i.next) {
      i.finalize(ptr);
    }
  }

  abstract finalize(ptr: usize): void;
}

export class FinalizationRegistry<T> extends BaseRegistry {
  private readonly values: Map<usize, T> = new Map<usize, T>();

  constructor(private cleanupCallback: (heldValue: T) => void) {
    super();
  }

  register<U>(target: U, heldValue: T): void {
    this.values.set(changetype<usize>(target), heldValue);
  }

  unregister<U>(target: T): void {
    this.values.delete(changetype<usize>(target));
  }

  finalize(ptr: usize): void {
    if (this.values.has(ptr)) {
      const heldValue = this.values.get(ptr);
      this.values.delete(ptr);
      this.cleanupCallback(heldValue);
    }
  }
}

export class WeakRef<T> {
  private static REFERENCES: Map<usize, u32> = new Map<usize, u32>();
  private static CURRENT_COOKIE: u32 = 0;

  private ref: usize;
  private cookie: u32;

  constructor(value: T) {
    const ref = changetype<usize>(value);
    const cookie = WeakRef.CURRENT_COOKIE;
    WeakRef.REFERENCES.set(ref, cookie);

    this.ref = ref;
    this.cookie = cookie;
  }

  static clearAll(ptr: usize): void {
    if (WeakRef.REFERENCES.delete(ptr)) {
      // From this point the memory could be reused by the allocator
      ++WeakRef.CURRENT_COOKIE;
    }
  }

  deref(): T | null {
    const ref = this.ref;
    if (
      WeakRef.REFERENCES.has(ref)
      && WeakRef.REFERENCES.get(ref) === this.cookie
    ) {
      return changetype<T>(ref);
    } else {
      return null;
    }
  }
}

// @ts-ignore: decorator
@global
function __finalize(ptr: usize): void {
  BaseRegistry.finalizeAll(ptr);
  WeakRef.clearAll(ptr);
}
