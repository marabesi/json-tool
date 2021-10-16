import { ReactNode } from "react";

interface Props {
  children?: ReactNode
}

export default function Label({ children }: Props) {
  return (
    <label className="text-white">
      {children}
    </label>
  );
}