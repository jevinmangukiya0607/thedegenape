"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import LoadingComponent from "@/app/components/LoadingComponent";

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>
        <LoadingComponent/>
      </div>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
