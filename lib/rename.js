const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const CONFIG = require("./config/config,");

const dirs = [];
let prefix = "";
let suffix = "";
let args = process.argv;
let dir;
let renameDir = false;
let totalRenamedFile = 0;
let totalFiles = 0;
let totalDirectoriesRenamed = 0;
let totalDirectories = 0;
let startTime = 0;
let endTime = 0;
let recursive = false;

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Help of ${CONFIG.DISPLAY_NAME}! 

Usage: ${CONFIG.APP_NAME} [directory] [options] [flags]

Note: ${CONFIG.DISPLAY_NAME} by default only renames files, if you want to rename 
directories and files both then make sure to include "-rd" flag. 

Options:
--version     -v        Shows version
--help        -h        Shows helps
--example     -e        Shows example, how to use ${CONFIG.APP_NAME}
--rename-dir  -rd       Renames directories and files both
--suffix -s <suffix>    Add rename suffix
--prefix -p <prefix>    Add rename prefix
--recursive   -r        recursively rename
    `);
  process.exit();
}

if (args.includes("-v") || args.includes("--version")) {
  console.log(`${CONFIG.DISPLAY_NAME} Version: ${CONFIG.VERSION}`);
  process.exit();
}

if (args.includes("-e") || args.includes("--example")) {
  console.log(
    `Here are few example how you can use ${CONFIG.DISPLAY_NAME} 
with combination of flag and arguments.

Examples: 
${CONFIG.APP_NAME} <folder_path> -p <prefix>
${CONFIG.APP_NAME} <folder_path> -s <suffix>
${CONFIG.APP_NAME} <folder_path> -p <prefix> -s <suffix>
${CONFIG.APP_NAME} <folder_path> --rename-dir
${CONFIG.APP_NAME} <folder_path> --recursive
${CONFIG.APP_NAME} <folder_path> -p <prefix> -s <suffix> --recursive --rename-dir
    `
  );
  process.exit();
}

if (args.includes("-rd") || args.includes("--rename-dir")) {
  renameDir = true;
}

if (args.includes("--recursive") || args.includes("-r")) {
  recursive = true;
}

if (args.includes("--prefix")) {
  let index = args.indexOf("--prefix");
  prefix = args[index + 1];
}

if (args.includes("-p")) {
  let index = args.indexOf("-p");
  prefix = args[index + 1];
}

if (args.includes("--suffix")) {
  let index = args.indexOf("--suffix");
  suffix = args[index + 1];
}

if (args.includes("-s")) {
  let index = args.indexOf("-s");
  suffix = args[index + 1];
}

if (args[2]) {
  startTime = new Date();
  dir = args[2];
  console.log(chalk.bgGreen(" Renaming... "));
  renameFile();
  endTime = new Date();
  console.log(chalk.green("Done renaming"));

  const sec = (endTime - startTime) / 1000;

  console.log(
    chalk.blue(
      `Total time took to rename: ${chalk.cyan(
        sec > 60 ? (sec / 60).toFixed(2) + " Min" : sec.toFixed(2) + " Sec"
      )} `
    )
  );

  if (renameDir) {
    console.log(
      chalk.blue(
        `Total directories renamed: ${chalk.cyan(
          totalDirectoriesRenamed + "/"
        )}${chalk.cyan(totalDirectories)}`
      )
    );
  } else {
    console.log(
      chalk.blue(`Total directories found: ${chalk.cyan(totalDirectories)}`)
    );
  }
  console.log(
    chalk.yellow(
      `Total file renamed: ${chalk.cyan(totalRenamedFile + "/")}${chalk.cyan(
        totalFiles
      )}`
    )
  );
  console.log(chalk.bgCyan(" Bye! "));
  process.exit();
} else {
  console.error(
    chalk.red(`Directory path is required. ${CONFIG.APP_NAME} /dir/path`)
  );
}

function renameFile() {
  if (dirs.length > 0) {
    dirs.shift();
  }
  const files = fs.readdirSync(dir);
  files.forEach((file, i) => {
    if (fs.statSync(path.join(dir, file)).isFile()) {
      const fileName = `${prefix}${i + 1}${suffix}${path.extname(file)}`;
      try {
        fs.renameSync(path.join(dir, file), path.join(dir, fileName));
        totalRenamedFile += 1;
      } catch (error) {
        console.log(
          chalk.red(`Failed to rename file: ${path.join(dir, file)}`)
        );
      }
      totalFiles++;
    } else {
      let dirName = `${prefix}${i + 1}${suffix}`;
      if (renameDir) {
        try {
          fs.renameSync(path.join(dir, file), path.join(dir, dirName));
          dirs.push(path.join(dir, renameDir ? dirName : file));
          totalDirectoriesRenamed++;
        } catch (error) {
          console.log(
            chalk.red("Failed to rename directory: " + path.join(dir, file))
          );
        }
        totalDirectories++;
      }
    }
  });
  if (dirs.length > 0 && recursive) {
    dir = dirs[0];
    renameFile();
  }
}
