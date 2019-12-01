import React from 'react';
import './App.css';
import ApexCharts from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import io from 'socket.io-client';
import logo from './pacemaker_logo.png';

var socket;
var data_atrial = [];
var data_ventrical = [];
var count = 0;
var intervalId;
class Electrogram extends React.Component {

    constructor(props) {
    super(props);
    count = 0; 
    this.state = {
        data:"",
        options1: {
        chart: {
            id: 'realtime',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 1000
                }
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
            },
            dataLabels: {
            enabled: false
            },
            stroke: {
            curve: 'smooth'
            },

            title: {
            text: 'Ventrical Signal',
            align: 'left'
            },
            markers: {
            size: 0
            },
            xaxis: {
            //type: 'datetime',
           // range: XAXISRANGE,
            },
            yaxis: {
                max: 10
            },
            legend: {
            show: false
            }
        },
        options2: {
            chart: {
                id: 'realtime1',
                animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: {
                    speed: 1000
                    }
                },
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            colors: ['#FF0000'],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
    
            title: {
                text: 'Atrial Signal',
                align: 'left'
            },
            markers: {
                size: 0
            },
            xaxis: {
            //    type: 'datetime',
               // range: XAXISRANGE,
            },
            yaxis: {
                max: 10
            },
            legend: {
                show: false
            }
        },
        series: [{
        data: data_atrial.slice()
        }],
    }
    }

    componentDidMount() {
    this.intervals()
        socket = io.connect('http://localhost:3000');
        socket.on('news',  (data) => {
            
            if( new Uint8Array(data.hello)[0] === 1 ){
                let points = new Float64Array(data.hello.slice(1,17));
                data_atrial.push([count, Math.floor(points[0])]);
                data_ventrical.push([count, Math.floor(points[1])]);
                count++;
                console.log(data_atrial);
    
                if(data_atrial.length > 500){
                    data_atrial = data_atrial.slice(250, 500);
                    data_ventrical = data_ventrical.slice(250, 500);
                }
            }
            //first byte ignore
            //next 8 atrial
            //next 8 ventrical
            //add these data points to my graph
            //now here i gotta slice the data
           //this.setState({data: data.hello});
        });
    }

    componentWillUnmount(){
        console.log('here')
        window.clearInterval(intervalId);
        socket.close();
    }

    intervals () {
        
        intervalId = window.setInterval(() => {
            
            ApexCharts.exec('realtime', 'updateSeries', [{
                data: data_ventrical
            }])
            
            ApexCharts.exec('realtime1', 'updateSeries', [{
                data: data_atrial
            }])
            
        }, 500)
    }

    render() {

    return (
        <div>
            <img style={{paddingBottom:"30px"}}src={logo} alt="logo" onClick={()=>{this.props.history.push('/home/login')}}/>
            <ReactApexChart options={this.state.options1} series={this.state.series} type="line" height="350" width="500"/>
            <ReactApexChart options={this.state.options2} series={this.state.series} type="line" height="350" width="500"/>
        </div>
    );
    }

}

export default Electrogram;