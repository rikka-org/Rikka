import RikkaPlugin from '@rikka/Common/entities/Plugin';
import { clipboard } from 'electron';
//@ts-ignore
import { getModule, hljs } from "@rikka/API/webpack";
import * as pkg from './package.json';
import { patch } from '@rikka/API/patcher';
import React from '@rikka/API/pkg/React';
import { join } from 'path';

export default class rkCode extends RikkaPlugin {
    Manifest = {
        name: "rk-code",
        description: "Injects cool code styles to spice up your code",
        author: "V3L0C1T13S",
        license: "BSD 3-Clause",
        version: pkg.version,
        dependencies: []
    }

    inject() {
        this.loadStyleSheet(join(__dirname, 'style.css'));
    }

    async codePatch() {
        const parser = await getModule(['parse', 'parseTopic']) as any;
        patch(parser.defaultRules.codeBlock, "default", (args: any[], res: any) => {
            const { render } = res.props;

            res.props.render = (props: any) => {
                const codeblock = render(props);
                const codeElement = codeblock.props.children;

                const classes = codeElement.props.className.split(' ');

                const lang = args ? args[0].lang : classes[classes.indexOf('hljs') + 1];
                const lines = codeElement.props.dangerouslySetInnerHTML
                    ? codeElement.props.dangerouslySetInnerHTML.__html
                        // Ensure this no span on multiple lines
                        .replace(
                            /<span class="(hljs-[a-z]+)">([^<]*)<\/span>/g,
                            (_: any, className: any, code: string) => code.split('\n').map(l => `<span class="${className}">${l}</span>`).join('\n')
                        )
                        .split('\n')
                    : codeElement.props.children.split('\n');

                const isSanitized = Boolean(codeElement.props.dangerouslySetInnerHTML);
                delete codeElement.props.dangerouslySetInnerHTML;

                codeElement.props.children = this.renderCodeBlock(lang, lines, isSanitized);

                return codeblock;
            }
        });
    }

    async renderCodeBlock(lang: string, lines: string[], isSanitized: boolean) {
        if (hljs && typeof hljs.getLanguage === 'function') {
            lang = hljs.getLanguage(lang);
        }

        return React.createElement(React.Fragment, null,
            lang && React.createElement('div', { className: 'rikka-codeblock-lang' }, "en"),
            React.createElement('table', { className: 'powercord-codeblock-table' },
                ...lines.map((line, i) => React.createElement('tr', null,
                    React.createElement('td', null, i + 1),
                    React.createElement('td', lang && isSanitized ? { dangerouslySetInnerHTML: { __html: line } } : { children: line })
                ))
            ),
            React.createElement('button', {
                className: 'powercord-codeblock-copy-btn',
                onClick: this._onClickHandler
            }, "COPIED!")
        );
    }

    _onClickHandler(e: { target: any; }) {
        const { target } = e;
        if (target.classList.contains('copied')) {
            return;
        }

        target.innerText = "COPIED!";
        target.classList.add('copied');

        setTimeout(() => {
            target.innerText = "COPY";
            target.classList.remove('copied');
        }, 1e3);

        const code = [...target.parentElement.querySelectorAll('td:last-child')].map(t => t.textContent).join('\n');
        clipboard.writeText(code);
    }
}
