import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import Checked from "./Checked";
import axiosInterceptors from "./../../utils/axiosInterceptors";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import "./filter-modal.css";

export default function FiterModal(props) {
  const { t } = useTranslation();
  const { inputControl, setShow, handleDate } = props;
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null,
  });
  const [regions, setRegions] = useState([]);
  const [regionsId, setRegionsId] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtsId, setDistrictsId] = useState([]);
  const [empty, setEmpty] = useState(false);

  const getViloyatlar = () => {
    axiosInterceptors.get("/api/region").then(res => {
      const { regions } = res.data;
      setRegions(regions);
    });
  };

  const getTumanlar = regionsId => {
    axiosInterceptors
      .get("/api/district/", {
        params: {
          regionsId,
        },
      })
      .then(res => {
        const { districts } = res.data;
        setDistricts(districts);
        const data = districts.map(item => ({
          id: item._id,
          regionId: item.regionId._id,
        }));
        handleDate(selectedDayRange, data);
      });
  };
  useEffect(() => {
    getViloyatlar();
  }, []);
  useEffect(() => {
    getTumanlar(regionsId);
    // eslint-disable-next-line
  }, [regionsId, empty]);

  useEffect(() => {
    handleDate(selectedDayRange, districtsId);
  }, [selectedDayRange, handleDate, districtsId]);

  return (
    <div className="filter-modal">
      <div className="filter-wrapper">
        <h5>
          {t("filter")} <span onClick={() => setShow(false)}>X</span>
        </h5>
        <label className="filter-id">
          <span>ID:</span>
          <input
            onChange={inputControl}
            placeholder="12345"
            name="term"
            type="number"
          />
        </label>
        <label className="filter-id">
          <span>{t("date")}</span>
          <DatePicker
            value={selectedDayRange}
            onChange={setSelectedDayRange}
            inputPlaceholder="Select a day"
            inputClassName="datapicker-input"
            shouldHighlightWeekends
          />
        </label>
        <div className="kuryer-modal-viloyat">
          <p>{t("region")}</p>
          <div className="kuryer-modal-input">
            <i className="icon icon-search fitermodal-search"></i>
            <input
              type="text"
              name="viloyat"
              placeholder={t("search")}
              onChange={inputControl}
            />
          </div>

          <ul className="filter-checked">
            {regions.map(item => (
              <Checked
                key={item._id}
                typeChecked="region"
                item={item}
                districts={districtsId}
                setDistrictsId={setDistrictsId}
                setEmpty={setEmpty}
                empty={empty}
                regionsDistrictsId={regionsId}
                setRegionsDistrictsId={setRegionsId}
              />
            ))}
          </ul>
        </div>
        {districts.length > 0 && (
          <div className="kuryer-modal-viloyat">
            <p>{t("district")}</p>
            <div className="kuryer-modal-input">
              <i className="icon icon-search fitermodal-search"></i>
              <input
                type="text"
                name="viloyat"
                placeholder={t("search")}
                onChange={inputControl}
              />
            </div>
            <ul className="filter-checked">
              {districts.map(item => (
                <Checked
                  key={item._id}
                  typeChecked="district"
                  item={item}
                  setEmpty={setEmpty}
                  empty={empty}
                  regionsDistrictsId={districtsId}
                  setRegionsDistrictsId={setDistrictsId}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
