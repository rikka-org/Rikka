import axios from "axios";
import { resolve } from "path";
import * as React from "react";
import { parse } from "url";
import { format } from "util";

const RE_INVARIANT_URL = /https?:\/\/reactjs\.org\/docs\/error-decoder\.html\?invariant=([0-9]+)(?:[^ ])+/;

const ReactInvariant = axios.get("https://raw.githubusercontent.com/facebook/react/master/scripts/error-codes/codes.json")
  .then((res) => res.data);

interface errorBoundaryProps {
  children: any;
}

interface errorBoundaryState {
  crashed: boolean,
  errorStack: string,
  componentStack: string
}

/**
 * ErrorBoundary component taken from Replugged, rewritten in TypeScript.
 *
 * Replugged is licensed under the MIT license blah blah blah you get the idea.
*/
export class ErrorBoundary extends React.PureComponent<errorBoundaryProps, errorBoundaryState> {
  state = {
    crashed: false,
    errorStack: "",
    componentStack: "",
  };

  componentDidCatch(error: any, info: any) {
    this.setState({ crashed: true });
    ReactInvariant.then((invariant) => {
      const componentStack = info.componentStack
        .split("\n")
        .slice(1, 7)
        .join("\n");

      let errorStack;
      if (RE_INVARIANT_URL.test(error.stack || "")) {
        const uri = parse(RE_INVARIANT_URL.exec(error.stack)![0]!, true);
        const code = uri.query.invariant;
        if (!code) return;
        // eslint-disable-next-line no-nested-ternary
        const args = uri.query["args[]"]
          ? (Array.isArray(uri.query["args[]"])
            ? uri.query["args[]"]
            : [uri.query["args[]"]]
          )
          : [];

        errorStack = `React Invariant Violation #${code}\n${format(invariant[code as any], ...args)}`;
      } else {
        const basePath = resolve(__dirname, "../../../");

        errorStack = (error.stack || "")
          .split("\n")
          .filter((l: string) => !l.includes("discordapp.com/assets/") && !l.includes("discord.com/assets/"))
          .join("\n")
          .split(basePath)
          .join("");
      }

      this.setState({
        errorStack,
        componentStack,
      });
    });
  }

  render() {
    return this.state.crashed
      ? (
        <div className='rk-crashed-error'>
          <h2>Seems like we fucked up</h2>
          <div>A crash happened while rendering the settings component</div>
          <code>{this.state.errorStack}</code>
          <div>Component stack:</div>
          <code>{this.state.componentStack}</code>
        </div>
      )
      : this.props.children;
  }
}
