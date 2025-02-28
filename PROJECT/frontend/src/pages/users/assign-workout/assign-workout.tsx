import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Container,
  SimpleGrid,
  Flex,
  useColorModeValue,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  useToast,
  Wrap,
  WrapItem,
  Avatar,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  useAddCustomWorkout,
  useDeleteCustomWorkout,
  useGetUserWorkoutPlan,
} from "../query/query";
import { motion } from "framer-motion";

import {
  BODY_PARTS,
  LEVELS,
  WORKOUT_CATEGORIES,
} from "@src/constants/constants";
import { WorkoutCard } from "@src/components/layout-components/header-nav/gym-components/workout-card/workout-card";
import UserDetailCard from "@src/components/layout-components/header-nav/gym-components/user-detail-card/user-detail-card";
import { useParams } from "react-router-dom";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionIconButton = motion(IconButton);

// Define the workout interface
interface Workout {
  _id: string;
  BodyPart?: string;
  Title?: string;
  Level?: string;
  Equipment?: string;
  Desc?: string;
}

// Define the filter state interface
interface FilterState {
  search: string;
  force: string;
  level: string;
  mechanic: string;
  equipment: string;
  category: string;
  bodyPart: string;
}

// Define the assigned workouts interface
interface AssignedWorkouts {
  [key: string]: Workout[];
}

// Define the selected days interface
interface SelectedDays {
  [key: string]: string;
}

// Define API response interface
interface ApiResponse {
  results: Workout[];
  workout?: any;
}

