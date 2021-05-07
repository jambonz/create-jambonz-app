const router = require('express').Router();
const credentials = require('../../../data/credentials.json');

/**
 * we are using a simple in-memory database as an example
 * but in real-life presumably you would store credentials in
 * a database of some sort..
 */
router.post('/', async(req, res) => {
  const {logger, calculateResponse} = req.app.locals;
  try {
    const {realm, username} = req.body;
    const myUsers = credentials[realm];

    if (!myUsers) {
      logger.info(`rejecting auth attempt for unknown realm ${realm}`);
      return res.status(200).json({status: 'fail', msg: 'invalid sip realm'});
    }

    const password = myUsers[username];
    if (!password) {
      logger.info(`rejecting auth attempt for unknown user ${username}@${realm}`);
      return res.status(200).json({status: 'fail', msg: 'unknown user'});
    }
    const myResponse = calculateResponse(req.body, password);
    if (myResponse === req.body.response) {
      logger.info({payload: req.body}, 'sip user successfully authenticated');
      return res.json({status: 'ok'});
    }
    logger.info(`invalid password supplied for ${username}`);
    return res.status(200).json({status: 'fail', msg: 'invalid password'});
  } catch (err) {
    logger.error({err}, 'Error authenticating');
    res.send({status: 'fail', msg: err.message});
  }
});

module.exports = router;
