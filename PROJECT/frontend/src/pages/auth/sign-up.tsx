import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import BgSignUp from "@src/assets/images/BgSignUp.png";
import { useRegister } from "./query/query";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const { mutate: registerUser, isLoading: loading } = useRegister();
  const navigate = useNavigate();
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.700");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      profile: "",
      isCustomer: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      registerUser(values, {
        onSuccess: (response: any) => {
          navigate("/sign-in");
        },
      });
    },
  });

  return (
    <Flex
      direction="column"
      alignSelf="center"
      justifySelf="center"
      overflow="hidden"
    >
      <Box
        position="absolute"
        minH={{ base: "70vh", md: "50vh" }}
        w={{ md: "calc(100vw - 50px)" }}
        borderRadius={{ md: "15px" }}
        left="0"
        right="0"
        bgRepeat="no-repeat"
        overflow="hidden"
        zIndex="-1"
        top="0"
        bgImage={BgSignUp}
        bgSize="cover"
        mx={{ md: "auto" }}
        mt={{ md: "14px" }}
      />
      <Flex
        direction="column"
        textAlign="center"
        justifyContent="center"
        align="center"
        mt="6.5rem"
        mb="30px"
      >
        <Text fontSize="4xl" color="white" fontWeight="bold">
          Welcome!
        </Text>
        <Text
          fontSize="md"
          color="white"
          fontWeight="normal"
          mt="10px"
          mb="26px"
          w={{ base: "90%", sm: "60%", lg: "40%", xl: "30%" }}
        >
          Sign Up for free.
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        <Flex
          direction="column"
          w="445px"
          background="transparent"
          borderRadius="15px"
          p="40px"
          bg={bgColor}
          boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
          <Text
            fontSize="lg"
            color="gray.400"
            fontWeight="bold"
            textAlign="center"
            mb="22px"
          >
            Sign Up
          </Text>
          <form onSubmit={formik.handleSubmit}>
            <FormControl
              isInvalid={formik.touched.name && Boolean(formik.errors.name)}
            >
              <FormLabel>Name</FormLabel>
              <Input
                id="name"
                name="name"
                placeholder="Your full name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Text color="red.500" fontSize="sm">
                {formik.touched.name && formik.errors.name}
              </Text>
            </FormControl>
            <FormControl
              isInvalid={formik.touched.email && Boolean(formik.errors.email)}
              mt={4}
            >
              <FormLabel>Email</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Your email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Text color="red.500" fontSize="sm">
                {formik.touched.email && formik.errors.email}
              </Text>
            </FormControl>
            <FormControl
              isInvalid={
                formik.touched.password && Boolean(formik.errors.password)
              }
              mt={4}
            >
              <FormLabel>Password</FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Text color="red.500" fontSize="sm">
                {formik.touched.password && formik.errors.password}
              </Text>
            </FormControl>

            <Button
              type="submit"
              bg="teal.300"
              color="white"
              fontWeight="bold"
              isLoading={loading}
              w="100%"
              mt={6}
              _hover={{ bg: "teal.200" }}
            >
              SIGN UP
            </Button>
          </form>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mt={4}
          >
            <Text color={textColor} fontWeight="medium">
              Already have an account?
              <Link
                color={titleColor}
                as="span"
                ms="5px"
                href="#"
                fontWeight="bold"
              >
                <RouterLink to={"/sign-in"}> Sign In</RouterLink>
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SignUp;
