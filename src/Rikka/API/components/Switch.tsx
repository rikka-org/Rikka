import * as React from "react";

import AsyncComponent from "./AsyncComponent";

const SwitchComponent = AsyncComponent.fromDisplayName("Switch");

export const Switch = React.memo(
  (props: any) => {
    // Compatibility for legacy syntax
    if (props.onChange && !props.__newOnChange) {
      const fn = props.onChange;
      props.onChange = (checked: boolean) => fn({ target: { checked } });
    }
    if (!props.checked) {
      props.checked = props.value;
    }
    return <SwitchComponent {...props}/>;
  },
);