const AssignWorkout: React.FC = () => {
  const toast = useToast();
  const params = useParams();
  const { mutate: getUserWorkoutPlan, isLoading } = useGetUserWorkoutPlan();
  const { mutate: addCustomWorkout } = useAddCustomWorkout();
  const { mutate: deleteCustomWorkout } = useDeleteCustomWorkout();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    force: "",
    level: "",
    mechanic: "",
    equipment: "",
    category: "",
    bodyPart: "",
  });

  // State for search results, loading and error
  const [results, setResults] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // State to track the selected day for each workout result
  const [selectedDays, setSelectedDays] = useState<SelectedDays>({});
  const [selectedCustomWorkoutId, setSelectedCustomWorkoutId] =
    useState<string>("");

  // State to track assigned workouts grouped by day
  const [assignedWorkouts, setAssignedWorkouts] = useState<AssignedWorkouts>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const [selectedDescription, setSelectedDescription] = useState<any>("");

  // State for new custom workout form
  const [newWorkout, setNewWorkout] = useState<Omit<Workout, "_id">>({
    Title: "",
    Level: "",
    Equipment: "",
    BodyPart: "",
  });

  const daysOfWeek: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const handleResetFilters = () => {
    setFilters({
      search: "",
      force: "",
      level: "",
      mechanic: "",
      equipment: "",
      category: "",
      bodyPart: "",
    });
    // Optionally, clear selected days as well if needed:
    setSelectedDays({});
  };
  // Responsive color for cards
  const cardBg = useColorModeValue("white", "gray.700");

  // Modal disclosure for creating custom workout
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDescModal,
    onOpen: onOpenDescModal,
    onClose: onCloseDescModal,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteWorkoutModal,
    onOpen: onOpenDeleteWorkoutModal,
    onClose: onCloseDeleteWorkoutModal,
  } = useDisclosure();

  // Handle changes for filter fields.
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle the day selection for a specific workout result.
  const handleDayChange = (workoutId: string, day: string): void => {
    setSelectedDays((prev) => ({
      ...prev,
      [workoutId]: day,
    }));
  };

  // Fetch workouts from the API endpoint using the filter criteria.
  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      // Build query params from filter state.
      const queryParams = new URLSearchParams();
      for (const key in filters) {
        if (filters[key as keyof FilterState]) {
          queryParams.append(key, filters[key as keyof FilterState]);
        }
      }
      // Default pagination: page 1 and limit 20.
      queryParams.append("page", "1");
      queryParams.append("limit", "20");
      getUserWorkoutPlan(
        { url: `/api/workouts?${queryParams.toString()}` },
        {
          onSuccess: (response: ApiResponse) => {
            setResults(response.results);
            if (response.results?.length === 0) {
              toast({
                title: "Error",
                description: "No records found for the searched criteria",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            }
          },
        }
      );
    } catch (err) {
      console.error("Error fetching workouts:", err);
      setError("Failed to fetch workouts.");
    } finally {
      setLoading(false);
    }
  };

  // Assign the selected workout to the chosen day.
  const handleAssignWorkout = (workout: Workout): void => {
    const selectedDay = selectedDays[workout._id];
    if (!selectedDay) {
      alert("Please select a day of the week for this workout.");
      return;
    }
    setAssignedWorkouts((prev) => {
      const updatedDayWorkouts = prev[selectedDay]
        ? [...prev[selectedDay], workout]
        : [workout];
      return {
        ...prev,
        [selectedDay]: updatedDayWorkouts,
      };
    });
    // Clear the day selection for the workout after assignment.
    setSelectedDays((prev) => ({ ...prev, [workout._id]: "" }));
  };

  // Handle changes in the custom workout modal form.
  const handleNewWorkoutChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewWorkout((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submission of the custom workout form.
  const handleCreateWorkout = () => {
    // Create a new workout with a generated id.

    addCustomWorkout(
      { newWorkout },
      {
        onSuccess: (response: ApiResponse) => {
          setResults((prev) => [response.workout, ...prev]);
        },
      }
    );
    // Add the new workout to the existing search results.
    // Optionally, you could also send this data to an API endpoint.
    // Reset the form.
    setNewWorkout({
      Title: "",
      Level: "",
      Equipment: "",
      BodyPart: "",
    });
    onClose();
  };
  const handleDeleteCustomWorkout = (id: string) => {
    deleteCustomWorkout(
      { id },
      {
        onSuccess: (response: ApiResponse) => {
          toast({
            title: "Success",
            description: "Workout has been deleted",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          handleSearch();
          onCloseDeleteWorkoutModal();
        },
      }
    );
  };

  const handleRemoveAssignedWorkout = (day: string, workoutId: string) => {
    setAssignedWorkouts((prev) => ({
      ...prev,
      [day]: prev[day].filter((workout) => workout._id !== workoutId),
    }));
  };

  return (
    <Container maxW={{ base: "95%", md: "80%", lg: "100%" }} py={8}>
      {/* Creative Header with Add Icon */}
      <Flex
        bgGradient="linear(to-r, teal.400, blue.500)"
        p={6}
        borderRadius="md"
        mb={6}
        align="center"
        justify="space-between"
      >
        <Box textAlign="center">
          <UserDetailCard userId={params.id} />

          <Heading color="white" fontSize={{ base: "2xl", md: "3xl" }}>
            Build Weekly Workout Plan
          </Heading>
          <Text color="whiteAlpha.900" mt={2}>
            Search, assign, and stay motivated!
          </Text>
        </Box>
        <MotionIconButton
          aria-label="Add custom workout"
          icon={<AddIcon />}
          colorScheme="teal"
          onClick={onOpen}
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </Flex>

      <Box bg={cardBg} borderWidth="1px" rounded="md" p={6} boxShadow="md">
        <Heading mb={4} textAlign="center">
          Search Workout Plans
        </Heading>
        <VStack spacing={4} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl>
              <FormLabel>Search</FormLabel>
              <Input
                placeholder="Search by name or instructions"
                name="search"
                value={filters.search}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Body Part</FormLabel>
              <Select
                placeholder="Select Body Part"
                name="bodyPart"
                value={filters.bodyPart}
                onChange={handleInputChange}
              >
                {BODY_PARTS.map((bodyPart) => (
                  <option value={bodyPart.value}>{bodyPart.label}</option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl>
              <FormLabel>Level</FormLabel>
              <Select
                placeholder="Select Level"
                name="level"
                value={filters.level}
                onChange={handleInputChange}
              >
                {LEVELS.map((level) => (
                  <option value={level.value}>{level.label}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Equipment</FormLabel>
              <Select
                placeholder="Select Equipment"
                name="equipment"
                value={filters.equipment}
                onChange={handleInputChange}
              >
                {WORKOUT_CATEGORIES.map((equipment) => (
                  <option value={equipment.value}>{equipment.label}</option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>

          <HStack spacing={4}>
            <Button
              colorScheme="blue"
              onClick={handleSearch}
              isLoading={isLoading}
              loadingText="Searching..."
            >
              Search Workout Plans
            </Button>
            <Button
              onClick={handleResetFilters}
              colorScheme="gray"
              variant="outline"
            >
              Reset Filters
            </Button>
          </HStack>
        </VStack>

        {loading && (
          <Flex justify="center" mt={4}>
            <Spinner />
          </Flex>
        )}
        {error && (
          <Alert status="error" mt={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        {results.length > 0 && (
          <Box mt={8}>
            <MotionHeading
              size="md"
              mb={4}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Search Results
            </MotionHeading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {results.map((workout: any, index) => (
                <MotionBox
                  key={workout._id}
                  borderWidth="1px"
                  borderRadius="md"
                  p={4}
                  bg={cardBg}
                  boxShadow="lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                >
                  {/* <MotionHeading
                    size="sm"
                    mb={2}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    {workout.name}
                  </MotionHeading> */}
                  <WorkoutCard
                    workout={workout}
                    setSelectedCustomWorkoutId={setSelectedCustomWorkoutId}
                    onOpenDeleteWorkoutModal={onOpenDeleteWorkoutModal}
                    onOpenDescModal={onOpenDescModal}
                    setSelectedDescription={setSelectedDescription}
                  >
                    <HStack>
                      <Select
                        placeholder="Select day"
                        value={selectedDays[workout._id] || ""}
                        onChange={(e) =>
                          handleDayChange(workout._id, e.target.value)
                        }
                      >
                        {daysOfWeek.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </Select>
                      <Button
                        colorScheme="teal"
                        onClick={() => handleAssignWorkout(workout)}
                      >
                        Assign
                      </Button>
                    </HStack>
                  </WorkoutCard>
                </MotionBox>
              ))}
            </SimpleGrid>
          </Box>
        )}

        <Box mt={8}>
          <MotionHeading
            size="md"
            mb={4}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Assigned Workouts for the Week
          </MotionHeading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {daysOfWeek.map((day) => (
              <MotionBox
                key={day}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg={cardBg}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
              >
                <Heading size="sm" mb={2}>
                  {day}
                </Heading>
                {assignedWorkouts[day] && assignedWorkouts[day].length > 0 ? (
                  assignedWorkouts[day].map((workout, index) => (
                    <Box
                      key={workout._id}
                      borderWidth="1px"
                      borderRadius="md"
                      p={2}
                      mt={2}
                      boxShadow="xs"
                    >
                      <HStack mt={2} justifyContent={"space-between"}>
                        {" "}
                        <Text fontWeight="bold">{workout.Title}</Text>
                        <DeleteIcon
                          color={"red"}
                          cursor={"pointer"}
                          onClick={() =>
                            handleRemoveAssignedWorkout(day, workout._id)
                          }
                        />
                      </HStack>

                      <Text>Body Part: {workout.BodyPart}</Text>
                      <Text>Level: {workout.Level}</Text>
                    </Box>
                  ))
                ) : (
                  <Text>No workouts assigned</Text>
                )}
              </MotionBox>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
      <Modal isOpen={isOpenDescModal} onClose={onCloseDescModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Workout Description</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{selectedDescription}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onCloseDescModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal for Creating a Custom Workout */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Custom Workout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Workout</FormLabel>
                <Input
                  placeholder="Workout name"
                  name="Title"
                  value={newWorkout.Title}
                  onChange={handleNewWorkoutChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Level</FormLabel>
                <Select
                  placeholder="Select level"
                  name="Level"
                  value={newWorkout.Level}
                  onChange={handleNewWorkoutChange}
                >
                  {LEVELS.map((level) => (
                    <option value={level.value}>{level.label}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Body Part</FormLabel>
                <Select
                  placeholder="Select Body Part"
                  name="BodyPart"
                  value={newWorkout.BodyPart}
                  onChange={handleNewWorkoutChange}
                >
                  {BODY_PARTS.map((bodyPart) => (
                    <option value={bodyPart.value}>{bodyPart.label}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Equipment</FormLabel>
                <Select
                  placeholder="Select equipment"
                  name="Equipment"
                  value={newWorkout.Equipment}
                  onChange={handleNewWorkoutChange}
                >
                  {WORKOUT_CATEGORIES.map((equipment) => (
                    <option value={equipment.value}>{equipment.label}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Desc</FormLabel>
                <Textarea
                  placeholder="Enter Description"
                  value={newWorkout.Desc}
                  onChange={handleNewWorkoutChange}
                  name="Desc"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleCreateWorkout}>
              Create Workout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenDeleteWorkoutModal}
        onClose={onCloseDeleteWorkoutModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Workout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this workout?</Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} colorScheme="blue" onClick={onCloseDescModal}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => handleDeleteCustomWorkout(selectedCustomWorkoutId)}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AssignWorkout;
