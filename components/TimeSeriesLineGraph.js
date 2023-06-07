import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';

const TimeSeriesLineGraph = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            labels: data.map((item) => formatTimestamp(JSON.parse(item).timestamp)),
            datasets: [
            {
                label: 'Sensor 1',
                data: data.map((item) => ({
                    x: formatTimestamp(JSON.parse(item).timestamp), 
                    y: JSON.parse(item).sensor_value
                })),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            ],
        },
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                type: 'time',
                time: {
                    unit: 'minute',
                    tooltipFormat: 'MMM D, YYYY HH:mm:ss',
                },        
                title: {
                display: false,
                }
                }],
                
                    
            }
        },
        });

        return () => {
        chart.destroy();
        };
    }, [data]);
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp).toLocaleString();
        console.log(date)
        return date; // Customize the format as per your requirements
    };
  return (
    <div style={{ width: '1200px', height: '600px' }}>
      <canvas ref={chartRef} />
    </div>
  );
};




export default TimeSeriesLineGraph;