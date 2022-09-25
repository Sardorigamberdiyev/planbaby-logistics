import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "chart.js/auto";
import "react-datepicker/dist/react-datepicker.css";
import { dayMonthOptions } from "../../../utils/localStaticData";
import DoughnutBarDiagram from "../../doughnut-bar-diagram";
import DiagramSource from "../../diagram-source";
import DiagramPreparation from "../../diagram-preparation";
import totalPriceFormat from "../../../utils/totalPriceFormat";
import statusData from "../../../utils/statusData";
import "./dashboard.css";

const ListMapDataItem = ({ id, text, value, itemColor }) => {
  return (
    <li key={id}>
      <i style={{ backgroundColor: itemColor }} />
      <p>{text}: </p>
      <span style={{ color: itemColor }}>{totalPriceFormat(value)}</span>
    </li>
  );
};

const Dashboard = props => {
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const { t } = useTranslation();
  const {
    dayMonth,
    preparation,
    preparationsOptions,
    preparationForOnly,
    preparationsByDateOnly,
    preparationsByDate,
    preparationByCountOnly,
    preparationByCount,
    operatorsOptions,
    operatorsOrdersQuantity,
    operator,
    orders,
    couriersOrdersQuantity,
    regionsUz,
    regionsOther,
    sourcesUz,
    sourcesOther,
    selectControl,
    statusesOrders,
    sourcesOrders,
    sourcesCategory,
    statusesOrdersCount,
    barTotalPriceUz,
    barTotalPriceOther,
    getSources,
    handleDateChange,
    sourceCategoryIdUz,
    sourceCategoryIdOther,
    startDate,
    endDate,
  } = props;

  const statuses = statusData();
  let quantityTotal = 0;
  statusesOrders.forEach(item => {
    quantityTotal += item.total;
  });
  let countTotal = 0;
  sourcesOrders.forEach(item => {
    countTotal += item.count;
  });

  const labelByStatuses = status => {
    const statusItem = statuses.find(i => i.id === status);
    if (statusItem) {
      const { name: text, color } = statusItem;
      return { text, color };
    }
    return { text: "Бошка", color: "lightgrey" };
  };

  const colors = ["#8CB2F8", "#ED9F74", "#A0F1DE", "#CDA1F0", "#EC8F8F"];

  const listMapDataStatuses = ({ _id, total }, index) => (
    <ListMapDataItem
      key={_id}
      id={_id}
      value={total}
      text={labelByStatuses(_id).text}
      itemColor={labelByStatuses(_id).color}
    />
  );

  const listMapDataSources = ({ _id: { _id, name }, count }, index) => {
    return (
      <ListMapDataItem
        key={_id}
        id={_id}
        text={name}
        value={count}
        itemColor={colors[index]}
      />
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="start-end-date">
          <h1>{t("dashboard")}</h1>
          <div className="dashboard-filter-wrapper">
            <div
              className={`select-wrapper ${
                isShowDropdown ? "is-dropdown" : ""
              }`}
            >
              <div
                className="day-month-select"
                onClick={() => setIsShowDropdown(!isShowDropdown)}
              >
                {dayMonth.label}
                <i className="icon icon-arrow-up" />
              </div>
              <div className="day-month-dropdown">
                <ul>
                  {dayMonthOptions.map(option => {
                    return (
                      <li
                        key={option.value}
                        className={`${
                          option.value === dayMonth.value
                            ? "day-month-active"
                            : ""
                        }`}
                        onClick={() => {
                          selectControl(option);
                          setIsShowDropdown(false);
                        }}
                      >
                        {option.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="picker-wrapper">
              <DatePicker
                dateFormat="dd/MM/yyyy"
                onChange={date => handleDateChange(date)}
                startDate={startDate}
                endDate={endDate}
                maxDate={new Date()}
                disabled={dayMonth.value !== "range"}
                placeholderText="Выберите интервал даты"
                className="date-picker"
                selectsRange
                isClearable
              />
            </div>
          </div>
        </div>
        <div className="dashboard-wrapper">
          <div className="quantity-by-order">
            <ul>
              {statusData().map(item => {
                const countItem = statusesOrdersCount.find(
                  i => i._id === item.id,
                );
                const count = countItem ? countItem.count : 0;
                return (
                  <li
                    key={item.id}
                    className={item.id}
                    style={{
                      background: `linear-gradient(270deg, #53edcf 10%,${item.color} 90%)`,
                    }}
                  >
                    <p>{item.name}</p>
                    <span>{count}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <DoughnutBarDiagram
            doughnutHeaderText={t("orders")}
            barHeaderText={t("top_operators")}
            barLineColor="#089DF7"
            barData={operatorsOrdersQuantity}
            doughnutData={statusesOrders}
            doughnutBgColor={item => labelByStatuses(item._id).color}
            doughnutMapLabels={item => labelByStatuses(item._id).text}
            doughnutMapData={item =>
              Math.round((item.total / quantityTotal) * 10000) / 100
            }
            listMapData={listMapDataStatuses}
          />
          <DoughnutBarDiagram
            doughnutHeaderText={t("source")}
            barHeaderText={t("top_couriers")}
            barLineColor="#8D37D4"
            barData={couriersOrdersQuantity}
            doughnutData={sourcesOrders}
            doughnutBgColor={(item, idx) => colors[idx]}
            doughnutMapLabels={item => item._id.name}
            doughnutMapData={item =>
              Math.round((item.count / countTotal) * 10000) / 100
            }
            listMapData={listMapDataSources}
          />
          <DiagramSource
            diagramCity="uz"
            sourceHeaderText={t("sources_for_region_uz")}
            sourceCategoryId={sourceCategoryIdUz}
            barTotalPrice={barTotalPriceUz}
            orders={orders}
            sources={sourcesUz}
            regions={regionsUz}
            sourcesCategory={sourcesCategory}
            getSources={getSources}
          />
          <DiagramSource
            diagramCity="other"
            sourceHeaderText={t("sources_for_region_other")}
            sourceCategoryId={sourceCategoryIdOther}
            barTotalPrice={barTotalPriceOther}
            orders={orders}
            sources={sourcesOther}
            regions={regionsOther}
            sourcesCategory={sourcesCategory}
            getSources={getSources}
          />
          <DiagramPreparation
            textHeaderLine={t("preparation_diagram")}
            textHeaderBar={t("preparations_diagram")}
            stripColorLine="#FF7345"
            stripColorBar="#1DD188"
            preparationsOptions={preparationsOptions}
            preparation={preparationForOnly}
            diagramLineData={preparationsByDateOnly}
            diagramBarData={preparationByCountOnly}
            selectControl={selectControl}
            isOnlyPreparation={true}
          />
          <DiagramPreparation
            textHeaderLine={t("operator_diagram")}
            textHeaderBar={t("preparations_operator")}
            stripColorLine="#089DF7"
            stripColorBar="#089DF7"
            preparationsOptions={preparationsOptions}
            preparation={preparation}
            diagramLineData={preparationsByDate}
            diagramBarData={preparationByCount}
            operatorsOptions={operatorsOptions}
            operator={operator}
            selectControl={selectControl}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
