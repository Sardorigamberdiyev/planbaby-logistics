import React from "react";
import totalPriceFormat from "../../utils/totalPriceFormat";
import { Bar } from "react-chartjs-2";
import "./diagram-source.css";

const DiagramSource = props => {
  const {
    diagramCity,
    sourceHeaderText,
    sourceCategoryId,
    barTotalPrice,
    regions,
    sources,
    orders,
    getSources,
    sourcesCategory,
  } = props;

  const bgColors = ["#16D9E3", "#F85973", "#886AEA", "#F85973", "#886AEA"];

  return (
    <div className="diagram-source">
      <div className="bar-x-container">
        <div className="bar-x-header">
          <p>{sourceHeaderText}</p>
          <span>{totalPriceFormat(barTotalPrice)}</span>
          <div className="btn-wrapper">
            {sourcesCategory.map(category => (
              <button
                type="button"
                key={category._id}
                className={
                  sourceCategoryId === category._id ? "btn-active" : ""
                }
                onClick={() => getSources(category._id, diagramCity)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="bar-x-body">
          <Bar
            data={{
              labels: regions.map(region => region.nameUz),
              datasets: sources.map((source, idx) => {
                const ordersBySources = orders.filter(order => {
                  const isByFilter = !sourceCategoryId ? "sourceId" : "_id";
                  const sourceId = order.sourceId && order.sourceId[isByFilter];
                  return sourceId === source._id;
                });

                return {
                  label: source.name,
                  data: regions.map(region => {
                    let totalPrice = 0;
                    ordersBySources.forEach(order => {
                      if (
                        order.regionId._id === region._id &&
                        diagramCity === region.city
                      ) {
                        totalPrice += order.totalPrice;
                      }
                    });
                    return totalPrice;
                  }),
                  backgroundColor: bgColors[idx],
                };
              }),
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      </div>
      <div className="diagram-source-list">
        {sources.map((source, idx) => {
          return (
            <div key={source._id} className="diagram-source-list-item">
              <i style={{ backgroundColor: bgColors[idx] }} />
              <span>{source.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiagramSource;
