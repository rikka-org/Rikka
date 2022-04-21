import { getModule, getModuleByDisplayName } from '@rikka/API/webpack';
import React, { memo, PureComponent } from '@rikka/API/pkg/React';

export default class AsyncComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      Component: null
    };
  }

  async componentDidMount() {
    this.setState({
      Component: await this.props._provider()
    });
  }

  render() {
    const { Component } = this.state;
    if (Component) {
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
  static from(promise, fallback) {
    return memo(props =>
      <AsyncComponent _provider={() => promise} _fallback={fallback} {...props} />
    );
  }

  /**
   * Creates an AsyncComponent from a module by its displayName.
   * @param {string} displayName Module displayName
   * @param {React.Component} [fallback] Fallback Component
   * @returns {React.MemoExoticComponent<function(): React.ReactElement>}
   */
  static fromDisplayName(displayName, fallback) {
    return AsyncComponent.from(getModuleByDisplayName(displayName, true), fallback);
  }

  /**
   * Creates an AsyncComponent from a module by its props.
   * @param {Function|string} filter Module filter
   * @param {React.Component} [fallback] Fallback Component
   * @returns {React.MemoExoticComponent<function(): React.ReactElement>}
   */
  static fromProps(filter, fallback) {
    return AsyncComponent.from(getModule(filter, true), fallback);
  }

  /**
   * Creates an AsyncComponent from a module by its props.
   * @param {Function|string} filter Module filter
   * @param {string} [prop] Module property
   * @param {React.Component} [fallback] Fallback Component
   * @returns {React.MemoExoticComponent<function(): React.ReactElement>}
   */
  static fetchFromProps(filter, prop, fallback) {
    return AsyncComponent.from((async () => (await getModule(filter, true))[prop || filter])(), fallback);
  }
}
