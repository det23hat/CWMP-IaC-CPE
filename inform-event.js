const http = require('http');
var config_complete = 0;

function main(){
    if(config_complete === 0){
        inform_boot();
    }else{
        inform_periodic();
    }
}

setInterval(main, 300000);

async function inform_periodic(){
    var options = {
      host: '192.168.33.10',
      path: '/inform/2',
      port: '5001',
      method: 'POST'
    };
  
    callback = function(response) {
      var str = ''
      response.on('data', function (chunk) {
        str += chunk;
      });
    
      response.on('end', function () {
        console.log(str);
      });
    }

    get_parameter_info.then(()=>{
        var req = http.request(options, callback);
        let body = JSON.stringify({
          parameter: parameterList
        });
            console.log(body)
            console.log("new ver 1.2")
            req.write(body);
            req.end();
      }).catch((err) => {
            console.log(err)
            console.log("failed to get parameter info");
    })
}

async function inform_boot(){
    var options = {
        host: '192.168.33.10',
        path: '/inform/1',
        port: '5001',
        method: 'POST'
    };
    callback = function(response) {
        var str = ''
        response.on('data', function (chunk) {
            let result = JSON.parse(chunk);
            console.log(`config result = ${result.config_result}`)
            config_complete = result.config_result;
        });
      
        response.on('end', function () {
          console.log(str);
        });
    }
      var req = http.request(options, callback);
      let connection_info = JSON.stringify({
        host_mac_addr : process.env.MAC,
        ansible_ssh_host : process.env.HOSTNAME,
    })
        req.write(connection_info);
        req.end();
}

const get_parameter_info = new Promise((resolve, reject)=> {
    fs.createReadStream('../parameter/parameter.csv')
    .pipe(csv())
    .on('data', function (row) { 
      if(row.notification != 0){
  
        let parameter ={
          parameter_name: row.name,
          parameter_value: row.value,
          parameter_parent: row.parameter
        }
        console.log(JSON.stringify(parameter))
        parameterList.push(parameter);
      }
      
    })
    .on('end', () => {
      resolve()
    });
});