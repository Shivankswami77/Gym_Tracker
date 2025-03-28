import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Switch,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import signInImage from "@src/assets/images/signInImage.png";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { useLogin } from "./query/query";
import { SetLocalStorage } from "@src/helpers/common";
import useAuthStore from "@src/store/authStore";

const SignIn: React.FC = () => {
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.400", "white");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { mutate: loginUser, isLoading: loading } = useLogin();
  const { login } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = { email: email, password };
    onFinish(values);
  };

  const onFinish = (values: { email: string; password: string }) => {
    // Here you will call your API for login
    loginUser(values, {
      onSuccess: (response: any) => {
        SetLocalStorage("accessToken", response.token);
        login(response);
        navigate("/");
      },
    });
  };

  return (
    <Flex position="relative" mb="40px">
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        pt={{ sm: "100px", md: "0px" }}
      >
        <Flex
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}
        >
          <Flex
            direction="column"
            w="100%"
            background="transparent"
            p="48px"
            mt={{ md: "150px", lg: "80px" }}
          >
            <Heading color={titleColor} fontSize="32px" mb="10px">
              Welcome Back
            </Heading>
            <Text
              mb="36px"
              ms="4px"
              color={textColor}
              fontWeight="bold"
              fontSize="14px"
            >
              Enter your email and password to sign in
            </Text>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Email
                </FormLabel>
                <Input
                  borderRadius="15px"
                  mb="24px"
                  fontSize="sm"
                  type="email"
                  placeholder="Your email address"
                  size="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Password
                </FormLabel>
                <Input
                  borderRadius="15px"
                  mb="36px"
                  fontSize="sm"
                  type="password"
                  placeholder="Your password"
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormControl display="flex" alignItems="center">
                  <Switch
                    id="remember-login"
                    colorScheme="teal"
                    me="10px"
                    isChecked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <FormLabel
                    htmlFor="remember-login"
                    mb="0"
                    ms="1"
                    fontWeight="normal"
                  >
                    Remember me
                  </FormLabel>
                </FormControl>
                <Button
                  fontSize="10px"
                  type="submit"
                  isLoading={loading}
                  bg="teal.300"
                  w="100%"
                  h="45"
                  mb="20px"
                  color="white"
                  mt="20px"
                  _hover={{ bg: "teal.200" }}
                  _active={{ bg: "teal.400" }}
                >
                  SIGN IN
                </Button>
              </FormControl>
            </form>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              maxW="100%"
              mt="0px"
            >
              <Text color={textColor} fontWeight="medium">
                Don't have an account?
                <Link color={titleColor} as="span" ms="5px" fontWeight="bold">
                  <RouterLink to={"/sign-up"}> Sign Up</RouterLink>
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX="hidden"
          h="100%"
          w="40vw"
          position="absolute"
          right="0px"
        >
          <Box
            bgImage={signInImage}
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            borderBottomLeftRadius="20px"
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default SignIn;
