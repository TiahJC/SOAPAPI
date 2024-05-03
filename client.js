const soap = require('soap');
const fs = require('fs');
const https = require('https');

// Load client SSL certificate and key
const clientOptions = {
  key: fs.readFileSync('../SysB.key'), // Server's private key
  cert: fs.readFileSync('../SysB.pem'), // Server's certificate
  requestCert: false, // Request client certificate
  ca: [fs.readFileSync('../RootCA.pem')],
};
const wsdlOptions = {
  rejectUnauthorized: false
}

// URL of the SOAP service
const url = 'https://localhost:8000/userdatabase?wsdl';

// Create SOAP client with SSL options
soap.createClient(url, { https: clientOptions, wsdl_options: wsdlOptions }, function(err, client) {
  if (err) {
    console.error('Error creating SOAP client:', err);
    return;
  }
  const id = 1;
  // Call the GetWeather operation
  client.GetUserByID  ({ id: id }, function(err, result) {
    if (err) {
      console.error('Error calling GetUserByID:', err);
      return;
    }

    console.log('Username:', result.username);
    console.log('Password:', result.password);
  });
});