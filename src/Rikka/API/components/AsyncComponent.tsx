import { getModule, getModuleByDisplayName } from "@rikka/API/webpack";
import { Nullable } from "@rikka/API/typings";
import React from "@rikka/API/pkg/React";

export type componentFilter = Function | string;

export type asyncComponentProps = {
  _provider: Function;
  _fallback?: any;
}

export type asyncComponentState = {
  Component?: Nullable<React.Component>;
}

export default class AsyncComponent extends React.PureComponent<asyncComponentProps, asyncComponentState> {
  constructor(props: asyncComponentProps | Readonly<asyncComponentProps>) {
    super(props);
    this.state = {
      Component: null,
    };
  }

  async componentDidMount() {
    this.setState({
      Component: await this.props._provider(),
    });
  }

  render() {
    const { Component } = this.state;
    if (Component) {
      // @ts-ignore yes it does have a constructor
      return <Component {...this.props} />;
    }
    return this.props._fallback || null;
  }

  /**
   * Creates an AsyncComponent from a promise.
   * @param {Promise<React.Component>} promise Promise of a React component
   * @param {React.Component} [fallback] Fallback Component
   * @returns {React.MemoExoticComponent<function(): React.ReactElement>}
   */
  static from(promise: Promise<React.Component>, fallback?: React.Component) {
    return React.memo((props) => <AsyncComponent _provider={() => promise} _fallback={fallback} {...props} />);
  }

  /**
   * Creates an AsyncComponent from a module by its displayName.
   * @param {string} displayName Module displayName
   * @param {React.Component} [fallback] Fallback Component
   * @returns {React.MemoExoticComponent<function(): React.ReactElement>}
   */
  static fromDisplayName(displayName: string, fallback?: React.Component) {
    return AsyncComponent.from(getModuleByDisplayName(displayName, true), fallback);
  }

  /**
   * Creates an AsyncComponent from a module by its props.
   * @param {Function|string} filter Module filter
   * @param {React.Component} [fallback] Fallback Component
   * @returns {React.MemoExoticComponent<function(): React.ReactElement>}
   */
  static fromProps(filter: componentFilter, fallback?: React.Component) {
    return AsyncComponent.from(getModule(filter, true), fallback);
  }

  /**
   * Creates an AsyncComponent from a module by its props.
   * @param {Function|string} filter Module filter
   * @param {string} [prop] Module property
   * @param {React.Component} [fallback] Fallback Component
   * @returns {React.MemoExoticComponent<function(): React.ReactElement>}
   */
  static fetchFromProps(filter: componentFilter | string, prop?: string, fallback?: React.Component) {
    // @ts-ignore yes it can be used as an index type
    return AsyncComponent.from((async () => (await getModule(filter, true))[prop || filter])(), fallback);
  }
}
