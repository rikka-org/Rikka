import * as React from "react";
import { getModule, getModuleByDisplayName } from "../webpack";

const DividerComponent = getModuleByDisplayName("FormDivider", false);
const Classes = getModule(["dividerDefault"], false);

export const Divider = React.memo(() => <DividerComponent className={Classes.dividerDefault} />);
