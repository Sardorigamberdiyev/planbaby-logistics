import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import withDate from "../../../utils/withDate";
import ModalActiveOperator from "./../../modal-data/modal-data";
import totalPriceFormat from "../../../utils/totalPriceFormat";

export default function TastiqlovchiItem(props) {
  const { t } = useTranslation();
  const { data, statisticsData } = props;
  const [isModal, setShowModal] = useState(false);

  let mainHeaderText = statisticsData.find(i => i.id === data.status).name;
  let color = statisticsData.find(i => i.id === data.status).color;
  return (
    <>
      {isModal && (
        <ModalActiveOperator
          {...data}
          setIsShowModal={setShowModal}
          mainHeaderText={mainHeaderText}
        />
      )}
      <div
        className={`operator-list-item ${data.status}`}
        onClick={() => setShowModal(true)}
      >
        <div className="top" style={{ backgroundColor: color }} />
        {data.status === "active" && (
          <div
            className={data.isVerified ? "icon icon-check isVerified" : ""}
          />
        )}
        <h5>{data.firstName + " " + data.lastName} </h5>
        <p>
          {t("region")}: <span className="uc">{data.regionId.nameUz}</span>
        </p>
        <p>
          ID: <span>{data.code}</span>
        </p>
        <p>
          {t("date")}: <span>{withDate(data.date)}</span>
        </p>
        <p>
          {t("price")}:{" "}
          <span>
            {totalPriceFormat(data.totalPrice)} {t("price_currency")}
          </span>
        </p>
        <p>
          {t("operator")}: {data.userId.firstName} {data.userId.lastName}
        </p>
      </div>
    </>
  );
}
