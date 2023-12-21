

let dataIndex = 0;
let old_state= document.getElementById('L');

function fetchData() {
  return fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (dataIndex < data.length) {
        const currentData = data[dataIndex];
        dataIndex++;
        if (dataIndex === data.length) {
          dataIndex = 0; 
        }
       
        return {
          temperature: currentData.TEMPERATURE,
          pressure: currentData.PRESSURE,
          airSpeed: currentData.AIR_SPEED,
          missionTime: currentData.MISSION_TIME,
          packetCount: currentData.PACKET_COUNT,
          mode: currentData.MODE,
          state: currentData.STATE,
          altitude: currentData.ALTITUDE,
          hs: currentData.HS_DEPLOYED,
          pc:currentData.PC_DEPLOYED,
          voltage:currentData.VOLTAGE,
          gpsTime:currentData.GPS_TIME,
          gpsAltitude:currentData.GPS_ALTITUDE,
          latitude: currentData.GPS_LATITUDE,
          longitude: currentData.GPS_LONGITUDE,
          gpsSats: currentData.GPS_SATS,
          tiltX: currentData.TILT_X,
          tiltY: currentData.TILT_Y,
          rotZ:currentData.ROT_Z,
          echo: currentData.CMD_ECHO 
          
        };
      }
    });
}
//TEMPERATURE GRAPH
Plotly.plot('temperatureGraph', [{ y: [], type: 'line', line:{color:'white'} }], layout={plot_bgcolor:'#809bce',
paper_bgcolor:'#809bce', margin: { t: 40, b: 30, l: 40, r: 0 }});
//PRESSURE GRAPH
Plotly.plot('pressureGraph', [{ y: [], type: 'line' , line:{color:'white'}}], layout={plot_bgcolor:'#809bce',
paper_bgcolor:'#809bce', margin: { t: 40, b: 30, l: 40, r: 0 }});
Plotly.plot('altitudeGraph', [{ y: [], type: 'line' , line:{color:'white'}}], layout={plot_bgcolor:'#809bce',
paper_bgcolor:'#809bce', margin: { t: 40, b: 30, l: 40, r: 0 }});
//VOLTAGE
Plotly.plot('voltageGraph', [{ y: [], type: 'line' , line:{color:'white'}}], layout={plot_bgcolor:'#809bce',
paper_bgcolor:'#809bce', margin: { t: 40, b: 30, l: 40, r: 20 }});
//AIR SPEED LINE GRAPH
Plotly.plot('airspeedLineGraph', [{ y: [], type: 'line' , line:{color:'white'}}], layout={plot_bgcolor:'#809bce',
paper_bgcolor:'#809bce', margin: { t: 40, b: 30, l: 40, r: 0 }});
//TILT X

let tiltXTrace = {
 
  y: [],
  type: 'scatter',
  name: 'Tilt X',
  line: {
    color: 'white' 
  }
};

let tiltYTrace = {
  
  y: [],
  type: 'scatter',
  name: 'Tilt Y',
  line: {
    color: '#041a43' 
  }
};

let tiltData = [tiltXTrace, tiltYTrace];
let tiltGraphLayout = {
  plot_bgcolor: '#809bce', 
  paper_bgcolor: '#809bce', 
  margin: { t: 40, b: 30, l: 40, r: 0 }
};

Plotly.newPlot('tiltGraph', tiltData, tiltGraphLayout);

//Air Speed
var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: [],
      paper_bgcolor:'#b8e0d2',
      gauge: {
        axis: { range: [0, 150] },
        bar: { color: "#041a43" }, 
        bgcolor: "#b8e0d2",
        paper_bgcolor:'#b8e0d2',
      },
      type: "indicator",
      mode: "gauge+number"
    }
  ];

  var layout = {
      width: 400,
      height: 100,
      margin: { t: 20, b: 10, l: 0, r: 0 }, 
      paper_bgcolor:'#d6eadf',
    
    };


  Plotly.newPlot('airSpeedGraph', data, layout);


