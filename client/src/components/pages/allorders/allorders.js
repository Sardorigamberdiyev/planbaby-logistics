import { Pagination } from "antd";
import React from "react";
import DatePicker from "react-datepicker";
import statisticsData from "../../../utils/statusData";
import OrderAllItem from "../../order-all-item";
import Spinner from "../../spinner";
import "./allorders.css";

function Allorders(props) {
  const {
    statistics,
    loading,
    allOrders,
    pageNumber,
    verifiedLength,
    onPagination,
    onDateChange,
    onInputChange,
    downloadOrders,
    startDate,
    endDate,
    term,
    disabledExel,
    handleBack,
    downloadProcuts,
  } = props;
  return (
    <div className="allorders">
      <div className="statistics">
        {statisticsData().map(item => {
          const data = statistics.find(s => s._id === item.id);
          const count = data ? data.count : item.count;
          return (
            <div key={item.id} className="statistics-item">
              <div
                className="top"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="name">{item.name}</div>
              <div className="count" style={{ color: item.color }}>
                {count}
              </div>
            </div>
          );
        })}
      </div>
      <div className="filter">
        <input
          type="text"
          name="term"
          placeholder="ID"
          onChange={onInputChange}
          value={term}
        />
        <div className="exel">
          <DatePicker
            dateFormat="dd/MM/yyyy"
            onChange={date => onDateChange(date)}
            startDate={startDate}
            endDate={endDate}
            maxDate={new Date()}
            placeholderText="Выберите интервал даты"
            className="date-picker"
            selectsRange
            isClearable
          />
          <button
            className="btn-exel-product"
            disabled={disabledExel}
            onClick={downloadProcuts}
          >
            Маҳсулотлар эхели
          </button>
          <button
            className="btn-exel"
            disabled={disabledExel}
            onClick={downloadOrders}
          >
            Ехелни юклаб олиш
          </button>
        </div>
      </div>

      {loading ? (
        <div className="all-spinner">
          <Spinner />
        </div>
      ) : (
        <div className="order-list">
          {allOrders.map(item => (
            <OrderAllItem key={item._id} {...item} handleBack={handleBack} />
          ))}
        </div>
      )}
      <div className="pagination">
        <Pagination
          defaultPageSize={24}
          current={pageNumber}
          defaultCurrent={1}
          onChange={onPagination}
          total={verifiedLength}
          pageSizeOptions={[12, 24, 48, 72, 96]}
        />
      </div>
    </div>
  );
}

export default Allorders;
