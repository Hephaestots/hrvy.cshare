import ActivityStore from "./activityStore";
import { createContext, useContext } from "react";

interface Store {
    activityStore: ActivityStore
}

export const store: Store = {
    activityStore: new ActivityStore()
}

export const StoreContext = createContext(store);

// Hook for using the store.
export function useStore() {
    return useContext(StoreContext);
}