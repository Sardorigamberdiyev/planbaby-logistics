import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import Select from "react-select";
import "./diagram-preparation.css";

const DiagramPreparation = props => {
  const {
    isOnlyPreparation,
    stripColorBar,
    stripColorLine,
    textHeaderBar,
    textHeaderLine,
    preparationsOptions,
    preparation,
    diagramLineData,
    diagramBarData,
    operatorsOptions,
    operator,
    selectControl,
  } = props;

  const [isLineFull, setIsLineFull] = useState(false);
  const [isBarFull, setIsBarFull] = useState(false);

  const dinamicLineContainer = `line-container ${
    isLineFull ? "line-full-container" : ""
  } ${isBarFull ? "line-container-hidden" : ""}`;
  const dinamicBarContainer = `bar-container ${
    isBarFull ? "bar-full-container" : ""
  } ${isLineFull ? "bar-container-hidden" : ""}`;
  const dinamicLineBtn = `line-full-btn ${isLineFull ? "line-btn-active" : ""}`;
  const dinamicBarBtn = `bar-full-btn ${isBarFull ? "bar-btn-active" : ""}`;

  return (
    <div className="diagram-preparation">
      <div className="diagram-preparation-wrapper">
        <div className={dinamicLineContainer}>
          <div
            className={dinamicLineBtn}
            onClick={() => setIsLineFull(!isLineFull)}
          >
            <i className="icon icon-arrow-right" />
          </div>
          <div className="line-container-header">
            <p>{textHeaderLine}</p>
            <div className="select-container">
              {!isOnlyPreparation && (
                <div className="select-wrapper">
                  <Select
                    placeholder="Операторлар"
                    value={operator}
                    options={operatorsOptions}
                    onChange={option =>
                      selectControl(option, isOnlyPreparation)
                    }
                  />
                </div>
              )}
              <div className="select-wrapper">
                <Select
                  placeholder="Препаратлар"
                  value={preparation}
                  options={preparationsOptions}
                  onChange={option => selectControl(option, isOnlyPreparation)}
                />
              </div>
            </div>
          </div>
          <div className="line-container-body">
            <Line
              data={{
                labels: diagramLineData.map(
                  item => `${item._id.day}-${item._id.month}-${item._id.year}`,
                ),
                datasets: [
                  {
                    label: "Препарат",
                    data: diagramLineData.map(item => item.count),
                    fill: false,
                    borderColor: stripColorLine,
                    tension: 0.1,
                  },
                ],
              }}
              options={{
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
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
        <div className={dinamicBarContainer}>
          <div
            className={dinamicBarBtn}
            onClick={() => setIsBarFull(!isBarFull)}
          >
            <i className="icon icon-arrow-left" />
          </div>
          <div className="bar-container-header">{textHeaderBar}</div>
          <div className="bar-container-body">
            <Bar
              data={{
                labels: diagramBarData.map(item => `${item._id.nameUz}`),
                datasets: [
                  {
                    label: "Препараты",
                    data: diagramBarData.map(item => item.quantity),
                    backgroundColor: stripColorBar,
                    borderRadius: 5,
                    barPercentage: 0.5,
                    categoryPercentage: 0.6,
                  },
                ],
              }}
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
    </div>
  );
};

export default DiagramPreparation;
