#!/usr/bin/env node

checkNodeVersion();

const yeoman = require("yeoman-environment");
const argv = require("yargs").argv;
// const { exec } = require("child_process");
const fs = require('fs');


const env = yeoman.createEnv();
env.registerStub(require("generator-single-spa"), "single-spa");

console.info(`Using directory ${process.cwd()} for project files`)
env.run("single-spa . --framework vue --moduleType app-parcel" + argv._.join(" "), argv).then(() => {
  content = `module.exports = {
    runtimeCompiler: true,
    configureWebpack: {
      output: {
        libraryTarget: 'system',
      },
      devServer: {
        hot: false,
        liveReload: false
      },
      externals: ["single-spa", "vue", "vue-router"]
    },
  };`;
  fs.writeFile(process.cwd() + '/vue.config.js', content, err => {if (err) { console.error(err); throw err; }});
}).then(() => {
  content = `
VUE_APP_CDN=https://cdn.profcomff.com
VUE_APP_MAIN=https://app.profcomff.com
VUE_APP_API_AGGREGATOR=https://aggregator.api.profcomff.com
VUE_APP_API_PRINTER=https://printer.api.profcomff.com
VUE_APP_API_REPORT=https://report.api.profcomff.com
VUE_APP_API_TIMETABLE=https://timetable.api.profcomff.com
VUE_APP_API_NAVBAR=https://navbar.api.profcomff.com
VUE_APP_API_MARKETING=https://marketing.api.profcomff.com
  `;
  fs.writeFile(process.cwd() + '/.env.production', content, err => {if (err) { console.error(err); throw err; }});
}).then(() => {
  content = `
VUE_APP_CDN=https://cdn.test.profcomff.com
VUE_APP_MAIN=https://app.test.profcomff.com
VUE_APP_API_AGGREGATOR=https://aggregator.api.test.profcomff.com
VUE_APP_API_PRINTER=https://printer.api.test.profcomff.com
VUE_APP_API_REPORT=https://report.api.test.profcomff.com
VUE_APP_API_TIMETABLE=https://timetable.api.test.profcomff.com
VUE_APP_API_NAVBAR=https://navbar.api.test.profcomff.com
VUE_APP_API_MARKETING=https://marketing.api.test.profcomff.com
VUE_APP_FEEDBACK_FORM=https://forms.yandex.ru/u/635d013b068ff0587320bfc9/
  `;
  fs.writeFile(process.cwd() + '/.env.development', content, err => {if (err) { console.error(err); throw err; }});
}).then(() => {
  // exec(
  //   `git add ${process.cwd()} && git commit -m 'profcomff preparation' --author='PKFF CI <profcom@physics.msu.ru>'`,
  //   (error, stdout, stderr) => {
  //     if (stderr) {
  //         console.error(`stderr: ${stderr}`);
  //         return;
  //     }
  //   }
  // );
});

function checkNodeVersion() {
  const minVersion = "12.13.0";
  const [minMajor, minMinor, minPatch] = minVersion.split(".").map(Number);
  const [currentMajor, currentMinor, currentPatch] = process.versions.node
    .split(".")
    .map(Number);

  let validVersion = true;

  if (currentMajor < minMajor) {
    validVersion = false;
  } else if (currentMajor === minMajor) {
    if (currentMinor < minMinor) {
      validVersion = false;
    } else if (currentMinor === minMinor && currentPatch < minPatch) {
      validVersion = false;
    }
  }

  if (!validVersion) {
    throw Error(
      "create-single-spa requires NodeJS >= " +
        minVersion +
        ", but you are using NodeJS " +
        process.versions.node +
        "."
    );
  }
}
