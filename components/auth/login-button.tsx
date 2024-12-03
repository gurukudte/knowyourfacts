import React, { ReactNode } from "react";
import { Button } from "../ui/button";

type LoginButtonProps = {
  children: ReactNode;
  mode: "modal" | "redirect";
  asChild: boolean;
};

const LoginButton = ({ mode = "redirect", asChild }: LoginButtonProps) => {
  return <Button className="cursor-pointer" />;
};

export default LoginButton;
