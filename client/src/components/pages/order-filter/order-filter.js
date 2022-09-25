import React, { useState } from "react";
import OrderList from "../../order-list";
import Pagination from "react-paginate";
import FilterModal from "./../../filter-modal";
import { useTranslation } from "react-i18next";
import { limitOptions } from "../../../utils/localStaticData";
import "react-calendar/dist/Calendar.css";
import "./order-filter.css";

const OrderFilter = props => {
  const [filter, setFilter] = useState(false);
  const { t } = useTranslation();
  const {
    orders,
    ordersLength,
    typeList,
    typeOrder,
    limit,
    loading,
    error,
    pageRange,
    page,
    priceQuantity,
    gprinterHandler,
    failureHandler,
    courierHandler,
    deleteHandler,
    telegramHandler,
    finishOrderHandler,
    onPageChange,
    onlyTerm,
    isShowLimitList,
    showLimitList,
    limitSelectControl,
    exportToXlsx,
    exportToXlsxProducts,
    inputControl,
    handleDate,
    handleBack,
    onDeleteOrder,
    finishOrderCourier,
  } = props;

  const formatNumber = num => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
  };

  const listStyle = {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  };

  const pagination =
    !loading && orders.length !== 0 ? (
      <Pagination
        pageCount={pageRange}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        initialPage={page}
        onPageChange={onPageChange}
        previousLabel={<i className="icon icon-arrow-left" />}
        nextLabel={<i className="icon icon-arrow-right" />}
        breakLabel={"..."}
        previousClassName="prev-page-btn"
        nextClassName="next-page-btn"
        breakClassName="break-page-btn"
        containerClassName="page-count-list"
        pageClassName="page-count-list-item"
        activeClassName="active-page"
      />
    ) : null;

  const emptyOrder =
    orders.length === 0 && !(loading || error) ? (
      <div className="empty-order">
        <div className="bg-img-package" />
        <div className="empty-text">{t("empty_orders")}</div>
      </div>
    ) : null;

  return (
    <div className="order-filter">
      <div className="order-filter-wrapper">
        <div className="filter-cols-wrapper">
          <div className="filter-emp">
            {filter && (
              <FilterModal
                inputControl={inputControl}
                setShow={setFilter}
                handleDate={handleDate}
              />
            )}
            <div className="filter-action">
              <div className={`filter-emp-count ${typeOrder}-stick`}>
                <div className="filter-name">
                  <span>{t("quantity")}</span>
                  <span>{ordersLength}</span>
                </div>
              </div>
              <div className={`filter-emp-price ${typeOrder}-stick`}>
                <div className="filter-name">
                  <span>{t("total_price")}</span>
                  <span>{formatNumber(priceQuantity)}</span>
                </div>
              </div>
            </div>
            <div className="filter-emp-only-term">
              <input
                type="text"
                name="onlyTerm"
                placeholder={t("search_by_id")}
                value={onlyTerm}
                onChange={inputControl}
              />
            </div>
            <div className="filter-action">
              <div
                className="kuryer-filter-icons"
                onClick={() => setFilter(!filter)}
              >
                <div>
                  <i className="icon icon-filter filter-icons"></i>
                </div>
              </div>
              <div
                className={
                  isShowLimitList ? "limit-list is-active-dd" : "limit-list"
                }
              >
                <div
                  className="dots-wrapper"
                  onClick={() => showLimitList(!isShowLimitList)}
                >
                  <div />
                  <div />
                  <div />
                </div>
                <ul>
                  {limitOptions.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className={
                          limit.value === item.value ? "active-dd-li" : ""
                        }
                        onClick={() => {
                          showLimitList(false);
                          limitSelectControl(item);
                        }}
                      >
                        {item.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="filter-order-list">
            <OrderList
              basePath="/order/filter"
              typeList={typeList}
              finishOrderCourier={finishOrderCourier}
              orders={orders}
              gprinterHandler={gprinterHandler}
              optionMenuDisabled={typeOrder === "success-from-warehouse"}
              failureHandler={failureHandler}
              deleteHandler={deleteHandler}
              telegramHandler={telegramHandler}
              handleBack={handleBack}
              courierHandler={courierHandler}
              finishOrderHandler={finishOrderHandler}
              onDeleteOrder={onDeleteOrder}
              loading={loading}
              error={error}
              listStyle={listStyle}
            />
            {emptyOrder}
          </div>
          {pagination}
          {orders.length !== 0 ? (
            <div className="exel-btn-wrapper">
              <button type="button" className="btn-xlsx" onClick={exportToXlsx}>
                {t("xlsx")}
              </button>
              <button
                type="button"
                className="btn-xlsx"
                onClick={exportToXlsxProducts}
              >
                {t("xlsx_product")}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OrderFilter;