let map = L.map('map').setView([0, 0], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

let markers = []; // Array to store markers


function updateMap(data) {
  let latlng = [data.latitude, data.longitude];
  map.setView(latlng, 10);

  let dotIcon = L.icon({
    iconUrl: 'images/red_dot-removebg-preview.png', 
    iconSize: [8, 8], 
    iconAnchor: [4, 4], 
  });

 
  let currentMarker = L.marker(latlng).addTo(map);

  markers.push(currentMarker);

  
  markers.slice(0, -1).forEach((marker) => {
    marker.setIcon(dotIcon);
  });

  
}




//1 hz + updation




  var count = 0;
setInterval(() => {
  fetchData().then(data => {
    Plotly.extendTraces('temperatureGraph', {
      y: [[data.temperature]]
    }, [0]);
    //pressure update
    Plotly.extendTraces('pressureGraph', {
        y: [[data.pressure]]
      }, [0]);
      //altitude
      Plotly.extendTraces('altitudeGraph', {
        y: [[data.altitude]]
      }, [0]);
      Plotly.extendTraces('voltageGraph', {
        y: [[data.voltage]]
      }, [0]);


//air speed update(speedometer)
      Plotly.restyle('airSpeedGraph', 'value', [data.airSpeed]);
//air speed line graph
Plotly.extendTraces('airspeedLineGraph', {
  y: [[data.airSpeed]]
}, [0]);
//radar
//Plotly.restyle('radar', 'r', [[data.tiltX, data.tiltY, data.rotZ]]);
// Plotly.extendTraces('radar', {
//   y: [[data.tiltX, data.tiltY]],
//   x: [[new Date()]] 
// }, [0, 1]); 

let newTiltX = data.tiltX; 
let newTiltY = data.tiltY; 

Plotly.extendTraces('tiltGraph', {
 
  y: [[newTiltX]], 
}, [0]); 

Plotly.extendTraces('tiltGraph', {
  
  y: [[newTiltY]], 
}, [1]); 




updateMap(data);

      // values set
      document.querySelector('#PressureValue').textContent=data.pressure;
      document.querySelector('#TemperatureValue').textContent=data.temperature;
      document.querySelector('#AirSpeedValue').textContent=data.airSpeed;
      document.querySelector('#VoltageValue').textContent=data.voltage;
      document.querySelector('#AltitudeValue').textContent=data.altitude;
      document.querySelector('#TiltXValue').textContent=data.tiltX;
      document.querySelector('#TiltYValue').textContent=data.tiltY;
      document.querySelector('#RotZValue').textContent=data.rotZ;
      document.querySelector('#GPSTimeValue').textContent=data.gpsTime;
      document.querySelector('#GPSAltitudeValue').textContent=data.gpsAltitude;
      document.querySelector('#GPSLongiValue').textContent=data.longitude;
      document.querySelector('#GPSLatiValue').textContent=data.latitude;
      document.querySelector('#GPSSatsValue').textContent=data.gpsSats;
      document.querySelector('#HSValue').textContent=data.hs;
      document.querySelector('#PCValue').textContent=data.pc;
      document.querySelector('#ModeValue').textContent=data.mode;
      document.querySelector('#StateValue').textContent=data.state;
      document.querySelector('#EchoValue').textContent=data.echo;
      document.querySelector('#PacketCountValue').textContent=data.packetCount;
      document.querySelector('#MissionTimeValue').textContent=data.missionTime;

      let current_state=data.state;
      if(current_state=='LAUNCH'){
        old_state.style.backgroundColor = '#95b8d1';
        old_state.style.color='#000000';
        let container=document.getElementById('L');
        container.style.backgroundColor = '#041a43';
        container.style.color='#ffffff';
        old_state=document.getElementById('L');
      }
      else if(current_state=='ASCENT'){
        old_state.style.backgroundColor = '#95b8d1';
        old_state.style.color='#000000';
        let container=document.getElementById('A');
        container.style.backgroundColor = '#041a43';
        container.style.color='#ffffff';
        old_state=document.getElementById('A');
      }
      else if(current_state=='ROCKETSEP'){
        old_state.style.backgroundColor = '#95b8d1';
        old_state.style.color='#000000';
        let container=document.getElementById('R');
        container.style.backgroundColor = '#041a43';
        container.style.color='#ffffff';
        old_state=document.getElementById('R');
      }
      else if(current_state=='DESCENT'){
        old_state.style.backgroundColor = '#95b8d1';
        old_state.style.color='#000000';
        let container=document.getElementById('D');
        container.style.backgroundColor = '#041a43';
        container.style.color='#ffffff';
         old_state=document.getElementById('D');
      }
      else if(current_state=='HS_REL'){
        old_state.style.backgroundColor = '#95b8d1';
        old_state.style.color='#000000';
        let container=document.getElementById('H');
        container.style.backgroundColor = '#041a43';
        container.style.color='#ffffff';
        old_state=document.getElementById('H');
      }
      else if(current_state=='LANDING'){
        old_state.style.backgroundColor = '#95b8d1';
        old_state.style.color='#000000';
        let container=document.getElementById('LG');
        container.style.backgroundColor = '#041a43';
        container.style.color='#ffffff';
        old_state=document.getElementById('LG');
      }
      
     //graph relayout 
    count++;
    // if(count>20){
    //     Plotly.relayout('temperatureGraph', {
    //         xaxis: {
    //           range: [count-20, count]
    //         }
    //       });
    //       Plotly.relayout('pressureGraph', {
    //         xaxis: {
    //           range: [count-20, count]
    //         }
    //       });

    // }

    
  });
}, 1000);
 let d1, d2, d3, d4;
 d2=window.getComputedStyle( document.getElementById('csvdata')).display;
 d1=window.getComputedStyle( document.getElementById('3dgraoh')).display;
 d3=window.getComputedStyle( document.getElementById('allgraphs')).display;
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
function hideElements() {
  document.getElementById('csvdata').style.display = d2;
  document.getElementById('allgraphs').style.display = 'none';
  document.getElementById('3dgraoh').style.display = 'none';
}

function hideElements2() {
  document.getElementById('allgraphs').style.display = d3;
  document.getElementById('csvdata').style.display = 'none';
  document.getElementById('3dgraoh').style.display = 'none';
}


function hideElements3() {
  document.getElementById('3dgraoh').style.display = d1;
  document.getElementById('allgraphs').style.display = 'none';
  document.getElementById('csvdata').style.display = 'none';
}

function hideElements4() {
  document.getElementById('allgraphs').style.display = 'none';
  document.getElementById('csvdata').style.display = 'none';
  document.getElementById('3dgraoh').style.display = 'none';
}

