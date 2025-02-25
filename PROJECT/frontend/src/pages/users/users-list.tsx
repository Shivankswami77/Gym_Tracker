import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { HiEllipsisVertical } from "react-icons/hi2";
import { useGetAllUsers } from "./query/query";
import TableLayout from "@src/components/layout-components/header-nav/gym-components/table-layout";

const UsersList: React.FC = () => {
  const { mutate: getAllUsers } = useGetAllUsers();
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    getAllUsers(null, {
      onSuccess: (response: any) => {
        setAllUsers(Array.isArray(response) ? response : []);
      },
    });
  }, []);

  const columns = [
    { key: "name", label: "User Name" },
    { key: "email", label: "Email" },
    { key: "roleType", label: "Role" },
    {
      key: "action",
      label: "Action",
      textAlign: "right",
      render: (item: any) => {
        if (item.roleType === "Admin") return "";
        return (
          <Menu>
            <MenuButton>
              <HiEllipsisVertical size={20} />
            </MenuButton>
            <MenuList>
              <MenuItem>Edit</MenuItem>
              <MenuItem>Delete</MenuItem>
            </MenuList>
          </Menu>
        );
      },
    },
  ];

  return <TableLayout columns={columns as any} data={allUsers} title="Users" />;
};

export default UsersList;
