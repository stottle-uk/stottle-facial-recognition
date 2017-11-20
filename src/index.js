var rp = require('request-promise-native');

const detectImage = async (optons) => {
    let response = await rp(optons);
    console.log(response);
    return response;
}

const rpOptions = {
    method: 'POST',
    uri: 'http://api.kairos.com/detect',
    headers: {
        app_id: '83d919bc',
        app_key: '9c32a38c7738cc8f1c86e77b310d24bb'
    },
    body: { image: 'https://media.kairos.com/liz.jpg', selector: 'roll' },
    json: true
};

let t = detectImage(rpOptions);
