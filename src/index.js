const rp = require('request-promise-native');
const fs = require('fs-extra');
const config = require('config');

const base64Encode = async (file) => {
    const bitmap = await fs.readFile(file);
    return new Buffer(bitmap).toString('base64');
}

/* 
person walks in
picture is taken
try to recognise person
if match found
    save new image under persons name
    get and save klout score
    display details to attendent

else
    ask for name
    picture is shown to attendent with possible names of person and selects one *or* types in the name
    save new image under persons name
    get and save klout score
    display details to attendent


Offer discount to customers if they 'like' facebook page to link photos to social media 
*/

const getAllFileNamesFromDirectory = async (path) => await fs.readdir(path);

const getKariosInfo = async (endpoint, body) => await rp({
    method: 'POST',
    uri: `https://api.kairos.com/${endpoint}`,
    contentType: 'application/json',
    headers: {
        app_id: config.get('Karios.apiId'),
        app_key: config.get('Karios.apiKey')
    },
    body: body,
    json: true
});

const callKarios = async (imagesBaseDirectory, type, getBody) => {
    const fileNames = await getAllFileNamesFromDirectory(imagesBaseDirectory);
    fileNames
        .filter(p => p.split('.').pop().toLowerCase() === 'jpg')
        .forEach(filename => callKariosInternal(imagesBaseDirectory, filename, type, getBody));
}

const callKariosInternal = async (imagesBaseDirectory, filename, type, getBody) => {
    const imageData = await base64Encode(`${imagesBaseDirectory}\\${filename}`);
    const response = await getKariosInfo(type, getBody(imageData));
    await fs.writeJson(`${imagesBaseDirectory}\\data\\${filename}_${type}.json`, response, { spaces: 2 });
}

// use upload ed_image_url to not upload images again
try {
    const imagesDirectory = __dirname + "\\images\\";
    enroll(imagesDirectory);
    verify(imagesDirectory);
    recognize(imagesDirectory);
    detect(imagesDirectory);
} catch (error) {
    console.log(error)
}


function detect(imagesDirectory) {
    const detectBody = (imageData) => {
        return {
            image: imageData,
            selector: "ROLL"
        };
    };
    callKarios(imagesDirectory, 'detect', detectBody);
}

function recognize(imagesDirectory) {
    const recognizeBody = (imageData) => {
        return {
            image: imageData,
            gallery_name: "MyFirstGallery"
        };
    };
    callKarios(imagesDirectory, 'recognize', recognizeBody);
}

function verify(imagesDirectory) {
    const verifyBody = (imageData) => {
        return {
            image: imageData,
            subject_id: 'Stuart Tottle',
            gallery_name: "MyFirstGallery"
        };
    };
    callKarios(imagesDirectory, 'verify', verifyBody);
}

function enroll(imagesDirectory) {
    const enrollBody = (imageData) => {
        return {
            image: imageData,
            subject_id: 'Stuart Tottle',
            gallery_name: "MyFirstGallery"
        };
    };
    callKarios(imagesDirectory, 'enroll', enrollBody);
}

