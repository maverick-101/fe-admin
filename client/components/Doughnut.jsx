import React from 'react';
import Chart from 'chart.js';

export default class Doughnut extends React.Component {
  componentDidMount() {
    var ctx = document.getElementById("myChart3");
    this.myChart = new Chart(ctx, {
      type: 'doughnut',
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
      }
    })
  }
  componentWillReceiveProps(nextProps) {
    this.myChart.data.datasets[0].data = nextProps.data;
    this.myChart.update();
  }
  render() {
    return (
      <canvas className={this.props.className} id="myChart3" width="1160" height="500"></canvas>
    )
  }
}
