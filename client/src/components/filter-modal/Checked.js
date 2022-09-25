import React, { useState } from "react";

function Checked({
  item,
  setRegionsDistrictsId,
  regionsDistrictsId,
  typeChecked,
  districts,
  setDistrictsId,
  setEmpty,
  empty,
}) {
  const [check, setCheck] = useState(false);
  const handleChange = id => {
    if (!check) {
      const typeValues =
        typeChecked === "region" ? id : { id, regionId: item.regionId._id };

      setRegionsDistrictsId([...regionsDistrictsId, typeValues]);
    } else {
      if (typeChecked === "region")
        setDistrictsId([...districts.filter(item => item.regionId !== id)]);
      const regId = regionsDistrictsId.filter(
        typeChecked === "region" ? item => item !== id : item => item.id !== id,
      );
      console.log(regId);
      if (regId.length === 0) setEmpty(!empty);
      setRegionsDistrictsId(regId);
    }
    setCheck(!check);
  };
  return (
    <li onClick={() => handleChange(item._id)}>
      <div
        className={!check ? "input-checked" : "input-checked active-checker"}
      />
      <span className={check ? "active" : ""}>{item.nameUz}</span>
    </li>
  );
}

export default Checked;
