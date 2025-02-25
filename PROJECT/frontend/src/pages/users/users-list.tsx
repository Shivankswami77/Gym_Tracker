import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { HiEllipsisVertical } from "react-icons/hi2";
import { useGetAllUsers } from "./query/query";
import TableLayout from "@src/components/layout-components/header-nav/gym-components/table-layout";
import FormModal from "@src/components/layout-components/header-nav/gym-components/modals/form-modal";

const UsersList: React.FC = () => {
  const { mutate: getAllUsers } = useGetAllUsers();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
              <MenuItem onClick={onOpen}>Edit</MenuItem>
              <MenuItem>Delete</MenuItem>
            </MenuList>
          </Menu>
        );
      },
    },
  ];

  return (
    <>
      <TableLayout columns={columns as any} data={allUsers} title="Users" />
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title="Create your account"
        onSubmit={() => console.log("Form submitted")}
      >
        <FormControl>
          <FormLabel>First name</FormLabel>
          <Input placeholder="First name" />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Last name</FormLabel>
          <Input placeholder="Last name" />
        </FormControl>
      </FormModal>
    </>
  );
};

export default UsersList;
