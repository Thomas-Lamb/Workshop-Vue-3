var fs = require('fs-extra');

// Setting variables
let PUBLIC_PATH = './public';
let DIST_PATH = './dist';
let files = ["/"];

function getFiles (dir, files_){
    files_ = files_ || [];
    let files = fs.readdirSync(dir);
    let ignored = ['quickmaint-sw.js','filelist.js'];
    for (let i in files){
        let name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name.substring(6));
        }
    }
    return Object.assign({}, files_);
}

async function updateFileList() {
    await fs.writeFile('./dist/filelist.js',JSON.stringify(getFiles(DIST_PATH,files)))
}

updateFileList().then(() => {
    fs.copyFile(PUBLIC_PATH+'/quickmaint-sw.js', DIST_PATH+'/quickmaint-sw.js', function (err) {
        if (err) {
            throw "Error : Cannot copy quickmaint-sw.js to "+ DIST_PATH;
        }
    });
});


