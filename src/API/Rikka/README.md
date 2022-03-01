# Rikka API
This repository contains basic Rikka API implementations, and should be used as a base for compatibility layers. It includes hooks into node modules, events, DOM mods, and plugin management frameworks.

## Structure
NodeMod contains "fake" node modules that are injected into the process at runtime, and anything in the top-level is automatically executed.
Sub-directories are static API's that plugins can call.