import './App.css';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const proxyURL = 'https://cors-anywhere.herokuapp.com/';

function App() {
  const [Name, setName] = useState('MSFT');
  const [series, setSeries] = useState([{ data: [] }]);
  const [rate, setRate] = useState(-1);
  const [priceTime, setPriceTime] = useState(null);

  const chartOptions = {
    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: 'Candlestick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  };

  useEffect(() => {
    let time;

    async function getStocks() {
      try {
        const stockURL = `${proxyURL}https://query1.finance.yahoo.com/v8/finance/chart/${Name}`;
        const response = await fetch(stockURL);
        const data = await response.json();
        const chart = data.chart.result[0];
        const { meta, indicators, timestamp } = chart;

        const stockRate = +meta.regularMarketPrice.toFixed(4);
        const stockTime = new Date(meta.regularMarketTime * 1000);

        const changes = timestamp.map((ts, index) => ({
          x: new Date(ts * 1000),
          y: [
            indicators.quote[0].open[index],
            indicators.quote[0].high[index],
            indicators.quote[0].low[index],
            indicators.quote[0].close[index],
          ],
        }));

        setRate(stockRate);
        setPriceTime(stockTime);
        setSeries([{ data: changes }]);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }

      time = setTimeout(getStocks, 10000);
    }

    getStocks();

    return () => {
      clearTimeout(time);
    };
  }, [Name]);

  return (
    <div className="App">
      {rate}
      <br />
      <div>Enter The Stock Name</div>
      <input type="text" value={Name} onChange={(e) => setName(e.target.value)} />
      <h1>{Name}</h1>
      <h1>{priceTime && priceTime.toLocaleTimeString()}</h1>
      <div className="chart-container">
  <Chart options={chartOptions} series={series} type="candlestick" width={500} height={320} />
</div>
    </div>
  );
}

export default App;
