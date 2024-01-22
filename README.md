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

Specify a custom folder by adding the `-p` (`--path`) option:

```shell
node index.js -p "Your folder"
node index.js --path "Your folder"
```

Default folder is `.`.
