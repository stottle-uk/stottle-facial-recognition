const rp = require('request-promise-native');
const fs = require('fs-extra');

// function to encode file data to base64 encoded string
const base64_encode = (file) => {
    const bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

const detectImage = async (optons) => {
    let response = await rp(optons);
    await fs.writeJson(__dirname + '\\result.txt', response, { spaces: 2 });
    return response;
}

const body = { image: base64_encode(__dirname + "\\images\\PIC00113.JPG"), selector: 'roll' };

const rpOptions = {
    method: 'POST',
    uri: 'http://api.kairos.com/detect',
    headers: {
        app_id: '83d919bc',
        app_key: '9c32a38c7738cc8f1c86e77b310d24bb'
    },
    body: body,
    json: true
};

let t = detectImage(rpOptions);
