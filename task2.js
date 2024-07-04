import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const StockChart = () => {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Top Ask Price',
                data: [],
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                fill: false,
            },
        ],
    });

    useEffect(() => {
        const fetchData = () => {
            fetch('URL_TO_SERVER_ENDPOINT')
                .then(response => response.json())
                .then(newData => {
                    const newTimestamp = newData.timestamp;
                    const newTopAskPrice = newData.top_ask_price;

                    // Check for duplicates
                    if (!data.find(item => item.timestamp === newTimestamp)) {
                        const updatedData = [...data, newData];

                        setData(updatedData);

                        // Update chart data
                        setChartData({
                            labels: updatedData.map(d => d.timestamp),
                            datasets: [
                                {
                                    label: 'Top Ask Price',
                                    data: updatedData.map(d => d.top_ask_price),
                                    borderColor: 'rgba(75,192,192,1)',
                                    borderWidth: 2,
                                    fill: false,
                                },
                            ],
                        });
                    }
                })
                .catch(error => console.error('Error fetching data:', error));
        };

        // Fetch data every second
        const intervalId = setInterval(fetchData, 1000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [data]);

    return (
        <div>
            <h2>Stock Price Chart</h2>
            <Line data={chartData} />
        </div>
    );
};

export default StockChart;
