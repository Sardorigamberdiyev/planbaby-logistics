import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInter from "./../../utils/axiosInterceptors";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import "./merege-task.css";

function Meregetask({ setMeregetask }) {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([]);
  const { t } = useTranslation();

  const getOperators = (term = "") => {
    axiosInter.get(`/api/user/by/name?term=${term}`).then(res => {
      setOptions(
        res.data.map(item => {
          return {
            value: item._id,
            label: `${item.firstName} ${item.lastName} / ${item.phone}`,
          };
        }),
      );
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    let [startYear, startMonth, startDay] = start.split("-");
    let [endYear, endMonth, endDay] = end.split("-");

    const startValue = new Date(
      Date.UTC(
        startYear,
        Number(startMonth) - 1,
        startDay,
        0,
        0,
        0,
        0
      )
    ).toISOString();
    const endValue = new Date(
      Date.UTC(
        endYear,
        Number(endMonth) - 1,
        endDay,
        23,
        59,
        59,
        999
      )
    ).toISOString();

    const data = {
      userId: userId.value,
      name,
      count: Number(count),
      start: startValue,
      end: endValue,
      description,
    };
    axiosInter
      .post("/api/task", data)
      .then(res => {
        toast.success(res.data.successMessage);
        setUserId("");
        setCount("");
        setName("");
        setStart("");
        setEnd("");
        setDescription("");
        setMeregetask(false);
      })
      .catch(err => {
        toast.error(err.errorMessage);
      });
  };

  useEffect(() => {
    getOperators();
  }, []);
  return (
    <div className="modal-merege">
      <div className="modal-content">
        <h1>
          {t("operator_task")}
          <span onClick={() => setMeregetask(false)}>X</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <Select
            options={options}
            value={userId}
            onChange={e => setUserId(e)}
            placeholder={t("operator_name_tel")}
          />
          <div className="merege-input-group input_1">
            <label>{t("task_count")}</label>
            <input
              required
              type="number"
              name="count"
              value={count}
              placeholder="150"
              onChange={e => setCount(e.target.value)}
            />
          </div>
          <div className="merege-input-group input_2">
            <label>{t("task_name")}</label>
            <input
              required
              name="name"
              value={name}
              placeholder="Заказ уришин керак"
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="merege-input-group input_3">
            <label>{t("task_start")}</label>
            <input
              required
              type="date"
              name="start"
              value={start}
              placeholder="20.06.2022"
              onChange={e => {
                setStart(e.target.value);
              }}
            />
          </div>
          <div className="merege-input-group input_4">
            <label>{t("task_end")}</label>
            <input
              required
              type="date"
              name="end"
              value={end}
              placeholder="20.06.2022"
              onChange={e => setEnd(e.target.value)}
            />
          </div>
          <div className="merege-input-group input_5">
            <label>{t("task_comment")}</label>
            <textarea
              name="description"
              value={description}
              placeholder="Название задания"
              onChange={e => setDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit">{t("btn_attach")}</button>
        </form>
      </div>
    </div>
  );
}

export default Meregetask;
