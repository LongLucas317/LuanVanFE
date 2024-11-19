import { Spin } from "antd";

function Loading({ children, isPending, delay = 200 }) {
  return (
    <Spin spinning={isPending} delay={delay} size="large">
      {children}
    </Spin>
  );
}

export default Loading;
