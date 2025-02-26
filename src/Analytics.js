// Analytics.js
import React from "react";
import { Chart } from "react-google-charts";

function Analytics({ lists, darkMode }) {
  const chartData = [
    ["Task", "Time Spent (seconds)"]
  ];

  lists.forEach((list) => {
    list.tasks.forEach((task) => {
      if (task.timeSpent > 0) {
        chartData.push([task.name, task.timeSpent]);
      }
    });
  });

  const options = {
    title: "Time Spent on Tasks",
    pieHole: 0.5,
    is3D: false,
    backgroundColor: "transparent",
    legend: { textStyle: { color: darkMode ? '#fff' : '#000' } },
    titleTextStyle: { color: darkMode ? '#fff' : '#000' }
  };

  return (
    <div className="analytics-container">
      <h2>Analytics</h2>
      <Chart
        chartType="PieChart"
        width="100%"
        height="400px"
        data={chartData}
        options={options}
      />
    </div>
  );
}

export default Analytics;
