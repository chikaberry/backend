// const { expressjwt } = require('express-jwt');

//     function authjwt() {
//     const secret = process.env.secret;
//     const api = process.env.API_URL;
//     return expressjwt({
//         secret,
//         algorithms: ['HS256'],
//         isRevoked: isRevoked
//     }).unless({
//         path: [
//             //   { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
//             // {url: /\/api\/v2\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
//             // {url: /\/api\/v2\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
//             //  `${api}/users/login`,
//             //  `${api}/users/register`,
//            {url: /(.*)/};
//         ],
//    })
//     }


//     async function isRevoked(req, payload, done) {
//         if(!payload.isAdmin) {
//             done(null, true)
//         }
   
//        done();
//     }




// module.exports = authjwt