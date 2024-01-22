import fs from 'fs';
import chalk from 'chalk';
import md5 from 'md5';

const DEFAULT_OPTIONS = {
    hash: true
};

/**
 * Compare function by name
 *
 * @param {Dirent} a
 * @param {Dirent} b
 * @returns {number}
 */
function byName(a, b) {
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
}

/**
 * Walks a directory recursively, accumulating results in items
 *
 * @param {string} folder
 * @param {[]} items Items to accumulate
 * @param options
 */
const walkRecursively = function(folder, items=[], options) {
    console.log(chalk.grey(folder));
    const entries = fs.readdirSync(folder, { withFileTypes: true });
    const fileEntries = entries.filter(e => e.isFile()).sort(byName);
    const dirEntries = entries.filter(e => e.isDirectory()).sort(byName);

    items.push(...fileEntries.map(e => {
        const name = e.name;
        const path = `${folder}/${e.name}`;
        const file = fs.readFileSync(path);
        const hash = options.hash ? md5(file) : null;
        const size = fs.statSync(path).size;

        return { name, folder, path, size, hash };
    }));

    for (const dir of dirEntries) {
        walkRecursively(`${folder}/${dir.name}`, items, options);
    }
}

/**
 * Walks a directory recursively and returns the items found inside it
 *
 * @param path
 * @param options
 * @return {[]}
 */
const walk = function(path, options = DEFAULT_OPTIONS) {
    console.log(chalk.white('Traversing path:'), chalk.blue(path));
    const items = [];
    walkRecursively(path, items, options);

    return items;
}

export { walk };
