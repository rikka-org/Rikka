/* eslint-disable no-console */
import { getModule } from "@rikka/API/webpack";
import { webFrame } from "electron";

async function inject() {
  window.__$$DoNotTrackCache = {};
  const Analytics = await getModule(["getSuperPropertiesBase64"]);
  const Reporter = await getModule(["submitLiveCrashReport"]);
  const AnalyticsMaker = await getModule(["analyticsTrackingStoreMaker"]);

  window.__$$DoNotTrackCache.oldTrack = Analytics.track;
  window.__$$DoNotTrackCache.oldSubmitLiveCrashReport = Reporter.submitLiveCrashReport;
  window.__$$DoNotTrackCache.oldAddBreadcrumb = window.__SENTRY__.hub.addBreadcrumb;
  window.__$$DoNotTrackCache.oldHandleTrack = AnalyticsMaker.AnalyticsActionHandlers.handleTrack;

  Analytics.track = () => undefined;
  Reporter.submitLiveCrashReport = () => undefined;
  AnalyticsMaker.AnalyticsActionHandlers.handleTrack = () => undefined;
  window.__SENTRY__.hub.addBreadcrumb = () => undefined;

  window.__SENTRY__.hub.getClient().close();
  window.__SENTRY__.hub.getScope().clear();

  window.__$$DoNotTrackCache.oldConsoleLog = console.log;
  console.log = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("[Flux]")) {
      return;
    }

    window.__$$DoNotTrackCache?.oldConsoleLog.call(console, ...args);
  };
}

function uninject() {
  const Analytics = getModule(["getSuperPropertiesBase64"]);
  const Reporter = getModule(["submitLiveCrashReport"]);
  const AnalyticsMaker = getModule(["analyticsTrackingStoreMaker"]);

  Analytics.track = window.__$$DoNotTrackCache?.oldTrack;
  Reporter.submitLiveCrashReport = window.__$$DoNotTrackCache?.oldSubmitLiveCrashReport;
  window.__SENTRY__.hub.addBreadcrumb = window.__$$DoNotTrackCache?.oldAddBreadcrumb;
  AnalyticsMaker.AnalyticsActionHandlers.handleTrack = window.__$$DoNotTrackCache?.oldHandleTrack;
  console.log = window.__$$DoNotTrackCache?.oldConsoleLog;

  delete window.__$$DoNotTrackCache;
}

export = () => {
  webFrame.executeJavaScript(`(() => { ${inject.toString()} inject(); })();`);

  return () => {
    webFrame.executeJavaScript(`(() => { ${uninject.toString()} uninject(); })();`);
  };
}
