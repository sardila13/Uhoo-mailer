

const nodemailer = require('nodemailer');
const csv = require('csvtojson');

const Fs = require('fs');
const CsvReadableStream = require('csv-reader');



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sales@bcodesolutions.com',
        pass: 'LAbm2U**' // naturally, replace both with your real credentials or an application-specific password
    }
});
var sent = 0;
var errors = [];

function readCSv(){
    count = 0;
    const path  = __dirname + "/csv/Prueba Uhoo.csv";

    let inputStream = Fs.createReadStream(path, 'utf8');
    var name = undefined;
    var email = undefined;
    var sent = 0;
    var subject = "El secreto de la productividad está en la felicidad de tus colaboradores, conoce Uhoo 🙌🏻.";
    inputStream
    .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', function (row) {
        if (count % 2 == 0) {
            name = row[0];
            if(sent % 2 == 0){
                subject = "El secreto de la productividad está en la felicidad de tus colaboradores, conoce Uhoo 🙌🏻.";
            }
            else{
                subject = 'Ábrele la puerta 🚪 al bienestar en ' + name + '.'
            }
        }
        else{
            email = row[0];
            subject = 
            sendEmail(name, email, subject);
            sent++;
        }
        count ++;
    })
    .on('end', function (data) {
        console.log('No more rows!');
    });
 
}

readCSv();

function sendEmail(name, email, subject){
    console.log("User", name, ",",email,",",subject);
    transporter.sendMail({
        from: 'sales@bcodesolutions.com', // sender address
        to: [email], // list of receivers
        subject: subject, // Subject line
        html: '<div height: 100em"><h2>¡Hola, ' + name + '!</h2><a href="https://landing.uhoo.io/"><img src="cid:uhoo"></a><h4>Juan Ardila S.</h4><h4>Uhoo Sales Representative</h4><h4>Cel: 317 680 7256</h4></div>',
        attachments: [{
            filename: 'Uhoo.png',
            path: __dirname +'/img/Uhoo.png',
            cid: 'uhoo' //my mistake was putting "cid:logo@cid" here! 
       }]
    }, function (err, info) {
        sent++;
        if(err){
            console.log(err);
        }
        else{
            console.log(info);
        }
    })
}

/*transporter.sendMail({
    from: 'sales@bcodesolutions.com', // sender address
    to: ['juan2000ardila@hotmail.com','j.ardilasilva.ab@gmail.com','sardila9623@gmail.com'], // list of receivers
    cc: 'Test',
    subject: 'subject', // Subject line
    html: '<div height: 100em"><h2>¡Buenas tardes, (nombre empresa)!</h2><img src="cid:uhoo"><h4>Juan Ardila S.</h4><h4>Uhoo Sales Representative</h4><h4>Cel: 317 680 7256</h4></div>',
    attachments: [{
        filename: 'Uhoo.png',
        path: __dirname +'/img/Uhoo.png',
        cid: 'uhoo' //my mistake was putting "cid:logo@cid" here! 
   }]
}, function (err, info) {
    if(err)
    console.log(err)
    else{
        console.log(info);
    }
})*/