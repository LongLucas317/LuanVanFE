import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
  orderItemsSelected: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0,
  memberDiscount: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: "",
  isPaid: false,
  paidAt: "",
  isDelivered: false,
  deliveredAt: "",
  isSucessOrder: false,
};

export const orderSlide = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state?.orderItems?.find((item) => {
        return (
          item?.product === orderItem?.product &&
          item?.color === orderItem?.color &&
          item?.ram === orderItem?.ram &&
          item?.storage === orderItem?.storage
        );
      });
      if (itemOrder) {
        itemOrder.amount += orderItem?.amount;
      } else {
        state.orderItems.push(orderItem);
      }
    },
    increaseAmount: (state, action) => {
      const { idProduct, colorProduct, ramProduct, storageProduct } =
        action.payload;

      const itemOrder = state?.orderItems?.find((item) => {
        return (
          item?.product === idProduct &&
          item?.color === colorProduct &&
          item?.ram === ramProduct &&
          item?.storage === storageProduct
        );
      });
      const itemOrderSelected = state?.orderItemsSelected?.find((item) => {
        return (
          item?.product === idProduct &&
          item?.color === colorProduct &&
          item?.ram === ramProduct &&
          item?.storage === storageProduct
        );
      });
      itemOrder.amount++;
      if (itemOrderSelected) {
        itemOrderSelected.amount++;
      }
    },
    decreaseAmount: (state, action) => {
      const { idProduct, colorProduct, ramProduct, storageProduct } =
        action.payload;
      const itemOrder = state?.orderItems?.find((item) => {
        return (
          item?.product === idProduct &&
          item?.color === colorProduct &&
          item?.ram === ramProduct &&
          item?.storage === storageProduct
        );
      });
      const itemOrderSelected = state?.orderItemsSelected?.find((item) => {
        return (
          item?.product === idProduct &&
          item?.color === colorProduct &&
          item?.ram === ramProduct &&
          item?.storage === storageProduct
        );
      });
      itemOrder.amount--;
      if (itemOrderSelected) {
        itemOrderSelected.amount--;
      }
    },
    removeOrderProduct: (state, action) => {
      const { idProduct, colorProduct, ramProduct, storageProduct } =
        action.payload;

      const itemRemove = state?.orderItems?.find((item) => {
        return (
          item?.product === idProduct &&
          item?.color === colorProduct &&
          item?.ram === ramProduct &&
          item?.storage === storageProduct
        );
      });

      const itemOrder = state?.orderItems?.filter((item) => {
        return item !== itemRemove;
      });
      const itemOrderSeleted = state?.orderItemsSelected?.filter((item) => {
        return (
          item?.product !== idProduct &&
          item?.color !== colorProduct &&
          item?.ram !== ramProduct &&
          item?.storage !== storageProduct
        );
      });

      state.orderItems = itemOrder;
      state.orderItemsSelected = itemOrderSeleted;
    },
    selectedOrder: (state, action) => {
      const { listChecked } = action.payload;
      const orderSelected = [];
      state.orderItems.forEach((order) => {
        if (listChecked?.includes(order?.optionId)) {
          orderSelected.push(order);
        }
      });
      state.orderItemsSelected = orderSelected;
    },
    removeAllOrderProduct: (state, action) => {
      const { listChecked } = action.payload;

      const itemOrders = state?.orderItems?.filter(
        (item) => !listChecked.includes(item.optionId)
      );
      const itemOrdersSelected = state?.orderItems?.filter(
        (item) => !listChecked.includes(item.optionId)
      );
      state.orderItems = itemOrders;
      state.orderItemsSelected = itemOrdersSelected;
    },
  },
});

export const {
  addOrderProduct,
  increaseAmount,
  decreaseAmount,
  removeOrderProduct,
  selectedOrder,
  removeAllOrderProduct,
} = orderSlide.actions;

export default orderSlide.reducer;
