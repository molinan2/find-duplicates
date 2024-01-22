import fs from 'fs';
import minimist from 'minimist';
import { walk } from './lib/walker.js';

const path = parsePath();
const items = walk(path, { hash: false });
console.log('Found', items.length, 'items');
fs.writeFileSync('./results/items.json', JSON.stringify(items, null, 4));

const duplicates = findDuplicates(items, { hash: false });
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
