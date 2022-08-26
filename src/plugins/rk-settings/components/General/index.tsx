import { Switch } from "@rikka/API/components";
import * as React from "react";

interface generalState {
  testBtnEnabled: boolean;
}

export class GeneralSettings extends React.Component<{}, generalState> {
  state = {
    testBtnEnabled: false,
  };

  render() {
    return (
      <>
        <div className="rk-text">yeah theres nothing here yet lmfao</div>
        <div className="rk-text">you can have this switch though</div>
        <Switch
          value={this.state.testBtnEnabled}
          onChange={async (v: any) => {
            this.state.testBtnEnabled = !this.state.testBtnEnabled;
            this.forceUpdate();
          }}
        />
      </>
    );
  }
}
