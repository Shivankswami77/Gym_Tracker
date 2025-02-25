import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Button,
  HStack,
  Text,
  Heading,
} from "@chakra-ui/react";
import { useGetAllUsers } from "./query/query";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { HiEllipsisVertical } from "react-icons/hi2";

const PAGE_SIZE = 5;

const UsersList: React.FC = () => {
  const { mutate: getAllUsers } = useGetAllUsers();
  const [page, setPage] = useState<number>(1);
  const [allUsers, setAllUsers] = useState<any>([]);
  const totalPages = Math.ceil(allUsers?.length / PAGE_SIZE);

  useEffect(() => {
    getAllUsers(null, {
      onSuccess: (response: any) => {
        setAllUsers(Array.isArray(response) ? response : []);
      },
    });
  }, []);

  return (
    <Box borderWidth="1px" rounded="md" p={5} mx="auto">
      <Box
        borderWidth="1px"
        rounded="md"
        mx="auto"
        backgroundColor={"#FFF"}
        p={6}
        overflowX="auto"
      >
        <Heading paddingBottom={5} size="lg">
          Users
        </Heading>

        <Box overflowX="auto">
          <Table size="sm" minWidth="600px">
            <Thead>
              <Tr bg="gray.100">
                <Th>User Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th textAlign="end">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allUsers.map((item: any) => (
                <Tr key={item._id}>
                  <Td>{item.name}</Td>
                  <Td>{item.email}</Td>
                  <Td>{item.roleType}</Td>
                  <Td textAlign="end">
                    <Menu>
                      <MenuButton>
                        <HiEllipsisVertical size={20} />
                      </MenuButton>
                      <MenuList>
                        <MenuItem>Edit</MenuItem>
                        <MenuItem>Delete</MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <HStack justifyContent="space-between" mt={4}>
          <Button onClick={() => setPage(page - 1)} isDisabled={page === 1}>
            Previous
          </Button>
          <Text>
            Page {page} of {totalPages}
          </Text>
          <Button
            onClick={() => setPage(page + 1)}
            isDisabled={page === totalPages}
          >
            Next
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default UsersList;
