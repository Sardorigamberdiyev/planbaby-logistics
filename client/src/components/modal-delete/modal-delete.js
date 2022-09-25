import React from "react";
import { useTranslation } from "react-i18next";
import "./modal-delete.css";

const ModalDelete = ({
  code,
  id,
  setIsShowModalDelete,
  deleteBrone,
  textHeader,
}) => {
  const { t } = useTranslation();
  return (
    <div className="modal-delete">
      <div className="modal-content">
        <h1>
          {textHeader
            ? textHeader[1] + " " + textHeader[0].toLowerCase() + " " + code
            : t("delete_modal_text", { code })}
        </h1>
        <div className="btn-wrapper">
          <button
            className="btn-cancel"
            onClick={() => setIsShowModalDelete(false)}
          >
            {t("btn_no")}
          </button>
          <button className="btn-delete" onClick={() => deleteBrone(id)}>
            {t("btn_yes")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
