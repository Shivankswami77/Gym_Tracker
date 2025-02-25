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
import React, { JSX } from "react";

import { useState } from "react";

const PAGE_SIZE = 5;

interface Column {
  key: string;
  label: string;
  render?: (item: any) => JSX.Element;
  textAlign?: "left" | "center" | "right";
}

interface TableLayoutProps {
  columns: Column[];
  data: any[];
  title: string;
  onPageChange?: (page: number) => void;
}

const TableLayout: React.FC<TableLayoutProps> = ({
  columns,
  data,
  title,
  onPageChange,
}) => {
  const [page, setPage] = useState<number>(1);
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paginatedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    onPageChange?.(newPage);
  };

  return (
    <Box borderWidth="1px" rounded="md" p={5} mx="auto">
      <Box
        borderWidth="1px"
        rounded="md"
        mx="auto"
        backgroundColor="#FFF"
        p={6}
        overflowX="auto"
      >
        <Heading paddingBottom={5} size="lg">
          {title}
        </Heading>

        <Box overflowX="auto">
          <Table size="sm">
            <Thead height={"2rem"}>
              <Tr bg="gray.100">
                {columns.map((col) => (
                  <Th textAlign={col.textAlign || "left"} key={col.key}>
                    {col.label}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((item) => (
                <Tr key={item._id}>
                  {columns.map((col) => (
                    <Td key={col.key} textAlign={col.textAlign || "left"}>
                      {col.render ? col.render(item) : item[col.key]}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <HStack justifyContent="space-between" mt={4}>
          <Button
            onClick={() => handlePageChange(page - 1)}
            isDisabled={page === 1}
          >
            Previous
          </Button>
          <Text>
            Page {page} of {totalPages}
          </Text>
          <Button
            onClick={() => handlePageChange(page + 1)}
            isDisabled={page === totalPages}
          >
            Next
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default TableLayout;
