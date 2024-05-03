const soap = require('soap');
const express = require('express'); 
const https = require("https")
const fs = require('fs');
const usersData = JSON.parse(fs.readFileSync('users.json','utf8'));

const wsdl = fs.readFileSync('./userdatabase.wsdl','utf8');
const app = express();
const endpoint = '/userdatabase';

// Define the service implementation
const service = {
  UserDatabaseService: {
    UserDatabasePort: {
      GetUserByID: function(args, callback) {
        // Perform the logic to get the weather based on the location
        const { id } = args;
        const user = usersData.find(user => user.id === id);

        // Return the response
        if (user) {
          callback(null, { username: user.username, password: user.password });
        } else {
          callback(new Error('User not found'));
        }
    }
  }
}
};
const options = {
  key: fs.readFileSync('../SysB.key'), // Server's private key
  cert: fs.readFileSync('../SysB.pem'), // Server's certificate
  requestCert: false, // Request client certificate
  ca: [fs.readFileSync('../RootCA.pem')], // Array of trusted client certificates
};

// Create the HTTPS server
const httpsServer = https.createServer(options, app);
//chatgpt
const soapOptions = {
  path: endpoint,
  services: service,
  xml: wsdl
};
soap.listen(app,soapOptions);
const port = 8000;
httpsServer.listen(port,()=>{
  console.log(`https://localhost:${port}${endpoint}?wsdl`)
});
// Create the SOAP server
// const xmls = fs.readFileSync('weatherService.xml', 'utf8');
// const server = soap.listen({ path: '/weather', xml: xmls }, function() {
//   console.log('SOAP server running at http://localhost:8000/weather?wsdl');
// });

// // Attach the service implementation to the SOAP server
// server.addService(xml, service, { suppressStack: true });