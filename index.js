import fs from 'fs';
import minimist from 'minimist';
import { walk } from './lib/walker.js';

const CRITERIA_HASH = 'hash';
const CRITERIA_SIZE = 'size';

const path = parsePath();
const options = (() => {
    const criteria = parseCriteria();
    switch (criteria) {
        case CRITERIA_HASH: return { hash: true };
        case CRITERIA_SIZE: return { hash: false };
        default: return { hash: true };
    }
})();

const items = walk(path, options);
console.log('Found', items.length, 'items');
fs.writeFileSync('./results/items.json', JSON.stringify(items, null, 4));

const duplicates = findDuplicates(items, options);
console.log('Found', duplicates.length, 'duplicates');
fs.writeFileSync('./results/duplicates.json', JSON.stringify(duplicates, null, 4));

/**
 *
 * @return {*|string}
 */
function parsePath() {
    const DEFAULT_PATH = '.';
    const args = minimist(process.argv);
    const path = args['p'] || args['path'] || DEFAULT_PATH;

    return path;
}

/**
 *
 * @return {*|string}
 */
function parseCriteria() {
    const DEFAULT_CRITERIA = CRITERIA_HASH;
    const args = minimist(process.argv);
    const criteria = args['c'] || args['criteria'] || DEFAULT_CRITERIA;

    if (![CRITERIA_HASH, CRITERIA_SIZE].includes(criteria)) {
        return DEFAULT_CRITERIA;
    }

    return criteria;
}

/**
 *
 * @param items
 * @param options
 * @return {*[]}
 */
function findDuplicates(items, options) {
    const duplicates = [];

    for (const item of items) {
        const filtered = items.filter(e => {
            const criteria = options.hash ? e.hash === item.hash : e.size === item.size;
            return criteria && !e.scanned;
        });

        if (filtered.length > 1) {
            duplicates.push({
                size: item.size,
                hash: item.hash,
                count: filtered.length,
                items: filtered
            })
        }

        for (const item of filtered) {
            item.scanned = true;
        }
    }

    return duplicates;
}
