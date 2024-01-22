# About

Finds duplicated files in a directory, by comparing either size or MD5.

# Usage

Run:

```shell
node index.js
```

The current folder and all its subfolders will be traversed recursively. Results will be placed in the [./results](./results) folder, including 2 files:

* `items.json`: The complete list of files.
* `duplicates.json`: The duplicated files.

### Folder

Default is `.`. Specify a custom folder by adding the `-p` (`--path`) option:

```shell
node index.js -p "Your folder"
node index.js --path "Your folder"
```

### Criteria

Default is `hash`. Criteria can be `hash` (slow) or `size` (fast but inaccurate). Specify a criteria by adding the `-c` (`--criteria`) option:

```shell
node index.js -c "hash"
node index.js -c "size"
node index.js --criteria "hash"
node index.js --criteria "size"
```
