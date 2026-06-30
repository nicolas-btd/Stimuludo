const fs = require('fs-extra');
const path = require('path');
const { minify: minifyHtml } = require('html-minifier-terser');
const CleanCSS = require('clean-css');
const { minify: minifyJs } = require('terser');


const targetDir = path.join(__dirname, 'public');

async function build() {
    console.log('🚀 Début de la minification en place dans /public...');
    await processDirectory(targetDir);
    console.log('🎉 Opération terminée ! Les fichiers de /public sont minifiés pour la production.');
}

async function processDirectory(dir) {
    const files = await fs.readdir(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = await fs.stat(fullPath);


                if (stat.isDirectory()) {
            await processDirectory(fullPath);
        } 

                else {
            await minifyFile(fullPath);
        }
    }
}

async function minifyFile(filePath) {
    const ext = path.extname(filePath);


            if (['.html', '.css', '.js'].includes(ext)) {
        const relativePath = filePath.replace(__dirname, '');
        console.log(`⏳ Minification : ${relativePath} ...`);

        const content = await fs.readFile(filePath, 'utf-8');
        let minified = content;

        try {
            if (ext === '.html') {
                minified = await minifyHtml(content, {
                    collapseWhitespace: true,
                    removeComments: true,
                    minifyJS: true,
                    minifyCSS: true
                });
            } else if (ext === '.css') {
                const output = new CleanCSS({}).minify(content);
                minified = output.styles;
            } else if (ext === '.js') {
                const result = await minifyJs(content);
                minified = result.code;
            }


                                    await fs.writeFile(filePath, minified, 'utf-8');
            console.log(`✅ Succès : ${relativePath}`);

                    } catch (err) {
            console.error(`❌ Erreur sur ${relativePath} :`, err.message);
        }
    }
}

build();