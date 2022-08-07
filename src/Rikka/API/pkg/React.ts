import React from "react";
import { getModule } from "../webpack";

export default getModule("createRef", "createElement", "Component", "PureComponent") as typeof React & {
    getComponent: (name: string) => Promise<React.Component & any>;
};
