import AsyncComponent from "@rikka/API/components/AsyncComponent";
import { patch } from "@rikka/API/patcher";
import { getModuleByDisplayName } from "@rikka/API/webpack";
import RikkaPlugin from "@rikka/Common/entities/Plugin";
import { join } from "path";
import React from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GeneralSettings } from "./components/General";
import manifest from "./manifest.json";

const FormTitle = AsyncComponent.from(getModuleByDisplayName("FormTitle"));
const FormSection = AsyncComponent.from(getModuleByDisplayName("FormSection"));

function _renderWrapper(label: string, Component: any) {
  return React.createElement(
    ErrorBoundary,
    null,
    React.createElement(
      FormSection,
      {},
      React.createElement(FormTitle as any, { tag: "h2" }, label),
      React.createElement(Component),
    ),
  );
}

function _makeSection(tabId: string) {
  const props = $rk.settingsManager.settingsTabs[tabId];
  if (!props) return;
  const label = typeof props.label === "function" ? props.label() : props.label;
  return {
    label,
    section: tabId,
    element: () => _renderWrapper(label, props.render),
  };
}

function isCoreSetting(name: string) {
  return name.startsWith("core-");
}

export default class rkSettings extends RikkaPlugin {
  inject() {
    this.patchSettingsMenu();
  }

  private async patchSettingsMenu() {
    $rk.settingsManager.registerSettings("core-general", {
      category: "rk-general",
      label: () => "General",
      render: () => React.createElement(GeneralSettings),
    });

    this.loadStyleSheet(join(__dirname, "scss/style.scss"));

    const SettingsView = (await getModuleByDisplayName("SettingsView"));
    patch("rk-settings-items", SettingsView.prototype, "getPredicateSections", (_: any, sections: any) => {
      if (sections.length < 10) {
        return sections;
      }
      const changelog = sections.find((c: any) => c.section === "changelog");
      if (changelog) {
        const coreSections = Object.keys($rk.settingsManager.settingsTabs)
          .filter((s) => isCoreSetting(s))
          .map((s) => _makeSection(s));

        const settingsSections = Object.keys($rk.settingsManager.settingsTabs)
          .filter((s) => !isCoreSetting(s))
          .map((s) => _makeSection(s));

        sections.splice(
          sections.indexOf(changelog),
          0,
          {
            section: "HEADER",
            label: "Rikka",
          },
          ...coreSections,
          { section: "DIVIDER" },
          {
            section: "HEADER",
            label: "Rikka Plugin Settings",
          },
          ...settingsSections,
          { section: "DIVIDER" },
        );
      }
    });
  }
}
