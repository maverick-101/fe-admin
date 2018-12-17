import React from 'react';
import Chart from 'chart.js';

export default class ListingChart extends React.Component {
  componentDidMount() {
    var ctx = document.getElementById("myChart");
    this.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.props.labels,
        datasets: [{
          data: this.props.data,
          label: 'Trends',
          lineTension: 0,
          fill: false,
          backgroundColor: '#b2dfdb',
          hoverBackgroundColor: '#26a69a',
        }]
      },
      options: {
        legend: {
          display: false
         },
         tooltips: {
           borderColor: '#202020',
           borderWidth: 2,
           backgroundColor: '#fafafa',
           cornerRadius:2,
           yPadding:10,
           bodyFontColor: '#0f0f0f'
         },
        scales: {
          yAxes: [{
            display:false,
            gridLines: {
              display: false
            },
            ticks: {
              display: false,
              maxTicksLimit: 3,
            }
          }],
          xAxes: [{
            gridLines: {
              display:false
            },
            categoryPercentage: 1.0,
            barPercentage: 0.7,
          }],
        }
      }
    })
  }
  componentWillReceiveProps(nextProps) {
    this.myChart.data.datasets[0].data = nextProps.data;
    this.myChart.update();
  }
  render() {
    return (
      <canvas className={this.props.className} id="myChart" width="1160" height="500"></canvas>
    )
  }
}
