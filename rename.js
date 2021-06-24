const fs = require("fs");
const path = require("path");

const dirs = [];
let prefix = "";
let suffix = "";
let args = process.argv;
let dir;
let renameDir = false;
let totalRenamedFile = 0;
let totalDirectories = 0;
let startTime = 0;
let endTime = 0;

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
help of Renamejs! 

Usage: node rename.js [directory] [options] [flags]

Note: Renamejs by default only renames files if you want to rename 
directories and files both then make sure to include "-rd" flag. 

Options:
--help        -h        Shows helps
--example     -e        Shows example
--rename-dir  -rd       Renames directories and files both 
--suffix <suffix>       Add rename suffix
--prefix <prefix>       Add rename prefix
    `);
  process.exit();
}

if (args.includes("-rd") || args.includes("--rename-dir")) {
  renameDir = true;
}

if (args.includes("--prefix")) {
  let index = args.indexOf("--prefix");
  prefix = args[index + 1];
}

if (args.includes("--suffix")) {
  let index = args.indexOf("--suffix");
  suffix = args[index + 1];
}

if (args[2]) {
  startTime = new Date();
  dir = args[2];
  console.log("Renaming...");
  renameFile();
  endTime = new Date();
  console.log("Done renaming");
  console.log(`Total time took to rename: ${(endTime - startTime) / 1000} sec`);
  console.log(`Total directories found: ${totalDirectories}`);
  console.log(`Total file renamed: ${totalRenamedFile}`);
  console.log("Bye!");
  process.exit();
} else {
  console.log("Directory path is required");
}

function renameFile() {
  if (dirs.length > 0) {
    dirs.shift();
  }
  const files = fs.readdirSync(dir);
  files.forEach((file, index) => {
    if (fs.statSync(path.join(dir, file)).isFile()) {
      fs.renameSync(
        path.join(dir, file),
        path.join(dir, `${prefix}${index}${suffix}${path.extname(file)}`)
      );
      totalRenamedFile += 1;
    } else {
      let dirName = `${prefix}${index}${suffix}`;
      if (renameDir) {
        fs.renameSync(path.join(dir, file), path.join(dir, dirName));
      }
      dirs.push(path.join(dir, renameDir ? dirName : file));
      totalDirectories++;
    }
  });
  if (dirs.length > 0) {
    dir = dirs[0];
    renameFile();
  }
}
