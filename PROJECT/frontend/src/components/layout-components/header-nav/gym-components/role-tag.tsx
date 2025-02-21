import React from "react";

const RoleTag: React.FC<any> = ({ role }) => {
  switch (role) {
    case "Admin":
      return <span>Admin</span>;
    case "Customer":
      return <span>Customer</span>;
    case "Coach":
      return <span>Trainer</span>;

    default:
      break;
  }
};

export default RoleTag;
