

const nodemailer = require('nodemailer');
const csv = require('csvtojson');

const Fs = require('fs');
const CsvReadableStream = require('csv-reader');



var transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
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
    var emails = [];
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
            sent++;
            emails.push({name: name, email:email, subject:subject})
        }
        count ++;
    })
    .on('end', function (data) {
        console.log('No more rows!');
        //console.log(emails)
        sendEmail(emails);
    });
 
}

readCSv();

async function sendEmail(array){
    
    var offset = 0;
    await Promise.all(array.map(async (element) => {
        console.log("User", element.name, ",",element.email,",",element.subject);

        setTimeout(() => {
            console.log("Sending email to", element.name)
            transporter.sendMail({
                from: 'sales@bcodesolutions.com', // sender address
                to: [element.email], // list of receivers
                subject: element.subject, // Subject line
                html: '<div height: 100em"><h2>¡Hola, ' + element.name + '!</h2><a href="https://landing.uhoo.io/"><img src="cid:uhoo"></a><h4>Juan Ardila S.</h4><h4>Uhoo Sales Representative</h4><h4>Cel: 317 680 7256</h4></div>',
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
        }, 1000 + offset);
        offset += 1000;
    }))
    .then(values => {
        console.log("Closing mailer")
    })
    
    /*array.forEach(element => {
        console.log("User", element.name, ",",element.email,",",element.subject);
        
    });*/
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