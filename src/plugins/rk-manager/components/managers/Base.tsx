import { Divider } from "@rikka/API/components";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import * as React from "react";

export interface BaseManagerState {
  key: string;
  search: string;
}

export abstract class Base extends React.Component<{}, BaseManagerState> {
  state = {
    key: this.constructor.name.toUpperCase(),
    search: "",
  };

  render() {
    return (
      <div className='rk-ent-manage rk-text'>
        <div className='rk-ent-manage-header'>
          {this.renderHeader()}
          {this.renderButtons()}
        </div>
        <Divider/>
        {this.renderBody()}
      </div>
    );
  }

  protected renderHeader() {
    return (
      <span>{`RK_${this.state.key}_INSTALLED`}</span>
    );
  }

  protected abstract renderItem(item: any): JSX.Element;

  protected getItems(): any[] {
    return [];
  }

  protected renderButtons() {
    return ((
      <div className="buttons"></div>
    ));
  }

  protected renderBody() {
    const items = this.getItems();
    return (
      <div className='rk-ent-manage-items'>
        {this.renderSearch()}
        {items.length === 0
          ? <div className='empty'>
            <div className='emptyStateImage-2lOKoR'/>
            <p>{"tf is up with this shit"}</p>
            <p>{"*sad trombone*"}</p>
          </div>
          : items.map((item) => this.renderItem(item))}
      </div>
    );
  }

  protected renderSearch() {
    return (
      <div className='rk-ent-manage-search'></div>
    );
  }

  protected sortItems(items: RikkaPlugin[]) {
    if (this.state.search !== "") {
      const search = this.state.search.toLowerCase();
      items = items.filter((plugin) => plugin.Manifest!.name.toLowerCase().includes(search)
        || plugin.Manifest!.author.name.toLowerCase().includes(search)
        || plugin.Manifest!.description?.toLowerCase().includes(search));
    }

    return items.sort((a, b) => {
      const nameA = a.Manifest!.name.toLowerCase();
      const nameB = b.Manifest!.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });
  }
}
