import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userslice";
import editbrandReducer from "./slices/editbrandslice";
import editproductReducer from "./slices/editproductslice";
import editcategoryReducer from "./slices/editcategoryslice";
import priceReducer from "./slices/pricesclice";
import countReducer from "./slices/countslice"

const Storage = configureStore({
  reducer: {
    userinfo: userReducer,
    editbrandinfo: editbrandReducer,
    editproductinfo: editproductReducer,
    editcategoryinfo: editcategoryReducer,
    priceinfo: priceReducer,
    countinfo: countReducer
  },
});

export default Storage;
