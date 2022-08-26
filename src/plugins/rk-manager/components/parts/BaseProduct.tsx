import { Button, Divider } from "@rikka/API/components";
import { shell } from "electron";
import * as React from "react";
import { Details } from "./Details";

export interface BaseProductState {
  gitInfo: string
}

export interface BaseProductProps {
  key: string;
  product: PluginManifest;
  enabled: boolean;
  path: string;
  onToggle: (checked: boolean) => Promise<void>;
}

export class BaseProduct extends React.PureComponent<BaseProductProps, BaseProductState> {
  state = {
    gitInfo: "",
  };

  protected renderDetails() {
    return (
      <>
        <Divider/>
        <Details
          author={this.props.product.author.name}
          version={this.props.product.version}
          description={this.props.product.description ?? "No description given"}
          license={this.props.product.license}
          svgSize={"24"}
        />
      </>
    );
  }

  protected renderFooter() {
    return (
      <>
        <Divider/>
        <div className='rk-product-footer'>
          {
            <Button
              onClick={() => shell.openPath(this.props.path)}
              look={Button.Looks.LINK}
              size={Button.Sizes.SMALL}
              color={Button.Colors.TRANSPARENT}
              className="open-folder"
            > {"Open Folder"}
            </Button>
          }
        </div>
      </>
    );
  }
}
