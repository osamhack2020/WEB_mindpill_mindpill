export interface Listener<T> {
  (e: T): void
}

export class TypedEmitter<T> {
  private listeners: Listener<T>[] = []

  on(l: Listener<T>) {
    this.listeners.push(l)
  }

  off(l: Listener<T>) {
    const idx = this.listeners.indexOf(l)
    if (idx > -1) this.listeners.splice(idx, 1)
  }

  emit(e: T) {
    this.listeners.forEach(l => l(e))
  }
}
