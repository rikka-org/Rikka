import * as React from "react";
import { Card, Switch, Tooltip } from "@rikka/API/components";
import { BaseProduct } from "./BaseProduct";

export class InstalledProduct extends BaseProduct {
  render() {
    return (
      <Card className='rk-product'>
        {this.renderHeader()}
        {this.renderDetails()}
        {this.renderFooter()}
      </Card>
    );
  }

  protected renderHeader() {
    return (
      <div className='rk-product-header'>
        <h4>{this.props.product.name}</h4>
        <Tooltip text={this.props.enabled ? "Disable" : "Enable"} position="top">
          <div>
            <Switch value={this.props.enabled} onChange={(v: any) => {
              this.props.onToggle(v.target.checked);
            }} />
          </div>
        </Tooltip>
      </div>
    );
  }
}
