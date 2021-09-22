import { mount } from 'marketing/MarketingApp';
import React, { useRef, useEffect } from 'react';

export default () => {
  const ref = useRef(null);

  // 每次父容器刷新时，我也跟着刷新
  useEffect(() => {
    mount(ref.current);
  });

  return <div ref={ref}></div>;
};
