const rp = require('request-promise-native');
const fs = require('fs-extra');

const base64Encode = async (file) => {
    const bitmap = await fs.readFile(file);
    return new Buffer(bitmap).toString('base64');
}

const getAllFileNamesFromDirectory = async (path) => await fs.readdir(path);

const getKariosInfo = async (url, body) => await rp({
    method: 'POST',
    uri: `https://api.kairos.com/${url}`,
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

const detect = async (imagesBase, type, getBody) => {
    const fileNames = await getAllFileNamesFromDirectory(imagesBase);
    fileNames
        .filter(p => p.split('.').pop().toLowerCase() === 'jpg')
        .forEach(filename => doWork(imagesBase, filename, type, getBody));
}

const doWork = async (imagesBase, filename, type, getBody) => {
    const imageData = await base64Encode(`${imagesBase}\\${filename}`);
    const response = await getKariosInfo(type, getBody(imageData));
    await fs.writeJson(`${imagesBase}\\data\\${filename}_${type}.json`, response, { spaces: 2 });
}

// use upload ed_image_url to not upload images again
try {
    const path = __dirname + "\\images\\";
    //enroll(path);
    //verify(path);
    //recognize(path);

    const body = (imageData) => {
        return {
            image: imageData,
            selector: "ROLL"
        }
    };

    detect(path, 'detect', body)
} catch (error) {
    console.log(error)
}


