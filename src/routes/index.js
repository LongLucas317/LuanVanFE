import Home from "~/pages/Home";
import SignIn from "~/pages/SignIn";
import SignUp from "~/pages/SignUp";
import Profile from "~/pages/Profile";
import Product from "~/pages/Product";
import ProductDetail from "~/pages/ProductDetail";
import Cart from "~/pages/Cart";
import Payment from "~/pages/Payment";
import OrderSuccess from "~/pages/OrderSuccess";
import MyOrder from "~/pages/MyOrder";
import OrderDetail from "~/pages/OrderDetail";
import Admin from "~/pages/Admin";

const publicRoutes = [
  { path: "/", component: Home, isPrivate: false },
  { path: "/sign-in", component: SignIn, layout: null, isPrivate: false },
  { path: "/sign-up", component: SignUp, layout: null, isPrivate: false },
  { path: "/profile", component: Profile, isPrivate: false },
  { path: "/product/:brand", component: Product, isPrivate: false },
  { path: "/product-detail/:id", component: ProductDetail, isPrivate: false },
  { path: "/cart", component: Cart, isPrivate: false },
  { path: "/payment", component: Payment, isPrivate: false },
  { path: "/order-success", component: OrderSuccess, isPrivate: false },
  { path: "/my-order", component: MyOrder, isPrivate: false },
  { path: "/order-detail/:id", component: OrderDetail, isPrivate: false },
  { path: "/system", component: Admin, isPrivate: true },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
