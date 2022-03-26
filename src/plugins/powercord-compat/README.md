## Powercord Compatibility Layer
Powercord Compatibility Layer is an easily embeddable, completely FOSS reimplementation of the Powercord API on Rikka and Rikka-like Discord client modifications. Powercord Compat does compatibility differently, instead of "overlaying" Powercord onto the client you're using, it translates their API's into Rikka-compatible ones.

### Features
* Plugin loading
* Native feeling

### Game-enders
Powercord Compat is never going to be a perfect 1-1 implementation of Powercord's API. This is a comprehensive list of some of the major issues that may draw you away from using Rikka and Powercord Compat

* Most plugins using the settings API are in a "it just works" state
* Commands reimplementation is unfinished
* Requires you to download Powercord's built-in plugins for most functionality

### TODO:
* Webserver emulation to stop reliance on Powercord's closed-source web services

## FAQ.
### Why is reimplementing the entire API so important?
The main reason for going through the work of reimplementing all of Powercord is in case one day, if Powercord ever becomes unsupported, we can simply use our own FOSS implementation.
### But Powercord is FOSS, why not just use its code?
Powercode may be "free" and open source, however, it is not free as in what can be done with the code. Powercord's license doesn't permit you to base your own projects off of its code, without explicit written permission from its developers.
### How can I detect Powercord Compat?
While it's not recommended to do so, you can by observing some of the Powercord API's characteristics. The easiest way by far is to check if powercord exports rikkapc_version. Please note that this method of detection can be prevented by the user through an in-app setting.
