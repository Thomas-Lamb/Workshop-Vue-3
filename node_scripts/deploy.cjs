var fs = require('fs-extra');
var replace = require('replace');
var dotenv = require('dotenv');
// require the library, main export is a function
const simpleGit = require('simple-git');
//simpleGit().clean(simpleGit.CleanOptions.FORCE);

// Reading parameters
let result = dotenv.config({path: '.env.development.local'});
if (result.error) {
    throw "Error : Configuration file not found (.env.development.local)"
}

// Setting variables
let DIST_PATH = './dist/';
let QBV2_PATH = process.env.QBV2_PATH
let QBV2_QUICKMAINT_PATH = QBV2_PATH + "/storage/quickapp/quickmaint/"
let QBV2_PUBLIC_PATH = QBV2_PATH + "/public/"

console.log(QBV2_PATH)
console.log(QBV2_QUICKMAINT_PATH)
console.log(QBV2_PUBLIC_PATH)


simpleGit().cwd(QBV2_QUICKMAINT_PATH).status()
    .then((status) => {
        if (status.files.length > 0) {
            console.error("Error : Quickbrain v2 has updates - please commit or clear repo " + QBV2_QUICKMAINT_PATH);
            process.exit(1);
        } else {

            // Cleaning target path
            fs.emptyDirSync(QBV2_QUICKMAINT_PATH);

            // Remove unused dev-sw.js
            fs.removeSync(DIST_PATH+'dev-sw.js');

            // Fix call to quickmaint-dev-sw.js
            let app_js = fs.readdirSync(DIST_PATH+'assets').filter(fn => fn.startsWith('app-'));
            console.log("Fix call to quickmaint-dev-sw.js");
            app_js.forEach((file) => {
                replace({
                    regex: "/quickmaint/quickmaint-dev-sw.js",
                    replacement: "/quickmaint-dev-sw.js",
                    paths: [DIST_PATH+'assets/'+file],
                    recursive: true,
                    silent: true,
                });
            });

            // Copying quickmaint-dev-sw.js to Quickbrain v2 public path
            fs.copyFile(DIST_PATH+'quickmaint-dev-sw.js', QBV2_PUBLIC_PATH+'quickmaint-dev-sw.js', function (err) {
                if (result.error) {
                    throw "Error : Cannot copy quickmaint-dev-sw.js to Quickbrain v2 public path"
                }
                console.log("quickmaint-dev-sw.js was deployed to : " + QBV2_PUBLIC_PATH);
            });

            // Copying builded quickmaint app to target path
            fs.copy(DIST_PATH, QBV2_QUICKMAINT_PATH, function (err) {
                if (result.error) {
                    throw "Error : Cannot copy Quickmaint to Quickbrain v2"
                }
                console.log("quickmaint was deployed to : " + QBV2_QUICKMAINT_PATH);

                // Remove unused quickmaint-dev-sw.js
                fs.removeSync(QBV2_QUICKMAINT_PATH+'quickmaint-dev-sw.js');
            });


        }
    })
    .catch((err) => {
        throw "Error : Cannot stat git folder"
    });
