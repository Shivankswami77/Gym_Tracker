import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  VStack,
  useToast,
  Text,
  Image as ImageComponent,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useGetUserDetailsById, useUpdateUserProfile } from "./query/query";
import { useParams } from "react-router-dom";

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
  height: Yup.number()
    .required("Height is required")
    .min(50, "Invalid height")
    .max(250, "Invalid height"),
  weight: Yup.number()
    .required("Weight is required")
    .min(10, "Invalid weight")
    .max(300, "Invalid weight"),
});

const MyProfileForm: React.FC = () => {
  const toast = useToast();
  const { mutate: getUserDetailsById } = useGetUserDetailsById();
  const { mutate: updateUserDetailsById, isLoading: submitUserDetailsLoading } =
    useUpdateUserProfile();
  const params = useParams();
  const [userDetails, setUserDetails] = useState<any>({});
  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    if (params.id) {
      getUserDetailsById(params.id, {
        onSuccess: (response: any) => {
          setUserDetails(response);
          if (response.profilePicture) setImagePreview(response.profilePicture);
        },
      });
    }
  }, [params.id]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const handleImageUpload = (event: any, setFieldValue: any) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (jpeg, jpg, png).",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const scaleSize = 200;
          canvas.width = scaleSize;
          canvas.height = (img.height / img.width) * scaleSize;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convert to Base64
          const base64Image = canvas.toDataURL("image/jpeg", 0.7);

          // Check size after conversion
          const byteSize = base64Image.length * (3 / 4) - 2;
          if (byteSize <= 50000) {
            setFieldValue("profilePicture", base64Image);
            setImagePreview(base64Image);
          } else {
            toast({
              title: "Image too large",
              description: "Please upload an image under 50KB.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        };
      };
    }
  };

  const calculateBMI = (height: number, weight: number) => {
    if (height > 0 && weight > 0) {
      const bmiValue = (weight / ((height / 100) * (height / 100))).toFixed(2);
      setBmi(parseFloat(bmiValue));
    } else {
      setBmi(null);
    }
  };

  const handleSubmit = (values: any) => {
    console.log(values, "'values");
    updateUserDetailsById(
      { userId: userDetails._id, ...values, bmi },
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
          height: userDetails?.height || "",
          weight: userDetails?.weight || "",
          profilePicture: null,
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Field as={Input} name="name" placeholder="Enter your name" />
                {errors.name && touched.name && (
                  <Text color="red.500">{errors.name}</Text>
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
                  <Text color="red.500">{errors.age}</Text>
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
                  <Text color="red.500">{errors.gender}</Text>
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
                <FormLabel>Address</FormLabel>
                <Field
                  as={Input}
                  name="address"
                  placeholder="Enter your address"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Weight (kg)</FormLabel>
                <Field
                  as={Input}
                  name="weight"
                  type="number"
                  placeholder="Enter weight in kg"
                  onChange={(e: any) => {
                    setFieldValue("weight", e.target.value);
                    calculateBMI(Number(values.height), Number(e.target.value));
                  }}
                />
                {errors.weight && touched.weight && (
                  <Text color="red.500">{errors.weight}</Text>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Height (cm)</FormLabel>
                <Field
                  as={Input}
                  name="height"
                  type="number"
                  placeholder="Enter height in cm"
                  onChange={(e: any) => {
                    setFieldValue("height", e.target.value);
                    calculateBMI(Number(e.target.value), Number(values.weight));
                  }}
                />
                {errors.height && touched.height && (
                  <Text color="red.500">{errors.height}</Text>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Profile Picture</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setFieldValue)}
                />

                {imagePreview && (
                  <ImageComponent
                    src={imagePreview}
                    alt="Profile Preview"
                    boxSize="100px"
                    mt={2}
                  />
                )}
                {errors.profilePicture && touched.profilePicture && (
                  <Text color="red.500">{errors.profilePicture}</Text>
                )}
              </FormControl>
              {bmi !== null && (
                <Text fontSize="lg" color="teal.500">
                  BMI: {bmi}
                </Text>
              )}
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
