import React, { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ModalBarDiagram from "../modal-bar-diagram";
import "./doughnut-bar-diagram.css";

const DoughnutBarDiagram = props => {
  const [isModalBar, setIsModalBar] = useState(false);
  const {
    doughnutHeaderText,
    barHeaderText,
    barData,
    doughnutData,
    doughnutMapLabels,
    doughnutMapData,
    doughnutBgColor,
    listMapData,
    barLineColor,
  } = props;
  const doughtnutLabelsLine = {
    id: "doughtnutLabelsLine",
    afterDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { width, height },
      } = chart;

      chart.data.datasets.forEach((dataset, i) => {
        chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
          const { x, y } = datapoint.tooltipPosition();

          //draw line
          const halfheight = height / 2;
          const halfwidth = width / 2;

          const xLine = x >= halfwidth ? x + 15 : x - 15;
          const yLine = y >= halfheight ? y + 15 : y - 15;
          const extaLine = x >= halfwidth ? 8 : -8;

          //line
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(xLine, yLine);
          ctx.lineTo(xLine + extaLine, yLine);
          ctx.strokeStyle = dataset.borderColor[index];
          ctx.stroke();

          //control the position
          const textPositionX = x >= halfwidth ? "left" : "right";
          const plusFivePx = x >= halfwidth ? 2 : -2;

          //text
          ctx.font = "700 14px Open Sans";
          ctx.fillStyle = "#222325";
          ctx.textAlign = textPositionX;
          ctx.textBaseLine = "middle";
          ctx.fillText(
            dataset.data[index] + "%",
            xLine + extaLine + plusFivePx,
            yLine,
          );
        });
      });
    },
  };
  const closeModal = ({ target: { className } }) => {
    className === "modal-bar-diagram" && setIsModalBar(false);
  };
  return (
    <div className="doughnut-bar-diagram">
      {isModalBar && (
        <ModalBarDiagram operators={barData} closeModal={closeModal} />
      )}
      <div className="doughnut-container">
        <div className="doughnut-body">
          <div className="doughnut-wrapper">
            <div className="doughnut-header">{doughnutHeaderText}</div>
            <div className="doughnut-canvas">
              <Doughnut
                data={{
                  labels: doughnutData.map(doughnutMapLabels),
                  datasets: [
                    {
                      data: doughnutData.map(doughnutMapData),
                      backgroundColor: doughnutData.map(doughnutBgColor),
                      borderColor: doughnutData.map(doughnutBgColor),
                      borderRadius: 20,
                      cutout: "90%",
                      borderWidth: 1,
                      offset: 10,
                    },
                  ],
                }}
                plugins={[doughtnutLabelsLine]}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  radius: 100,
                }}
              />
            </div>
          </div>
          <div className="doughnut-quantity-by-order">
            <ul>{doughnutData.map(listMapData)}</ul>
          </div>
        </div>
      </div>
      <div className="bar-y-container">
        <div className="bar-y-header">
          <p>{barHeaderText}</p>
          <button type="button" onClick={() => setIsModalBar(true)}>
            Тулик малумот
          </button>
        </div>
        <div className="bar-y-body">
          <Bar
            data={{
              labels: barData
                .slice(0, 14)
                .map(user => `${user.firstName} ${user.lastName}`),
              datasets: [
                {
                  axis: "y",
                  data: barData.slice(0, 14).map(user => user.quantityOrder),
                  fill: true,
                  backgroundColor: [barLineColor],
                  borderRadius: 5,
                  barPercentage: 0.5,
                  categoryPercentage: 0.6,
                },
              ],
            }}
            plugins={[ChartDataLabels]}
            options={{
              indexAxis: "y",
              maintainAspectRatio: true,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    font: {
                      size: 12,
                      weight: 400,
                      family: "Open Sans",
                    },
                  },
                  grid: {
                    display: false,
                  },
                },
                x: {
                  display: false,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                weight: 400,
                tooltip: false,
                datalabels: {
                  anchor: "end",
                  align: "right",
                  padding: 10,
                  color: "#222325",
                  font: {
                    size: 12,
                    family: "Open Sans",
                    weight: 400,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DoughnutBarDiagram;
