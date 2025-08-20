import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import VerifyCode from "../features/user/VerifyCode";

function ExternalPage() {
  return (
    <div className="">
      <VerifyCode />
    </div>
  );
}

export default ExternalPage;
