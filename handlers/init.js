'use strict';


function bodyIsValid(body) {
    if(!body || !body.id || !body.url) {
        console.log('Received body is not valid!')
        return false;
    }

    return true;
}

function handler(signalerList) {
    return (req, res) => {

        if (!bodyIsValid(req.body)) {
            res.status(400);
        }

        signalerList.update(req.body);
        res.send('Signaller successfully added.');
        console.log(`Added signaler with id: ${req.body.id}`);
    };
}

module.exports = {
        handler
}
