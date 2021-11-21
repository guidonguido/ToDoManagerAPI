'use strict'

const PROTO_PATH = './utils/protos/conversion.proto';

var grpc = require('@grpc/grpc-js');
const { ChildLoadBalancerHandler } = require('@grpc/grpc-js/build/src/load-balancer-child-handler');
var protoLoader = require('@grpc/proto-loader');
var fs = require("fs");

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    }
);
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// stub constructor is in the conversion namespace: protoDescriptor.conversion.Converter.service 
var conversion = protoDescriptor.conversion;
var client = new conversion.Converter('localhost:50051', grpc.credentials.createInsecure());

// Call service method
function runFileConvert( imagePath, file_type_origin, file_type_target ){
    return new Promise( (resolve, reject) => {
        
        // call implements Duplex, hence it can be used to read AND write messages
        var call = client.fileConvert();

        const destinationPath =  '' + imagePath.slice(0,-3) + file_type_target;
        var conversionReply_file = fs.createWriteStream(destinationPath);
        
        call.on('data', function(conversionReply){
            if( conversionReply.meta ){
                if ( conversionReply.meta.success ) {
                    console.log("Server convertion success, receiving converted file \n . . . ");
                } else {
                    reject( conversionReply.meta.error );
                }
            }
            else if( conversionReply.file ){
                conversionReply_file.write(conversionReply.file, (e) =>{if (e) {console.log("Error writing file chunk", e); reject(e)}} );
            }
        });

        // Server has finished sending the file
        call.on('end', function(){
            // Elaborate conversionReply
            console.log("Server convertion success, file received succesfully \n");
            conversionReply_file.close( () => resolve(conversionReply_file.path) );
        });

        // Server encountered and error while converting
        call.on('error', function(e) {
            // An error has occurred and the stream has been closed.
            console.log("gRPC server error: ", e);
            reject(e);
        });

        
        var meta = {
            file_type_origin: file_type_origin,
            file_type_target: file_type_target
        }

        console.log("Client has started sending\n . . .");
        call.write({meta: meta});
        
        fs.open(imagePath, 'r', (err, fd) => {
            if (err) {
              if (err.code === 'ENOENT') {
                console.error('source file does not exist');
                reject(err);
              }
              console.error('source file opening error');
              reject(err);
            }
            try {
                var readStream = fs.createReadStream(imagePath,{ highWaterMark: 1 * 1024});

                readStream
                .on('data', function(chunk) {
                    // Client sends file chunk
                    call.write({file: chunk}); })
                .on('end', function() {
                    // Client has finished sending
                    call.end();
                    console.log("Client finished sending the file");
                    });
            } finally {
              fs.close(fd, (err) => {
                if (err) {
                    console.log("Error closing source file");
                    reject(err);
                }
              });
            }
          });
          
    })
}




exports.convertImage = function(imagePath, file_type_origin, file_type_target) {
    return runFileConvert(imagePath, file_type_origin, file_type_target);
}