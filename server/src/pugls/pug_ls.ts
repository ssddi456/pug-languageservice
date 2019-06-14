import { Lexer } from 'pug-lexer';
import pugParser = require('pug-parser');
import pugSourceGen = require('pug-source-gen');
import pugWalk = require('pug-walk');
import { Position } from "vscode-languageserver-types";
import { logger } from '../libs/logger';

interface JadeToken {
    type: string;
    loc: JadeTokenLocation;
    val: string;
}

interface JadeTokenLocation {
    start: JadeTokenPosition;
    filename: string;
    end: JadeTokenPosition;
}

interface JadeTokenPosition {
    // 1 based
    line: number;
    // 1 based
    column: number;
}

export const highlightableToken = [
    'tag',
    'class',
    'id',
    'attribute'
];

export const definationableToken = [
    'tag',
    'class',
    'attribute'
];

export const completableToken = [
    'tag',
    'class',
    'attribute'
];

function createAst(code: string) {
    const filename = 'temp.jade';
    const lexer = new Lexer(code, { filename });
    const tokens = lexer.getTokens();

    logger.log(() => ['tokens', tokens]);

    const ast = pugParser(tokens, {
        filename: name
    });

    return ast;
}

export function findTokenAtPosition(code: string, position: Position) {
    let ret = undefined;

    const filename = 'temp.jade';
    const lexer = new Lexer(code, { filename });
    try {
        lexer.getTokens();
    } catch (error) { }
    const tokens = lexer.tokens;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token.loc.start.line <= position.line + 1
            && token.loc.end.line >= position.line + 1
            && token.loc.start.column <= position.character + 1
            && token.loc.end.column >= position.character + 1
            && token.type != 'newline'
        ) {
            ret = token;
            return token;
        }
    }

    return ret;
}

// (function(){
//     const token = findTokenAtPosition('test', { line: 0, character: 0 });
//     console.log(token);

// })();
