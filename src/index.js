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
    contentType: 'application/json',
    headers: {
        app_id: '83d919bc',
        app_key: '9c32a38c7738cc8f1c86e77b310d24bb'
    },
    body: body,
    json: true
});

const enroll = async (imagesBase) => {

    const fileNames = await getAllFileNamesFromDirectory(imagesBase);

    fileNames
        .filter(p => p.split('.').pop().toLowerCase() === 'jpg')
        .forEach(async filename => {
            const imageData = await base64Encode(`${imagesBase}\\${filename}`);
            const body = { image: imageData, subject_id: 'Stuart Tottle', gallery_name: "MyFirstGallery" };
            const response = await getKariosInfo('https://api.kairos.com/enroll', body)
            await fs.writeJson(`${imagesBase}\\data\\${filename}_enroll.json`, response, { spaces: 2 });
        });
}

const verify = async (imagesBase) => {

    const fileNames = await getAllFileNamesFromDirectory(imagesBase);

    fileNames
        .filter(p => p.split('.').pop().toLowerCase() === 'jpg')
        .forEach(async filename => {
            const imageData = await base64Encode(`${imagesBase}\\${filename}`);
            const body = { image: imageData, subject_id: 'Stuart Tottle', gallery_name: "MyFirstGallery" };
            const response = await getKariosInfo('https://api.kairos.com/verify', body)
            await fs.writeJson(`${imagesBase}\\data\\${filename}_verify.json`, response, { spaces: 2 });
        });
}

const recognize = async (imagesBase) => {

    const fileNames = await getAllFileNamesFromDirectory(imagesBase);

    fileNames
        .filter(p => p.split('.').pop().toLowerCase() === 'jpg')
        .forEach(async filename => {
            const imageData = await base64Encode(`${imagesBase}\\${filename}`);
            const body = { image: imageData, gallery_name: "MyFirstGallery" };
            const response = await getKariosInfo('https://api.kairos.com/recognize', body)
            await fs.writeJson(`${imagesBase}\\data\\${filename}_recognize.json`, response, { spaces: 2 });
        });
}

const detect = async (imagesBase) => {

    const fileNames = await getAllFileNamesFromDirectory(imagesBase);

    fileNames
        .filter(p => p.split('.').pop().toLowerCase() === 'jpg')
        .forEach(async filename => {
            const imageData = await base64Encode(`${imagesBase}\\${filename}`);
            const body = { image: imageData, selector: "ROLL" };
            const response = await getKariosInfo('https://api.kairos.com/detect', body)
            await fs.writeJson(`${imagesBase}\\data\\${filename}_detect.json`, response, { spaces: 2 });
        });
}

// use upload ed_image_url to not upload images again
try {
    const path = __dirname + "\\images\\";
    enroll(path);
    verify(path);
    recognize(path);
    detect(path)
} catch (error) {
    console.log(error)
}


