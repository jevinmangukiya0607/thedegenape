import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    isConnected: false,
    address: null,
  },
  reducers: {
    setWalletConnection(state, action) {
      state.isConnected = action.payload.isConnected;
      state.address = action.payload.address;
    },
  },
});

export const { setWalletConnection } = walletSlice.actions;
export default walletSlice.reducer;
