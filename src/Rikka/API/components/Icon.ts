import React from "../pkg/React";
import { getModules } from "../webpack";

// eslint-disable-next-line quotes
const registry = getModules((m: Function | unknown) => typeof m === "function" && m.toString().indexOf('"CurrentColor"') !== -1);
const Icon = (props: any) => {
  const mdl = registry.find((m: any) => m.displayName === props.name);
  const newProps = global._.cloneDeep(props);
  delete newProps.name;

  return React.createElement(mdl, newProps);
};
Icon.Names = registry.map((m: any) => m.displayName);

export default Icon;
