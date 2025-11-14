
import { AsyncLocalStorage } from "async_hooks";

type ContextData = {
  correlationId?: string;
};

const context = new AsyncLocalStorage<ContextData>();

export const contextService = {
  run<T>(callback: () => T | Promise<T>, initialContext: ContextData = {}): T | Promise<T> {
    return context.run(initialContext, callback);
  },
  setCorrelationId(correlationId: string) {
    const store = context.getStore();
    if (store) store.correlationId = correlationId;
  },
  getCorrelationId() {
    return context.getStore()?.correlationId;
  },
};
