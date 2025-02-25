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
import { useDeleteUser, useGetAllUsers } from "./query/query";
import TableLayout from "@src/components/layout-components/header-nav/gym-components/table-layout";
import FormModal from "@src/components/layout-components/header-nav/gym-components/modals/form-modal";

const UsersList: React.FC = () => {
  const { mutate: getAllUsers, isLoading } = useGetAllUsers();
  const { mutate: deleteUser } = useDeleteUser();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [refresh, setRefresh] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getAllUsers(null, {
      onSuccess: (response: any) => {
        setAllUsers(Array.isArray(response) ? response : []);
      },
    });
  }, [refresh]);

  const onClickDeleteUser = (userId: string) => {
    deleteUser(userId, {
      onSuccess: (response: any) => {
        setRefresh((prev: number) => prev + 1);
      },
    });
  };
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
              <MenuItem onClick={() => onClickDeleteUser(item._id)}>
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        );
      },
    },
  ];

  return (
    <>
      <TableLayout
        columns={columns as any}
        data={allUsers}
        title="Users"
        isLoading={isLoading}
      />
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
