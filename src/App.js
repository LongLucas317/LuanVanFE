import "~/index.css";
import { Fragment, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import { DefaultLayout } from "~/component/Layouts";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserServices from "~/services/UserServices";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "~/redux/slides/userSlide";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleGetDetailUser = async (id, token) => {
    const res = await UserServices.getDetailUser(id, token);

    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};

    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);

      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  useEffect(() => {
    let { decoded, storageData } = handleDecoded();

    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData);
    }
  }, []);

  UserServices.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await UserServices.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // const fetchApi = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_API_URL}/product/getAll`
  //   );

  //   return res.data;
  // };

  // const query = useQuery({ queryKey: ["get All product"], queryFn: fetchApi });

  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Layout = route.layout === null ? Fragment : DefaultLayout;
            const Page = route.component;
            const isCheckAuth = !route.isPrivate || user.isAdmin;

            return (
              <Route
                key={index}
                // path={route.path}
                path={isCheckAuth ? route.path : undefined}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
