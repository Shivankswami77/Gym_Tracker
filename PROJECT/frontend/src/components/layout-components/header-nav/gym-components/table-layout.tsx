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
  Spinner,
} from "@chakra-ui/react";
import React, { JSX } from "react";

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
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
}

const TableLayout: React.FC<TableLayoutProps> = ({
  columns,
  data,
  title,
  isLoading,
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
}) => {
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
            <Thead>
              <Tr bg="gray.100">
                {columns.map((col) => (
                  <Th textAlign={col.textAlign || "left"} key={col.key}>
                    {col.label}
                  </Th>
                ))}
              </Tr>
            </Thead>
            {isLoading ? (
              <Tbody>
                <Tr>
                  <Td colSpan={columns.length} textAlign="center">
                    <Spinner size="md" />
                  </Td>
                </Tr>
              </Tbody>
            ) : (
              <Tbody>
                {data.map((item) => (
                  <Tr key={item._id}>
                    {columns.map((col) => (
                      <Td key={col.key} textAlign={col.textAlign || "left"}>
                        {col.render ? col.render(item) : item[col.key]}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            )}
          </Table>
        </Box>

        <HStack justifyContent="space-between" mt={4}>
          <Text>Total Records: {totalRecords}</Text>{" "}
          {/* Display total records */}
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
          >
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages}
          >
            Next
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default TableLayout;
