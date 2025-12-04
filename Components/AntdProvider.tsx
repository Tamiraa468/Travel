"use client";

import React from "react";
import { ConfigProvider } from "antd";

interface Props {
  children: React.ReactNode;
}

export default function AntdProvider({ children }: Props) {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>
      {children}
    </ConfigProvider>
  );
}
