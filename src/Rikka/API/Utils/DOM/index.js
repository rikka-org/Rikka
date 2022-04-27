/* eslint-disable no-unused-vars */
/**
 * Contains functions relating to the DOM.
 * @module DOM
 * @memberof Util
 * @namespace Util.DOM
 */

 import { nativeImage, webFrame } from 'electron';
 import Logger from '../logger';
 import { getModule } from '../../webpack';
 import { sleep } from '../time';
 
 export const createElement = (type, props) => {
   try {
     const element = document.createElement(type);
     for (const prop in props) {
       if ([ 'style', 'href' ].includes(prop) || prop.startsWith('rk-')) {
         element.setAttribute(prop, props[prop]);
       } else {
         element[prop] = props[prop];
       }
     }
     return element;
   } catch (err) {
     Logger.error(err);
   }
 };
 
 export const waitForElement = async (querySelector, all = false) => {
   try {
     let element;
     while (!(element = document.querySelector(querySelector))) await sleep(1);
     if (all) {
       return document.querySelectorAll(querySelector);
     }
     return element;
   } catch (err) {
     Logger.error(err);
   }
 };
 
 export const getElementDimensions = node => {
   try {
     let widthList = [ 'margin-right', 'margin-left', 'border-right', 'border-left', 'padding-right', 'padding-left', 'width' ];
     let heightList = [ 'margin-top', 'margin-bottom', 'border-top', 'border-bottom', 'padding-top', 'padding-bottom', 'height' ];
 
     const style = window.getComputedStyle(node);
     if (style.getPropertyValue('box-sizing') === 'border-box') {
       widthList = [ 'margin-right', 'margin-left', 'width' ];
       heightList = [ 'margin-top', 'margin-bottom', 'height' ];
     }
 
     const width = widthList
       .map(k => parseInt(style.getPropertyValue(k)))
       .reduce((prev, cur) => prev + cur);
     const height = heightList
       .map(k => parseInt(style.getPropertyValue(k)))
       .reduce((prev, cur) => prev + cur);
 
     return { width, height };
   } catch (err) {
     Logger.error(err);
   }
 };
 
 export const injectShadowStyles = (shadowRootElement, insertBeforeSelector, styles) => {
   try {
     const root = shadowRootElement?.shadowRoot;
     if (root !== null) {
       const styleElements = root.querySelectorAll('style');
       if (!Array.from(styleElements).some(el => el.innerHTML === styles)) {
         const newStyleTag = document.createElement('style');
         newStyleTag.innerHTML = styles;
         root.insertBefore(newStyleTag, root.querySelector(insertBeforeSelector));
       }
     }
   } catch (err) {
     Logger.error(err);
   }
 };
 
 // @todo
 export const injectStylesheet = () => {
   try {
     
   } catch (err) {
     Logger.error(err);
   }
 };
 
 // @todo
 export const injectScript = () => {
   try {
     
   } catch (err) {
     Logger.error(err);
   }
 };
 
 /**
  * A simple utility for conditionally joining class names together.
  * @see {@link https://github.com/JedWatson/classnames}
  * @param {string|object|Array} items Potential class names we're trying to join
  * @returns {string} String of class names joined together
  */
 export const joinClassNames = (...items) => {
   try {
     const classes = [];
     for (const item of items) {
       if (!item) continue;
       const argType = typeof item;
       if (argType === 'string' || argType === 'number') {
         classes.push(item);
       } else if (Array.isArray(item)) {
         if (item.length) {
           const inner = this.joinClassNames.apply(null, item);
           if (inner) classes.push(inner);
         }
       } else if (argType === 'object') {
         if (item.toString !== Object.prototype.toString) {
           classes.push(item.toString());
         } else {
           for (const key in item) {
             if (item.hasOwnProperty(key) && item[key]) {
               classes.push(key);
             }
           }
         }
       }
     }
     return classes.join(' ');
   } catch (err) {
     Logger.error(err);
   }
 };
 
 // @todo Figure out why this isn't working for Windows users.
 export const captureElement = async selector => {
   try {
     return (await (() => {
       const getSources = getModule('DesktopSources', 'default').default;
       const mediaEngine = getModule('getMediaEngine').getMediaEngine();
       async function capture (selector) {
         const el = document.querySelector(selector);
         const elRect = el.getBoundingClientRect();
         const sources = await getSources(mediaEngine, [ 'window' ], { width: window.outerWidth, height: window.outerHeight });
         const discord = sources.find(src => src.name === `${document.title} - Discord` || src.name === 'Discord');
         const img = nativeImage.createFromDataURL(discord.url);
         return img.crop(elRect);
       }
       return capture(selector);
     })()).toDataURL();
   } catch (err) {
     Logger.error(err);
   }
 };
 
 let i = 0;
 export const getRealElement = element => {
   if (!element?.setAttribute) return null;
   i++;
   element.setAttribute('rk-real-element', i);
 
   const node = webFrame.top.context.document.querySelector(`[rk-real-element="${i}"]`);
   element.removeAttribute('rk-real-element');
   return node;
 };
 