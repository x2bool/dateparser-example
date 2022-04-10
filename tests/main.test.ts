import {
    Month,
    parseShortMonth,
    parseMonth,
    ShortMonth,
    parseAnyMonth,
    parseDay,
    parseYear,
    parseDate
} from "../src/main";
import { either as E } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import { run } from 'parser-ts/code-frame';

describe('date parser tests', () => {

    test('Indexing month enum gives string', () => {
        expect(ShortMonth[0]).toBe("Jan");
        expect(Month[0]).toBe("January");
    });

    test('Parsing short month recognizes short month', () => {
        const result = run(parseShortMonth, "Dec");
        pipe(result, E.match(
            e => { throw e; },
            x => expect(x).toBe("Dec")
        ));
    });

    test('Parsing month recognizes month', () => {
        const result = run(parseMonth, "December");
        pipe(result, E.match(
            e => { throw e; },
            x => expect(x).toBe("December")
        ));
    });

    test('Parsing any month recognizes both short and long formats', () => {
        let result = run(parseAnyMonth, "December");
        pipe(result, E.match(
            e => { throw e; },
            x => expect(x).toBe(Month.December)
        ));
        result = run(parseAnyMonth, "Dec");
        pipe(result, E.match(
            e => { throw e; },
            x => expect(x).toBe(Month.December)
        ));
    });

    test('Parsing day parses numbers between 1 and 31', () => {
        let result = run(parseDay, "1");
        pipe(result, E.match(
            e => { throw e; },
            n => expect(n).toBe(1)
        ));
        result = run(parseDay, "31");
        pipe(result, E.match(
            e => { throw e; },
            n => expect(n).toBe(31)
        ));
    });

    test('Parsing year parses numbers between 2000 and 2020', () => {
        let result = run(parseYear, "2000");
        pipe(result, E.match(
            e => { throw e; },
            n => expect(n).toBe(2000)
        ));
        result = run(parseYear, "2020");
        pipe(result, E.match(
            e => { throw e; },
            n => expect(n).toBe(2020)
        ));
    });

    test('Parse date parses "6 Sept 2019"', () => {
        let result = run(parseDate, "6 Sept 2019");
        pipe(result, E.match(
            e => { throw e; },
            date => {
                expect(date.getFullYear()).toBe(2019);
                expect(date.getMonth()).toBe(8);
                expect(date.getDate()).toBe(6);
            }
        ));
    });

    test('Parse date parses "1st Jan 2019"', () => {
        let result = run(parseDate, "1st Jan 2019");
        pipe(result, E.match(
            e => { throw e; },
            date => {
                expect(date.getFullYear()).toBe(2019);
                expect(date.getMonth()).toBe(0);
                expect(date.getDate()).toBe(1);
            }
        ));
    });

    test('Parse date parses "2nd Jan 2019"', () => {
        let result = run(parseDate, "2nd Jan 2019");
        pipe(result, E.match(
            e => { throw e; },
            date => {
                expect(date.getFullYear()).toBe(2019);
                expect(date.getMonth()).toBe(0);
                expect(date.getDate()).toBe(2);
            }
        ));
    });

    test('Parse date parses "3rd Jan 2019"', () => {
        let result = run(parseDate, "3rd Jan 2019");
        pipe(result, E.match(
            e => { throw e; },
            date => {
                expect(date.getFullYear()).toBe(2019);
                expect(date.getMonth()).toBe(0);
                expect(date.getDate()).toBe(3);
            }
        ));
    });

    test('Parse date parses "6 September 2019"', () => {
        let result = run(parseDate, "6 September 2019");
        pipe(result, E.match(
            e => { throw e; },
            date => {
                expect(date.getFullYear()).toBe(2019);
                expect(date.getMonth()).toBe(8);
                expect(date.getDate()).toBe(6);
            }
        ));
    });

    test('Parse date parses "the 6 of September, 2019"', () => {
        let result = run(parseDate, "the 6 of September, 2019");
        pipe(result, E.match(
            e => { throw e; },
            date => {
                expect(date.getFullYear()).toBe(2019);
                expect(date.getMonth()).toBe(8);
                expect(date.getDate()).toBe(6);
            }
        ));
    });

    test('Parse date parses "the 6th of September, 2019"', () => {
        let result = run(parseDate, "the 6th of September, 2019");
        pipe(result, E.match(
            e => { throw e; },
            date => {
                expect(date.getFullYear()).toBe(2019);
                expect(date.getMonth()).toBe(8);
                expect(date.getDate()).toBe(6);
            }
        ));
    });

});