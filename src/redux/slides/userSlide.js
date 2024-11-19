import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  avatar: "",
  access_token: "",
  id: "",
  city: "",
  totalInvoice: 0,
  rank: "",
  isAdmin: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (State, action) => {
      const {
        name = "",
        email = "",
        access_token = "",
        address = "",
        avatar = "",
        phone = "",
        _id = "",
        city = "",
        totalInvoice = 0,
        rank = "",
        isAdmin = false,
      } = action.payload;

      State.name = name ? name : State.name;
      State.email = email ? email : State.email;
      State.address = address ? address : State.address;
      State.phone = phone ? phone : State.phone;
      State.avatar = avatar ? avatar : State.avatar;
      State.id = _id ? _id : State.id;
      State.access_token = access_token ? access_token : State.access_token;
      State.isAdmin = isAdmin ? isAdmin : State.isAdmin;
      State.city = city ? city : State.city;
      State.totalInvoice = totalInvoice ? totalInvoice : State.totalInvoice;
      State.rank = rank ? rank : State.rank;
    },

    resetUser: (State) => {
      State.name = "";
      State.email = "";
      State.address = "";
      State.phone = "";
      State.avatar = "";
      State.id = "";
      State.access_token = "";
      State.isAdmin = false;
      State.city = "";
      State.totalInvoice = "";
      State.rank = "";
    },
  },
});

export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
