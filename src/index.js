const rp = require('request-promise-native');
const fs = require('fs-extra');

// function to encode file data to base64 encoded string
const base64Encode = async (file) => {
    const bitmap = await fs.readFile(file);
    return new Buffer(bitmap).toString('base64');
}

const getAllFileNamesFromDirectory = async (path) => await fs.readdir(path);

const getKariosInfo = async (url, body) => await rp({
    method: 'POST',
    uri: url,
    headers: {
        app_id: '83d919bc',
        app_key: '9c32a38c7738cc8f1c86e77b310d24bb'
    },
    body: body,
    json: true
});

const go = async (imagesBase) => {

    const fileNames = await getAllFileNamesFromDirectory(imagesBase);

    fileNames
        .filter(p => p.split('.').pop().toLowerCase() === 'jpg')
        .forEach(async filename => {
            const imageData = await base64Encode(`${imagesBase}\\${filename}`);
            const body = { image: imageData, subject_id: 'Stuart Tottle', gallery_name: "MyFirstGallery" };
            const response = await getKariosInfo('https://api.kairos.com/enroll', body)
            await fs.writeJson(`${imagesBase}\\data\\${filename}.json`, response, { spaces: 2 });
        });

}

try {
    go(__dirname + "\\images\\");
} catch (error) {
    console.log(error)
}


