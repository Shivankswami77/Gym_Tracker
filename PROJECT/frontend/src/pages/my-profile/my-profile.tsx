import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useGetUserDetailsById, useUpdateUserProfile } from "./query/query";
import { useParams } from "react-router-dom";

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  age: Yup.number()
    .required("Age is required")
    .min(1, "Age must be at least 1")
    .max(120, "Invalid age"),
  gender: Yup.string().required("Gender is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  address: Yup.string().required("Address is required"),
});

const MyProfileForm: React.FC = () => {
  const toast = useToast();
  const { mutate: getUserDetailsById, isLoading: loading } =
    useGetUserDetailsById();
  const { mutate: updateUserDetailsById, isLoading: submitUserDetailsLoading } =
    useUpdateUserProfile();
  const params = useParams();
  const [userDetails, setUserDetails] = useState<any>({});
  useEffect(() => {
    if (params.id) {
      getUserDetailsById(params.id, {
        onSuccess: (response: any) => {
          console.log(response);
          setUserDetails(response);
        },
      });
    }
  }, [params.id]);
  const handleSubmit = (values: any) => {
    console.log("Form Submitted:", values);
    updateUserDetailsById(
      { userId: userDetails._id, ...values },
      {
        onSuccess: (response) => {
          setUserDetails(response);
          toast({
            title: "Profile Updated",
            description: "Your profile details have been successfully updated.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        },
      }
    );
  };
  return (
    <Box p={6} maxW="500px" mx="auto" backgroundColor={"#FFF"}>
      <Heading mb={6} textAlign="center">
        My Profile
      </Heading>
      <Formik
        initialValues={{
          name: userDetails?.name || "",
          age: userDetails?.age || "",
          gender: userDetails?.gender || "",
          email: userDetails?.email || "",
          phone: userDetails?.phone || "",
          address: userDetails?.address || "",
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Field as={Input} name="name" placeholder="Enter your name" />
                {errors.name && touched.name && (
                  <Box color="red.500" fontSize="sm">
                    {errors.name}
                  </Box>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Age</FormLabel>
                <Field
                  as={Input}
                  name="age"
                  type="number"
                  placeholder="Enter your age"
                />
                {errors.age && touched.age && (
                  <Box color="red.500" fontSize="sm">
                    {errors.age}
                  </Box>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Gender</FormLabel>
                <Field as={Select} name="gender" placeholder="Select gender">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Field>
                {errors.gender && touched.gender && (
                  <Box color="red.500" fontSize="sm">
                    {errors.gender}
                  </Box>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Field
                  as={Input}
                  name="email"
                  type="email"
                  disabled={true}
                  placeholder="Enter your email"
                />
                {errors.email && touched.email && (
                  <Box color="red.500" fontSize="sm">
                    {errors.email}
                  </Box>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Field
                  as={Input}
                  name="phone"
                  type="text"
                  placeholder="Enter your phone number"
                />
                {errors.phone && touched.phone && (
                  <Box color="red.500" fontSize="sm">
                    {errors.phone}
                  </Box>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Address</FormLabel>
                <Field
                  as={Input}
                  name="address"
                  placeholder="Enter your address"
                />
                {errors.address && touched.address && (
                  <Box color="red.500" fontSize="sm">
                    {errors.address}
                  </Box>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                isLoading={submitUserDetailsLoading}
              >
                Update Profile
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default MyProfileForm;
