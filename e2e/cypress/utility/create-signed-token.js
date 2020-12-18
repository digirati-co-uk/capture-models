const { readFileSync } = require('fs');
const path = require('path');

const { JWT, JWK } = require('jose');

const key = JWK.asKey(readFileSync(path.join(__dirname, '..', '..', 'test-key', 'test.key')));

async function createSignedToken(req) {
  try {
    return JWT.sign(
      {
        scope: req.scope ? req.scope.join(' ') : undefined,
        iss_name: req.site ? req.site.name : undefined,
        name: req.user.name,
      },
      key,
      {
        subject: `urn:madoc:user:${req.user.id}`,
        issuer: `urn:madoc:site:${req.site.id}`,
        header: {
          typ: 'JWT',
          alg: 'RS256',
        },
        expiresIn: `${req.expiresIn}s`,
      }
    );
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

module.exports = createSignedToken;
