import { Avatar, Stack, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { useGetUserDetailsById } from "@src/pages/my-profile/query/query";
import React, { useEffect, useState } from "react";

const UserDetailCard: React.FC<any> = ({ userId }) => {
  const { mutate: getUserDetailsById } = useGetUserDetailsById();
  const [userDetails, setUserDetails] = useState<any>({});

  useEffect(() => {
    if (userId) {
      getUserDetailsById(userId, {
        onSuccess: (response: any) => {
          setUserDetails(response);
        },
      });
    }
  }, [userId]);
  return (
    <Stack gap="8">
      <WrapItem>
        <Avatar
          size="xl"
          name={userDetails?.name}
          color={"white"}
          cursor={"pointer"}
          bg={"pink.400"}
        />
        <Text
          position="absolute"
          fontSize="lg"
          color="white"
          fontWeight="bold"
          pointerEvents="none"
          left="141px"
          top="155px"
        >
          {userDetails?.name}
        </Text>
      </WrapItem>
    </Stack>
  );
};

export default UserDetailCard;
