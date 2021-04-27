

const nodemailer = require('nodemailer');
const csv = require('csvtojson');

const Fs = require('fs');
const CsvReadableStream = require('csv-reader');



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sales@bcodesolutions.com',
        pass: 'Code202!' // naturally, replace both with your real credentials or an application-specific password
    }
});

function readCSv(){
    count = 0;
    const path  = __dirname + "/csv/Prueba Uhoo.csv";

    let inputStream = Fs.createReadStream(path, 'utf8');
    var name = undefined;
    var email = undefined;
    inputStream
    .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', function (row) {
        if (count % 2 == 0) {
            name = row[0];
        }
        else{
            email = row[0];
            sendEmail(name, email);
        }
        count ++;
    })
    .on('end', function (data) {
        console.log('No more rows!');
    });
 
}

readCSv();

function sendEmail(name, email){
    console.log("User", name, ",",email);
    transporter.sendMail({
        from: 'sales@bcodesolutions.com', // sender address
        to: [email], // list of receivers
        subject: '¡Te escuchamos ' + name + '!', // Subject line
        html: '<div height: 100em"><h2>¡Buenas tardes, ' + name + '!</h2><img src="cid:uhoo"><h4>Juan Ardila S.</h4><h4>Uhoo Sales Representative</h4><h4>Cel: 317 680 7256</h4></div>',
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