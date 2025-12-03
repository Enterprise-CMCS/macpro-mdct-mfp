import React from "react";

// Bypass React 18/19 typing mismatch
export function shimComponent(Comp: any): React.FC<any> {
  const Shim: React.FC<any> = (props) => {
    const C = Comp as any;
    return <C {...props} />;
  };

  return Shim;
}
