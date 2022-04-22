import React from "react";
import { getModule } from "../webpack";

export = getModule('createRef', 'createElement', 'Component', 'PureComponent') as typeof React;