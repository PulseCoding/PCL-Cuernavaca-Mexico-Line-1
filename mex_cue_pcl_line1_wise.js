var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');

var secPubNub=0;

var Rotobotct = null,
    Rotobotresults = null,
    CntOutRotobot = null,
    Rotobotactual = 0,
    Rotobottime = 0,
    Rotobotsec = 0,
    RotobotflagStopped = false,
    Rotobotstate = 0,
    Rotobotspeed = 0,
    RotobotspeedTemp = 0,
    RotobotflagPrint = 0,
    RotobotsecStop = 0,
    RotobotdeltaRejected = null,
    RotobotONS = false,
    RotobottimeStop = 60, //NOTE: Timestop
    RotobotWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    RotobotflagRunning = false;
var Fillerct = null,
    Fillerresults = null,
    Filleractual = 0,
    Fillertime = 0,
    Fillersec = 0,
    FillerflagStopped = false,
    Fillerstate = 0,
    Fillerspeed = 0,
    FillerspeedTemp = 0,
    FillerflagPrint = 0,
    FillersecStop = 0,
    FillerdeltaRejected = null,
    FillerONS = false,
    FillertimeStop = 60, //NOTE: Timestop
    FillerWorktime = 0.95, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    FillerflagRunning = false,
    FillerRejectFlag = false,
    FillerReject,
    FillerVerify = (function(){
      try{
        FillerReject = fs.readFileSync('FillerRejected.json')
        if(FillerReject.toString().indexOf('}') > 0 && FillerReject.toString().indexOf('{\"rejected\":') != -1){
          FillerReject = JSON.parse(FillerReject)
        }else{
          throw 12121212
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('FillerRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
          FillerReject = {
            rejected : 0
          }
        }
      }
    })(),
    CntOutFiller=null,
    CntInFiller=null;
var CoolingTunelct = null,
    CoolingTunelresults = null,
    CntInCoolingTunel = null,
    CoolingTunelactual = 0,
    CoolingTuneltime = 0,
    CoolingTunelsec = 0,
    CoolingTunelflagStopped = false,
    CoolingTunelstate = 0,
    CoolingTunelspeed = 0,
    CoolingTunelspeedTemp = 0,
    CoolingTunelflagPrint = 0,
    CoolingTunelsecStop = 0,
    CoolingTuneldeltaRejected = null,
    CoolingTunelONS = false,
    CoolingTuneltimeStop = 60, //NOTE: Timestop
    CoolingTunelWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CoolingTunelflagRunning = false;
var PlugSupplierct = null,
    PlugSupplierresults = null,
    CntInPlugSupplier = null,
    PlugSupplieractual = 0,
    PlugSuppliertime = 0,
    PlugSuppliersec = 0,
    PlugSupplierflagStopped = false,
    PlugSupplierstate = 0,
    PlugSupplierspeed = 0,
    PlugSupplierspeedTemp = 0,
    PlugSupplierflagPrint = 0,
    PlugSuppliersecStop = 0,
    PlugSupplierdeltaRejected = null,
    PlugSupplierONS = false,
    PlugSuppliertimeStop = 60, //NOTE: Timestop
    PlugSupplierWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    PlugSupplierflagRunning = false;
var Capperct = null,
    Capperresults = null,
    Capperactual = 0,
    Cappertime = 0,
    Cappersec = 0,
    CapperflagStopped = false,
    Capperstate = 0,
    Capperspeed = 0,
    CapperspeedTemp = 0,
    CapperflagPrint = 0,
    CappersecStop = 0,
    CapperdeltaRejected = null,
    CapperONS = false,
    CappertimeStop = 60, //NOTE: Timestop
    CapperWorktime = 0.95, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CapperflagRunning = false,
    CapperRejectFlag = false,
    CapperReject,
    CapperVerify = (function(){
      try{
        CapperReject = fs.readFileSync('CapperRejected.json')
        if(CapperReject.toString().indexOf('}') > 0 && CapperReject.toString().indexOf('{\"rejected\":') != -1){
          CapperReject = JSON.parse(CapperReject)
        }else{
          throw 12121212
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('CapperRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
          CapperReject = {
            rejected : 0
          }
        }
      }
    })(),
    CntInCapper=null,
    CntOutCapper=null;
var Labellerct = null,
    Labellerresults = null,
    CntInLabeller = null,
    CntOutLabeller = null,
    Labelleractual = 0,
    Labellertime = 0,
    Labellersec = 0,
    LabellerflagStopped = false,
    Labellerstate = 0,
    Labellerspeed = 0,
    LabellerspeedTemp = 0,
    LabellerflagPrint = 0,
    LabellersecStop = 0,
    LabellerdeltaRejected = null,
    LabellerONS = false,
    LabellertimeStop = 60, //NOTE: Timestop
    LabellerWorktime = 0.95, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    LabellerflagRunning = false,
    LabellerRejectFlag = false,
    LabellerReject,
    LabellerVerify = (function(){
      try{
        LabellerReject = fs.readFileSync('LabellerRejected.json')
        if(LabellerReject.toString().indexOf('}') > 0 && LabellerReject.toString().indexOf('{\"rejected\":') != -1){
          LabellerReject = JSON.parse(LabellerReject)
        }else{
          throw 12121212
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('LabellerRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
          LabellerReject = {
            rejected : 0
          }
        }
      }
    })();
var CasePackerct = null,
    CasePackerresults = null,
    CntOutCasePacker = null,
    CasePackeractual = 0,
    CasePackertime = 0,
    CasePackersec = 0,
    CasePackerflagStopped = false,
    CasePackerstate = 0,
    CasePackerspeed = 0,
    CasePackerspeedTemp = 0,
    CasePackerflagPrint = 0,
    CasePackersecStop = 0,
    CasePackerdeltaRejected = null,
    CasePackerONS = false,
    CasePackertimeStop = 60, //NOTE: Timestop
    CasePackerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CasePackerflagRunning = false;
var CheckWeigherct = null,
    CheckWeigherresults = null,
    CntInCheckWeigher = null,
    CntOutCheckWeigher = null,
    CheckWeigheractual = 0,
    CheckWeighertime = 0,
    CheckWeighersec = 0,
    CheckWeigherflagStopped = false,
    CheckWeigherstate = 0,
    CheckWeigherspeed = 0,
    CheckWeigherspeedTemp = 0,
    CheckWeigherflagPrint = 0,
    CheckWeighersecStop = 0,
    CheckWeigherdeltaRejected = null,
    CheckWeigherONS = false,
    CheckWeighertimeStop = 60, //NOTE: Timestop
    CheckWeigherWorktime = 0.95, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CheckWeigherflagRunning = false,
    CheckWeigherRejectFlag = false,
    CheckWeigherReject,
    CheckWeigherVerify = (function(){
      try{
        CheckWeigherReject = fs.readFileSync('CheckWeigherRejected.json')
        if(CheckWeigherReject.toString().indexOf('}') > 0 && CheckWeigherReject.toString().indexOf('{\"rejected\":') != -1){
          CheckWeigherReject = JSON.parse(CheckWeigherReject)
        }else{
          throw 12121212
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('CheckWeigherRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
          CheckWeigherReject = {
            rejected : 0
          }
        }
      }
    })();

var CntOutEOL=null,
    secEOL=0;
var id1,id2,id3;
var files = fs.readdirSync("C:/PULSE/L1_LOGS/"); //Leer documentos
var text2send=[];//Vector a enviar
var i=0;
  var publishConfig;


var pubnub = new PubNub({
  publishKey:   "pub-c-8d024e5b-23bc-4ce8-ab68-b39b00347dfb",
  subscribeKey:     "sub-c-c3b3aa54-b44b-11e7-895e-c6a8ff6a3d85",
  uuid: "CUE_PCL_LINE1"
});


var senderData = function (){
    pubnub.publish(publishConfig, function(status, response) {
  });
};


var client1 = modbus.client.tcp.complete({
  'host': "192.168.10.90",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});
var client2 = modbus.client.tcp.complete({
  'host': "192.168.10.91",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});
var client3 = modbus.client.tcp.complete({
  'host': "192.168.10.92",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});

  /*----------------------------------------------------------------------------------Rotobot-------------------------------------------------------------------------------------------*/
  client1.connect();
  client2.connect();
  client3.connect();



  var joinWord=function(num1, num2) {
    var bits = "00000000000000000000000000000000";
    var bin1 = num1.toString(2),
      bin2 = num2.toString(2),
      newNum = bits.split("");

    for (i = 0; i < bin1.length; i++) {
      newNum[31 - i] = bin1[(bin1.length - 1) - i];
    }
    for (i = 0; i < bin2.length; i++) {
      newNum[15 - i] = bin2[(bin2.length - 1) - i];
    }
    bits = newNum.join("");
    return parseInt(bits, 2);
  };

//PubNub --------------------------------------------------------------------------------------------------------------------
    setInterval(function(){
      if(secPubNub>=60*5){

          var idle = function(){
            i=0;
            text2send=[];
            for (var k=0;k<files.length;k++){//Verificar los archivos
              var stats = fs.statSync("C:/PULSE/L1_LOGS/"+files[k]);
              var mtime = new Date(stats.mtime).getTime();
              if (mtime< (Date.now() - (15*60*1000))&&files[k].indexOf("serialbox")==-1){
                flagInfo2Send=1;
                text2send[i]=files[k];
                i++;
              }
            }
          };
          idle();
          secPubNub=0;
          publishConfig = {
            channel : "Cue_PCL_Monitor",
            message : {
                  line: "1",
                  tt: Date.now(),
                  machines:text2send

                }
          };
          senderData();
        }
        secPubNub++;
      },1000);
//PubNub --------------------------------------------------------------------------------------------------------------------


client1.on('connect', function(err) {
    id1=setInterval(function(){
        client1.readHoldingRegisters(0, 16).then(function(resp) {
          CntOutRotobot = joinWord(resp.register[0], resp.register[1]);
          CntInFiller = joinWord(resp.register[2], resp.register[3]);
          CntOutFiller = joinWord(resp.register[4], resp.register[5]);
          CntInCoolingTunel =  joinWord(resp.register[6], resp.register[7]);

        //------------------------------------------Rotobot----------------------------------------------
              Rotobotct = CntOutRotobot // NOTE: igualar al contador de salida
              if (!RotobotONS && Rotobotct) {
                RotobotspeedTemp = Rotobotct
                Rotobotsec = Date.now()
                RotobotONS = true
                Rotobottime = Date.now()
              }
              if(Rotobotct > Rotobotactual){
                if(RotobotflagStopped){
                  Rotobotspeed = Rotobotct - RotobotspeedTemp
                  RotobotspeedTemp = Rotobotct
                  Rotobotsec = Date.now()
                  RotobotdeltaRejected = null
                  RotobotRejectFlag = false
                  Rotobottime = Date.now()
                }
                RotobotsecStop = 0
                Rotobotstate = 1
                RotobotflagStopped = false
                RotobotflagRunning = true
              } else if( Rotobotct == Rotobotactual ){
                if(RotobotsecStop == 0){
                  Rotobottime = Date.now()
                  RotobotsecStop = Date.now()
                }
                if( ( Date.now() - ( RotobottimeStop * 1000 ) ) >= RotobotsecStop ){
                  Rotobotspeed = 0
                  Rotobotstate = 2
                  RotobotspeedTemp = Rotobotct
                  RotobotflagStopped = true
                  RotobotflagRunning = false
                  RotobotflagPrint = 1
                }
              }
              Rotobotactual = Rotobotct
              if(Date.now() - 60000 * RotobotWorktime >= Rotobotsec && RotobotsecStop == 0){
                if(RotobotflagRunning && Rotobotct){
                  RotobotflagPrint = 1
                  RotobotsecStop = 0
                  Rotobotspeed = Rotobotct - RotobotspeedTemp
                  RotobotspeedTemp = Rotobotct
                  Rotobotsec = Date.now()
                }
              }
              Rotobotresults = {
                ST: Rotobotstate,
                CPQO : CntOutRotobot,
                SP: Rotobotspeed
              }
              if (RotobotflagPrint == 1) {
                for (var key in Rotobotresults) {
                  if( Rotobotresults[key] != null && ! isNaN(Rotobotresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L1_LOGS/CUE_PCL_Rotobot_l1.log', 'tt=' + Rotobottime + ',var=' + key + ',val=' + Rotobotresults[key] + '\n')
                }
                RotobotflagPrint = 0
                RotobotsecStop = 0
                Rotobottime = Date.now()
              }
        //------------------------------------------Rotobot----------------------------------------------
        //------------------------------------------Filler----------------------------------------------
              Fillerct = CntOutFiller // NOTE: igualar al contador de salida
              if (!FillerONS && Fillerct) {
                FillerspeedTemp = Fillerct
                Fillersec = Date.now()
                FillerONS = true
                Fillertime = Date.now()
              }
              if(Fillerct > Filleractual){
                if(FillerflagStopped){
                  Fillerspeed = Fillerct - FillerspeedTemp
                  FillerspeedTemp = Fillerct
                  Fillersec = Date.now()
                  FillerdeltaRejected = null
                  FillerRejectFlag = false
                  Fillertime = Date.now()
                }
                FillersecStop = 0
                Fillerstate = 1
                FillerflagStopped = false
                FillerflagRunning = true
              } else if( Fillerct == Filleractual ){
                if(FillersecStop == 0){
                  Fillertime = Date.now()
                  FillersecStop = Date.now()
                }
                if( ( Date.now() - ( FillertimeStop * 1000 ) ) >= FillersecStop ){
                  Fillerspeed = 0
                  Fillerstate = 2
                  FillerspeedTemp = Fillerct
                  FillerflagStopped = true
                  FillerflagRunning = false
                  if(CntInFiller - CntOutFiller - FillerReject.rejected != 0 && ! FillerRejectFlag){
                    FillerdeltaRejected = CntInFiller - CntOutFiller - FillerReject.rejected
                    FillerReject.rejected = CntInFiller - CntOutFiller
                    fs.writeFileSync('FillerRejected.json','{"rejected": ' + FillerReject.rejected + '}')
                    FillerRejectFlag = true
                  }else{
                    FillerdeltaRejected = null
                  }
                  FillerflagPrint = 1
                }
              }
              Filleractual = Fillerct
              if(Date.now() - 60000 * FillerWorktime >= Fillersec && FillersecStop == 0){
                if(FillerflagRunning && Fillerct){
                  FillerflagPrint = 1
                  FillersecStop = 0
                  Fillerspeed = Fillerct - FillerspeedTemp
                  FillerspeedTemp = Fillerct
                  Fillersec = Date.now()
                }
              }
              Fillerresults = {
                ST: Fillerstate,
                CPQI : CntInFiller,
                CPQO : CntOutFiller,
                CPQR : FillerdeltaRejected,
                SP: Fillerspeed
              }
              if (FillerflagPrint == 1) {
                for (var key in Fillerresults) {
                  if( Fillerresults[key] != null && ! isNaN(Fillerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L1_LOGS/CUE_PCL_Filler_l1.log', 'tt=' + Fillertime + ',var=' + key + ',val=' + Fillerresults[key] + '\n')
                }
                FillerflagPrint = 0
                FillersecStop = 0
                Fillertime = Date.now()
              }
        //------------------------------------------Filler----------------------------------------------
        //------------------------------------------CoolingTunel----------------------------------------------
              CoolingTunelct = CntInCoolingTunel // NOTE: igualar al contador de salida
              if (!CoolingTunelONS && CoolingTunelct) {
                CoolingTunelspeedTemp = CoolingTunelct
                CoolingTunelsec = Date.now()
                CoolingTunelONS = true
                CoolingTuneltime = Date.now()
              }
              if(CoolingTunelct > CoolingTunelactual){
                if(CoolingTunelflagStopped){
                  CoolingTunelspeed = CoolingTunelct - CoolingTunelspeedTemp
                  CoolingTunelspeedTemp = CoolingTunelct
                  CoolingTunelsec = Date.now()
                  CoolingTuneldeltaRejected = null
                  CoolingTunelRejectFlag = false
                  CoolingTuneltime = Date.now()
                }
                CoolingTunelsecStop = 0
                CoolingTunelstate = 1
                CoolingTunelflagStopped = false
                CoolingTunelflagRunning = true
              } else if( CoolingTunelct == CoolingTunelactual ){
                if(CoolingTunelsecStop == 0){
                  CoolingTuneltime = Date.now()
                  CoolingTunelsecStop = Date.now()
                }
                if( ( Date.now() - ( CoolingTuneltimeStop * 1000 ) ) >= CoolingTunelsecStop ){
                  CoolingTunelspeed = 0
                  CoolingTunelstate = 2
                  CoolingTunelspeedTemp = CoolingTunelct
                  CoolingTunelflagStopped = true
                  CoolingTunelflagRunning = false
                  CoolingTunelflagPrint = 1
                }
              }
              CoolingTunelactual = CoolingTunelct
              if(Date.now() - 60000 * CoolingTunelWorktime >= CoolingTunelsec && CoolingTunelsecStop == 0){
                if(CoolingTunelflagRunning && CoolingTunelct){
                  CoolingTunelflagPrint = 1
                  CoolingTunelsecStop = 0
                  CoolingTunelspeed = CoolingTunelct - CoolingTunelspeedTemp
                  CoolingTunelspeedTemp = CoolingTunelct
                  CoolingTunelsec = Date.now()
                }
              }
              CoolingTunelresults = {
                ST: CoolingTunelstate,
                CPQI : CntInCoolingTunel,
                SP: CoolingTunelspeed
              }
              if (CoolingTunelflagPrint == 1) {
                for (var key in CoolingTunelresults) {
                  if( CoolingTunelresults[key] != null && ! isNaN(CoolingTunelresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L1_LOGS/CUE_PCL_CoolingTunel_l1.log', 'tt=' + CoolingTuneltime + ',var=' + key + ',val=' + CoolingTunelresults[key] + '\n')
                }
                CoolingTunelflagPrint = 0
                CoolingTunelsecStop = 0
                CoolingTuneltime = Date.now()
              }
        //------------------------------------------CoolingTunel----------------------------------------------

        });//Cierre de lectura

      },1000);
  });//Cierre de cliente

      client1.on('error', function(err) {
        clearInterval(id1);
      });
      client1.on('close', function() {
      	clearInterval(id1);
      });



client2.on('connect', function(err) {
          setInterval(function(){


              client2.readHoldingRegisters(0, 16).then(function(resp) {
                CntInPlugSupplier = joinWord(resp.register[0], resp.register[1]);
                CntInCapper = joinWord(resp.register[2], resp.register[3]);
                CntOutCapper = joinWord(resp.register[4], resp.register[5]);
                CntInLabeller = joinWord(resp.register[6], resp.register[7]);
                CntOutLabeller = joinWord(resp.register[8], resp.register[9]);
        //------------------------------------------PlugSupplier----------------------------------------------
              PlugSupplierct = CntInPlugSupplier // NOTE: igualar al contador de salida
              if (!PlugSupplierONS && PlugSupplierct) {
                PlugSupplierspeedTemp = PlugSupplierct
                PlugSuppliersec = Date.now()
                PlugSupplierONS = true
                PlugSuppliertime = Date.now()
              }
              if(PlugSupplierct > PlugSupplieractual){
                if(PlugSupplierflagStopped){
                  PlugSupplierspeed = PlugSupplierct - PlugSupplierspeedTemp
                  PlugSupplierspeedTemp = PlugSupplierct
                  PlugSuppliersec = Date.now()
                  PlugSupplierdeltaRejected = null
                  PlugSupplierRejectFlag = false
                  PlugSuppliertime = Date.now()
                }
                PlugSuppliersecStop = 0
                PlugSupplierstate = 1
                PlugSupplierflagStopped = false
                PlugSupplierflagRunning = true
              } else if( PlugSupplierct == PlugSupplieractual ){
                if(PlugSuppliersecStop == 0){
                  PlugSuppliertime = Date.now()
                  PlugSuppliersecStop = Date.now()
                }
                if( ( Date.now() - ( PlugSuppliertimeStop * 1000 ) ) >= PlugSuppliersecStop ){
                  PlugSupplierspeed = 0
                  PlugSupplierstate = 2
                  PlugSupplierspeedTemp = PlugSupplierct
                  PlugSupplierflagStopped = true
                  PlugSupplierflagRunning = false
                  PlugSupplierflagPrint = 1
                }
              }
              PlugSupplieractual = PlugSupplierct
              if(Date.now() - 60000 * PlugSupplierWorktime >= PlugSuppliersec && PlugSuppliersecStop == 0){
                if(PlugSupplierflagRunning && PlugSupplierct){
                  PlugSupplierflagPrint = 1
                  PlugSuppliersecStop = 0
                  PlugSupplierspeed = PlugSupplierct - PlugSupplierspeedTemp
                  PlugSupplierspeedTemp = PlugSupplierct
                  PlugSuppliersec = Date.now()
                }
              }
              PlugSupplierresults = {
                ST: PlugSupplierstate,
                CPQI : CntInPlugSupplier,
                SP: PlugSupplierspeed
              }
              if (PlugSupplierflagPrint == 1) {
                for (var key in PlugSupplierresults) {
                  if( PlugSupplierresults[key] != null && ! isNaN(PlugSupplierresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L1_LOGS/CUE_PCL_PlugSupplier_l1.log', 'tt=' + PlugSuppliertime + ',var=' + key + ',val=' + PlugSupplierresults[key] + '\n')
                }
                PlugSupplierflagPrint = 0
                PlugSuppliersecStop = 0
                PlugSuppliertime = Date.now()
              }
        //------------------------------------------PlugSupplier----------------------------------------------
        //------------------------------------------Capper----------------------------------------------
              Capperct = CntOutCapper // NOTE: igualar al contador de salida
              if (!CapperONS && Capperct) {
                CapperspeedTemp = Capperct
                Cappersec = Date.now()
                CapperONS = true
                Cappertime = Date.now()
              }
              if(Capperct > Capperactual){
                if(CapperflagStopped){
                  Capperspeed = Capperct - CapperspeedTemp
                  CapperspeedTemp = Capperct
                  Cappersec = Date.now()
                  CapperdeltaRejected = null
                  Cappertime = Date.now()
                  CapperRejectFlag = false
                }
                CappersecStop = 0
                Capperstate = 1
                CapperflagStopped = false
                CapperflagRunning = true
              } else if( Capperct == Capperactual ){
                if(CappersecStop == 0){
                  Cappertime = Date.now()
                  CappersecStop = Date.now()
                }
                if( ( Date.now() - ( CappertimeStop * 1000 ) ) >= CappersecStop ){
                  Capperspeed = 0
                  Capperstate = 2
                  CapperspeedTemp = Capperct
                  CapperflagStopped = true
                  CapperflagRunning = false
                  if(CntInCapper - CntOutCapper - CapperReject.rejected != 0 && ! CapperRejectFlag){
                    CapperdeltaRejected = CntInCapper - CntOutCapper - CapperReject.rejected
                    CapperReject.rejected = CntInCapper - CntOutCapper
                    fs.writeFileSync('CapperRejected.json','{"rejected": ' + CapperReject.rejected + '}')
                    CapperRejectFlag = true
                  }else{
                    CapperdeltaRejected = null
                  }
                  CapperflagPrint = 1
                }
              }
              Capperactual = Capperct
              if(Date.now() - 60000 * CapperWorktime >= Cappersec && CappersecStop == 0){
                if(CapperflagRunning && Capperct){
                  CapperflagPrint = 1
                  CappersecStop = 0
                  Capperspeed = Capperct - CapperspeedTemp
                  CapperspeedTemp = Capperct
                  Cappersec = Date.now()
                }
              }
              Capperresults = {
                ST: Capperstate,
                CPQI : CntInCapper,
                CPQO : CntOutCapper,
                CPQR : CapperdeltaRejected,
                SP: Capperspeed
              }
              if (CapperflagPrint == 1) {
                for (var key in Capperresults) {
                  if( Capperresults[key] != null && ! isNaN(Capperresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L1_LOGS/CUE_PCL_Capper_l1.log', 'tt=' + Cappertime + ',var=' + key + ',val=' + Capperresults[key] + '\n')
                }
                CapperflagPrint = 0
                CappersecStop = 0
                Cappertime = Date.now()
              }
        //------------------------------------------Capper----------------------------------------------
        //------------------------------------------Labeller----------------------------------------------
              Labellerct = CntOutLabeller // NOTE: igualar al contador de salida
              if (!LabellerONS && Labellerct) {
                LabellerspeedTemp = Labellerct
                Labellersec = Date.now()
                LabellerONS = true
                Labellertime = Date.now()
              }
              if(Labellerct > Labelleractual){
                if(LabellerflagStopped){
                  Labellerspeed = Labellerct - LabellerspeedTemp
                  LabellerspeedTemp = Labellerct
                  Labellersec = Date.now()
                  LabellerdeltaRejected = null
                  LabellerRejectFlag = false
                  Labellertime = Date.now()
                }
                LabellersecStop = 0
                Labellerstate = 1
                LabellerflagStopped = false
                LabellerflagRunning = true
              } else if( Labellerct == Labelleractual ){
                if(LabellersecStop == 0){
                  Labellertime = Date.now()
                  LabellersecStop = Date.now()
                }
                if( ( Date.now() - ( LabellertimeStop * 1000 ) ) >= LabellersecStop ){
                  Labellerspeed = 0
                  Labellerstate = 2
                  LabellerspeedTemp = Labellerct
                  LabellerflagStopped = true
                  LabellerflagRunning = false
                  if(CntInLabeller - CntOutLabeller - LabellerReject.rejected != 0 && ! LabellerRejectFlag){
                    LabellerdeltaRejected = CntInLabeller - CntOutLabeller - LabellerReject.rejected
                    LabellerReject.rejected = CntInLabeller - CntOutLabeller
                    fs.writeFileSync('LabellerRejected.json','{"rejected": ' + LabellerReject.rejected + '}')
                    LabellerRejectFlag = true
                  }else{
                    LabellerdeltaRejected = null
                  }
                  LabellerflagPrint = 1
                }
              }
              Labelleractual = Labellerct
              if(Date.now() - 60000 * LabellerWorktime >= Labellersec && LabellersecStop == 0){
                if(LabellerflagRunning && Labellerct){
                  LabellerflagPrint = 1
                  LabellersecStop = 0
                  Labellerspeed = Labellerct - LabellerspeedTemp
                  LabellerspeedTemp = Labellerct
                  Labellersec = Date.now()
                }
              }
              Labellerresults = {
                ST: Labellerstate,
                CPQI : CntInLabeller,
                CPQO : CntOutLabeller,
                CPQR : LabellerdeltaRejected,
                SP: Labellerspeed
              }
              if (LabellerflagPrint == 1) {
                for (var key in Labellerresults) {
                  if( Labellerresults[key] != null && ! isNaN(Labellerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L1_LOGS/CUE_PCL_Labeller_l1.log', 'tt=' + Labellertime + ',var=' + key + ',val=' + Labellerresults[key] + '\n')
                }
                LabellerflagPrint = 0
                LabellersecStop = 0
                Labellertime = Date.now()
              }
        //------------------------------------------Labeller----------------------------------------------

              });//Cierre de lectura

            },1000);
        });//Cierre de cliente
            client2.on('error', function(err) {
              clearInterval(id2);
            });
            client2.on('close', function() {
            	clearInterval(id2);
            });





  client3.on('connect', function(err) {
  setInterval(function(){


      client3.readHoldingRegisters(0, 16).then(function(resp) {
        CntOutCasePacker = joinWord(resp.register[2], resp.register[3]);
        CntInCheckWeigher = joinWord(resp.register[2], resp.register[3]);
        CntOutEOL = joinWord(resp.register[4], resp.register[5]);
        CntOutCheckWeigher = joinWord(resp.register[4], resp.register[5]);

        /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
              if(secEOL>=60 && CntOutEOL){
                fs.appendFileSync("C:/PULSE/L1_LOGS/CUE_PCL_EOL_l1.log","tt="+Date.now()+",var=EOL"+",val="+CntOutEOL+"\n");
                secEOL=0;
              }else{
                secEOL++;
              }
        /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
        //------------------------------------------CasePacker----------------------------------------------
              CasePackerct = CntOutCasePacker // NOTE: igualar al contador de salida
              if (!CasePackerONS && CasePackerct) {
                CasePackerspeedTemp = CasePackerct
                CasePackersec = Date.now()
                CasePackerONS = true
                CasePackertime = Date.now()
              }
              if(CasePackerct > CasePackeractual){
                if(CasePackerflagStopped){
                  CasePackerspeed = CasePackerct - CasePackerspeedTemp
                  CasePackerspeedTemp = CasePackerct
                  CasePackersec = Date.now()
                  CasePackerdeltaRejected = null
                  CasePackerRejectFlag = false
                  CasePackertime = Date.now()
                }
                CasePackersecStop = 0
                CasePackerstate = 1
                CasePackerflagStopped = false
                CasePackerflagRunning = true
              } else if( CasePackerct == CasePackeractual ){
                if(CasePackersecStop == 0){
                  CasePackertime = Date.now()
                  CasePackersecStop = Date.now()
                }
                if( ( Date.now() - ( CasePackertimeStop * 1000 ) ) >= CasePackersecStop ){
                  CasePackerspeed = 0
                  CasePackerstate = 2
                  CasePackerspeedTemp = CasePackerct
                  CasePackerflagStopped = true
                  CasePackerflagRunning = false
                  CasePackerflagPrint = 1
                }
              }
              CasePackeractual = CasePackerct
              if(Date.now() - 60000 * CasePackerWorktime >= CasePackersec && CasePackersecStop == 0){
                if(CasePackerflagRunning && CasePackerct){
                  CasePackerflagPrint = 1
                  CasePackersecStop = 0
                  CasePackerspeed = CasePackerct - CasePackerspeedTemp
                  CasePackerspeedTemp = CasePackerct
                  CasePackersec = Date.now()
                }
              }
              CasePackerresults = {
                ST: CasePackerstate,
                CPQO : CntOutCasePacker,
                SP: CasePackerspeed
              }
              if (CasePackerflagPrint == 1) {
                for (var key in CasePackerresults) {
                  if( CasePackerresults[key] != null && ! isNaN(CasePackerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L1_LOGS/CUE_PCL_CasePacker_l1.log', 'tt=' + CasePackertime + ',var=' + key + ',val=' + CasePackerresults[key] + '\n')
                }
                CasePackerflagPrint = 0
                CasePackersecStop = 0
                CasePackertime = Date.now()
              }
        //------------------------------------------CasePacker----------------------------------------------
        //------------------------------------------CheckWeigher----------------------------------------------
              CheckWeigherct = CntOutCheckWeigher // NOTE: igualar al contador de salida
              if (!CheckWeigherONS && CheckWeigherct) {
                CheckWeigherspeedTemp = CheckWeigherct
                CheckWeighersec = Date.now()
                CheckWeigherONS = true
                CheckWeighertime = Date.now()
              }
              if(CheckWeigherct > CheckWeigheractual){
                if(CheckWeigherflagStopped){
                  CheckWeigherspeed = CheckWeigherct - CheckWeigherspeedTemp
                  CheckWeigherspeedTemp = CheckWeigherct
                  CheckWeighersec = Date.now()
                  CheckWeigherdeltaRejected = null
                  CheckWeigherRejectFlag = false
                  CheckWeighertime = Date.now()
                }
                CheckWeighersecStop = 0
                CheckWeigherstate = 1
                CheckWeigherflagStopped = false
                CheckWeigherflagRunning = true
              } else if( CheckWeigherct == CheckWeigheractual ){
                if(CheckWeighersecStop == 0){
                  CheckWeighertime = Date.now()
                  CheckWeighersecStop = Date.now()
                }
                if( ( Date.now() - ( CheckWeighertimeStop * 1000 ) ) >= CheckWeighersecStop ){
                  CheckWeigherspeed = 0
                  CheckWeigherstate = 2
                  CheckWeigherspeedTemp = CheckWeigherct
                  CheckWeigherflagStopped = true
                  CheckWeigherflagRunning = false
                  if(CntInCheckWeigher - CntOutCheckWeigher - CheckWeigherReject.rejected != 0 && ! CheckWeigherRejectFlag){
                    CheckWeigherdeltaRejected = CntInCheckWeigher - CntOutCheckWeigher - CheckWeigherReject.rejected
                    CheckWeigherReject.rejected = CntInCheckWeigher - CntOutCheckWeigher
                    fs.writeFileSync('CheckWeigherRejected.json','{"rejected": ' + CheckWeigherReject.rejected + '}')
                    CheckWeigherRejectFlag = true
                  }else{
                    CheckWeigherdeltaRejected = null
                  }
                  CheckWeigherflagPrint = 1
                }
              }
              CheckWeigheractual = CheckWeigherct
              if(Date.now() - 60000 * CheckWeigherWorktime >= CheckWeighersec && CheckWeighersecStop == 0){
                if(CheckWeigherflagRunning && CheckWeigherct){
                  CheckWeigherflagPrint = 1
                  CheckWeighersecStop = 0
                  CheckWeigherspeed = CheckWeigherct - CheckWeigherspeedTemp
                  CheckWeigherspeedTemp = CheckWeigherct
                  CheckWeighersec = Date.now()
                }
              }
              CheckWeigherresults = {
                ST: CheckWeigherstate,
                CPQI : CntInCheckWeigher,
                CPQO : CntOutCheckWeigher,
                CPQR : CheckWeigherdeltaRejected,
                SP: CheckWeigherspeed
              }
              if (CheckWeigherflagPrint == 1) {
                for (var key in CheckWeigherresults) {
                  if( CheckWeigherresults[key] != null && ! isNaN(CheckWeigherresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L1_LOGS/CUE_PCL_CheckWeigher_l1.log', 'tt=' + CheckWeighertime + ',var=' + key + ',val=' + CheckWeigherresults[key] + '\n')
                }
                CheckWeigherflagPrint = 0
                CheckWeighersecStop = 0
                CheckWeighertime = Date.now()
              }
        //------------------------------------------CheckWeigher----------------------------------------------

      });//Cierre de lectura

    },1000);
});//Cierre de cliente

client3.on('error', function(err) {
    clearInterval(id3);
});

client3.on('close', function() {
	clearInterval(id3);
});

//------------------------------Cerrar-código------------------------------
var shutdown = function () {
  client1.close()
  client2.close()
  client3.close()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
//------------------------------Cerrar-código------------------------------
