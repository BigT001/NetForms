import React from "react";

function FormUi({jsonform}) {
  return (
    <div>
      <h2>{jsonform?.form_title}</h2>
      <h2>{jsonform?.form_subheading}</h2>
    </div>
  );
}

export default FormUi;
