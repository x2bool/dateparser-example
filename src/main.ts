import * as S from 'parser-ts/string';
import * as P from 'parser-ts/Parser';
import * as C from 'parser-ts/char';
import {pipe} from "fp-ts/function";

export enum ShortMonth {
    Jan,
    Feb,
    Mar,
    Apr,
    May,
    June,
    July,
    Aug,
    Sept,
    Oct,
    Nov,
    Dec,
}

export enum Month {
    January,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December,
}

export const parseShortMonth: P.Parser<string, string> = (() => {
    let parser = S.string(ShortMonth[0]);
    for (let i = 1; i < 12; i++) {
        let p = S.string(ShortMonth[i]);
        parser = P.alt(() => p)(parser);
    }
    return parser;
})();

export const parseMonth: P.Parser<string, string> = (() => {
    let parser = S.string(Month[0]);
    for (let i = 1; i < 12; i++) {
        let p = S.string(Month[i]);
        parser = P.alt(() => p)(parser);
    }
    return parser;
})();

export const parseAnyMonth: P.Parser<string, Month> = (() => {
    const short = pipe(
        parseShortMonth,
        P.map(x => Object.keys(ShortMonth).indexOf(x) - 12)
    );
    const long = pipe(
        parseMonth,
        P.map(x => Object.keys(Month).indexOf(x) - 12)
    );
    return pipe(
        P.alt(() => short)(long),
        P.map(x => x as Month)
    );
})();

function parseNumber(min: number, max: number): P.Parser<string, number> {
    const num = pipe(
        C.oneOf("123456789"),
        P.map(head => P.map((tail: string[]) => head + tail.join(''))(P.many(C.digit))),
        P.flatten
    );
    return pipe(
        num,
        P.map(str => Number(str)),
        P.map(n => (n >= min && n <= max) ? P.succeed<string, number>(n) : P.fail<string, number>()),
        P.flatten
    );
}

export const parseDay = parseNumber(1, 31);
export const parseYear = parseNumber(2000, 2020);

export const parseDate: P.Parser<string, Date> = (() => {
    const the = P.optional(S.string("the "));

    const st = S.string("st");
    const nd = S.string("nd");
    const rd = S.string("rd");
    const th = S.string("th");

    const nth = P.optional(
        P.alt(() => P.alt(() => P.alt(() => st)(nd))(rd))(th)
    );

    const of = P.chain(() => P.optional(S.string("of ")))(S.string(" "));

    const comma = P.alt(() => S.string(", "))(S.string(" "));

    return pipe(
        the,
        P.chain(() => parseDay),
        P.map(d => P.map(() => d)(nth)),
        P.flatten,
        P.map(d => P.map(() => d)(of)),
        P.flatten,
        P.map(d => P.map(m => [d, m])(parseAnyMonth)),
        P.flatten,
        P.map(([d, m]) => P.map(() => [d, m])(comma)),
        P.flatten,
        P.map(([d, m]) => P.map(y => [d, m, y])(parseYear)),
        P.flatten,
        P.map(([d, m, y]) => new Date(y as number, m as number, d as number))
    );
})();
