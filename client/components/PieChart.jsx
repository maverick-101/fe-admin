import React from 'react';
import Chart from 'chart.js';

export default class PieChart extends React.Component {
  componentDidMount() {
    var ctx = document.getElementById("myChart1");
    this.myChart1 = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Sale', 'Rent'],
        datasets: [{
          data: this.props.data,
          label: 'Trends',
          lineTension: 0,
          fill: false,
          backgroundColor: ['#b2dfdb', '#ef5350'],
          hoverBackgroundColor: ['#26a69a', '#de4240'],
        }]
      },
      options: {
        legend: {
          display: true
         },
      }
    })
  }
  componentWillReceiveProps(nextProps) {
    this.myChart1.data.datasets[0].data = nextProps.data;
    this.myChart1.update();
  }
  render() {
    return (
      <canvas className={this.props.className} id="myChart1" width="1160" height="500"></canvas>
    )
  }
}
