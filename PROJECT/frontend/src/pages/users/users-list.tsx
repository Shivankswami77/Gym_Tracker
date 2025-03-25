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
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
  useToast,
} from "@chakra-ui/react";
import { HiEllipsisVertical } from "react-icons/hi2";
import { useDeleteUser, useGetAllUsers } from "./query/query";
import TableLayout from "@src/components/layout-components/header-nav/gym-components/table-layout";
import FormModal from "@src/components/layout-components/header-nav/gym-components/modals/form-modal";
import { useNavigate } from "react-router-dom";

const UsersList: React.FC = () => {
  const PAGE_LIMIT = 5;
  const { mutate: getAllUsers, isLoading } = useGetAllUsers();
  const { mutate: deleteUser } = useDeleteUser();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(1);
  const [selectedId, setSelectedId] = useState<string>("");
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDeleteUserModal,
    onOpen: onOpenDeleteUserModal,
    onClose: onCloseDeleteUserModal,
  } = useDisclosure();
  const {
    isOpen: isOpenAssignUserWorkoutModal,
    onOpen: onOpenAssignUserWorkoutModal,
    onClose: onCloseAssignUserWorkoutModal,
  } = useDisclosure();

  const fetchUsers = (page: number) => {
    getAllUsers(
      { page, limit: PAGE_LIMIT },
      {
        onSuccess: (response: any) => {
          setAllUsers(Array.isArray(response.data) ? response.data : []);
          setTotalRecords(response.totalRecords || 0);
        },
      }
    );
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, refresh]);

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    onOpenDeleteUserModal();
  };
  const onClickDeleteUser = (userId: string) => {
    deleteUser(userId, {
      onSuccess: (response: any) => {
        setSelectedId("");
        setRefresh((prev: number) => prev + 1);
        onCloseDeleteUserModal();
        toast({
          title: "Success",
          description: "User Deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
    });
  };
  const totalPages = Math.ceil(totalRecords / PAGE_LIMIT); // Calculate total pages

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
              <MenuItem
                onClick={() => navigate(`/assign-workout-to-user/${item._id}`)}
              >
                Assign Workout
              </MenuItem>
              <MenuItem onClick={() => navigate(`/user-stats/${item._id}`)}>
                User Stats
              </MenuItem>
              <MenuItem onClick={() => handleDeleteClick(item._id)}>
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
        currentPage={currentPage}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        totalPages={totalPages}
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
      <Modal
        closeOnOverlayClick={true}
        isOpen={isOpenDeleteUserModal}
        onClose={onCloseDeleteUserModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete User</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            Are you sure you want to delete? This operation can't be undone.
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                onClickDeleteUser(selectedId);
              }}
            >
              Delete
            </Button>
            <Button onClick={onCloseDeleteUserModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UsersList;
