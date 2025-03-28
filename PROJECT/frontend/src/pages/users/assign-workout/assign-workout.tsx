import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  useAddCustomWorkout,
  useAssignWorkoutPlanToUser,
  useDeleteCustomWorkout,
  useGetUserWorkoutPlan,
  useGetUserWorkoutPlanById, // <-- new hook for getting workout plan by id
} from "../query/query";
import { motion } from "framer-motion";
import {
  BODY_PARTS,
  LEVELS,
  WORKOUT_CATEGORIES,
} from "@src/constants/constants";
import UserDetailCard from "@src/components/layout-components/header-nav/gym-components/user-detail-card/user-detail-card";
import { useNavigate, useParams } from "react-router-dom";
import { WorkoutCard } from "@src/components/layout-components/header-nav/gym-components/workout-card/workout-card";

// Create motion-enabled components
const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionIconButton = motion(IconButton);

interface Workout {
  _id: string;
  BodyPart?: string;
  Title?: string;
  Level?: string;
  Equipment?: string;
  Desc?: string;
  isCustomWorkout?: boolean;
}

interface AssignedWorkout extends Workout {
  sets?: number;
  reps?: number;
  waitTime?: number;
}

interface FilterState {
  search: string;
  force: string;
  level: string;
  mechanic: string;
  equipment: string;
  category: string;
  bodyPart: string;
}

interface AssignedWorkouts {
  [key: string]: AssignedWorkout[];
}

const AssignWorkout: React.FC = () => {
  const toast = useToast();
  const params = useParams();
  const userId = params.id; // assume this is the user id from route params
  const navigate = useNavigate();

  // API hooks
  const { mutate: getUserWorkoutPlanById } = useGetUserWorkoutPlanById();
  const { mutate: getUserWorkoutPlan, isLoading } = useGetUserWorkoutPlan();
  const { mutate: addCustomWorkout } = useAddCustomWorkout();
  const { mutate: deleteCustomWorkout } = useDeleteCustomWorkout();
  const { mutate: assignWorkoutPlanToUser } = useAssignWorkoutPlanToUser();

  // State for workout plan - prefilled from API
  const [workoutPlan, setWorkoutPlan] = useState<AssignedWorkouts>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  // We use this state for our assigned workouts UI
  const [assignedWorkouts, setAssignedWorkouts] = useState<AssignedWorkouts>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const [results, setResults] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedCustomWorkoutId, setSelectedCustomWorkoutId] =
    useState<string>("");
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [newWorkout, setNewWorkout] = useState<Omit<Workout, "_id">>({
    Title: "",
    Level: "",
    Equipment: "",
    BodyPart: "",
  });
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    force: "",
    level: "",
    mechanic: "",
    equipment: "",
    category: "",
    bodyPart: "",
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
  const cardBg = useColorModeValue("white", "gray.700");

  // Modal controls
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

  // Fetch the user's workout plan when the component mounts
  useEffect(() => {
    if (userId) {
      setLoading(true);
      getUserWorkoutPlanById(
        { userId },
        {
          onSuccess: (response: any) => {
            if (response) {
              setWorkoutPlan(response);
              setAssignedWorkouts(response);
            }
            setLoading(false);
          },
          onError: (err: any) => {
            setError("Failed to fetch workout plan.");
            setLoading(false);
          },
        }
      );
    }
  }, [userId, getUserWorkoutPlanById]);

  // Reset filters
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
    setSelectedDays({});
  };

  // Handle filter input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle day selection for a workout from search results.
  const handleDayChange = (workoutId: string, day: string): void => {
    setSelectedDays((prev) => ({ ...prev, [workoutId]: day }));
  };

  // Fetch workouts based on filters.
  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams();
      for (const key in filters) {
        if (filters[key as keyof FilterState]) {
          queryParams.append(key, filters[key as keyof FilterState]);
        }
      }
      queryParams.append("page", "1");
      queryParams.append("limit", "20");
      getUserWorkoutPlan(
        { url: `/api/workouts?${queryParams.toString()}` },
        {
          onSuccess: (response: any) => {
            setResults(response.results || []);
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

  // When assigning a workout, check for duplicates.
  const handleAssignWorkout = (workout: Workout): void => {
    const selectedDay = selectedDays[workout._id];
    if (!selectedDay) {
      alert("Please select a day of the week for this workout.");
      return;
    }
    const dayWorkouts = assignedWorkouts[selectedDay] || [];
    if (dayWorkouts.find((w) => w._id === workout._id)) {
      toast({
        title: "Duplicate Workout",
        description: "This workout is already assigned to this day.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // Add the workout with default additional fields.
    const newAssignedWorkout: AssignedWorkout = {
      ...workout,
      sets: 0,
      reps: 0,
      waitTime: 0,
    };
    setAssignedWorkouts((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newAssignedWorkout],
    }));
    setSelectedDays((prev) => ({ ...prev, [workout._id]: "" }));
  };

  // Update assigned workout details (sets, reps, wait time)
  const updateAssignedWorkoutInfo = (
    day: string,
    workoutId: string,
    field: "sets" | "reps" | "waitTime",
    value: number
  ) => {
    setAssignedWorkouts((prev) => ({
      ...prev,
      [day]: prev[day].map((w) =>
        w._id === workoutId ? { ...w, [field]: value } : w
      ),
    }));
  };

  // Handle new custom workout input changes.
  const handleNewWorkoutChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewWorkout((prev) => ({ ...prev, [name]: value }));
  };

  // Create a new custom workout.
  const handleCreateWorkout = () => {
    addCustomWorkout(
      { newWorkout },
      {
        onSuccess: (response: any) => {
          setResults((prev) => [response.workout, ...prev]);
        },
      }
    );
    setNewWorkout({
      Title: "",
      Level: "",
      Equipment: "",
      BodyPart: "",
    });
    onClose();
  };

  // Delete a custom workout (from search results, if needed)
  const handleDeleteCustomWorkout = (id: string) => {
    deleteCustomWorkout(
      { id },
      {
        onSuccess: (response: any) => {
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

  const assignFinalWorkoutPlanToUser = () => {
    console.log(assignedWorkouts, "Final Assigned Workouts");
    assignWorkoutPlanToUser(
      { userId, assignedWorkouts },
      {
        onSuccess: (response: any) => {
          toast({
            title: "Success",
            description: "Workout plan assigned to user successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        },
      }
    );
  };

  return (
    <Container maxW={{ base: "95%", md: "80%", lg: "100%" }} py={8}>
      {/* Header */}
      <Flex
        bgGradient="linear(to-r, teal.400, blue.500)"
        p={6}
        borderRadius="md"
        mb={6}
        align="center"
        justify="space-between"
      >
        <Box textAlign="center">
          <UserDetailCard userId={userId} />
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

      {/* Search Filters */}
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
                  <option key={bodyPart.value} value={bodyPart.value}>
                    {bodyPart.label}
                  </option>
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
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
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
                  <option key={equipment.value} value={equipment.value}>
                    {equipment.label}
                  </option>
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

        {/* Search Results */}
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

        {/* Assigned Workouts Section */}
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
              <Box
                key={day}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg={cardBg}
              >
                <Heading size="sm" mb={2}>
                  {day}
                </Heading>
                {assignedWorkouts[day] && assignedWorkouts[day].length > 0 ? (
                  assignedWorkouts[day].map((workout, index) => (
                    <MotionBox
                      key={workout._id}
                      borderWidth="1px"
                      borderRadius="md"
                      p={2}
                      mt={2}
                      boxShadow="xs"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <HStack justifyContent="space-between">
                        <Text fontWeight="bold">{workout.Title}</Text>
                        <DeleteIcon
                          color="red"
                          cursor="pointer"
                          onClick={() =>
                            setAssignedWorkouts((prev) => ({
                              ...prev,
                              [day]: prev[day].filter(
                                (w) => w._id !== workout._id
                              ),
                            }))
                          }
                        />
                      </HStack>
                      <Text>Body Part: {workout.BodyPart}</Text>
                      <Text>Level: {workout.Level}</Text>
                      <Text>Equipment: {workout.Equipment}</Text>
                      <HStack spacing={2} mt={2}>
                        <FormControl>
                          <FormLabel>Sets</FormLabel>
                          <Input
                            placeholder="Sets"
                            type="number"
                            value={workout.sets ?? ""}
                            onChange={(e) =>
                              updateAssignedWorkoutInfo(
                                day,
                                workout._id,
                                "sets",
                                Number(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Reps</FormLabel>
                          <Input
                            placeholder="Reps"
                            type="number"
                            value={workout.reps ?? ""}
                            onChange={(e) =>
                              updateAssignedWorkoutInfo(
                                day,
                                workout._id,
                                "reps",
                                Number(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Wait Time</FormLabel>
                          <Input
                            placeholder="Wait Time"
                            type="number"
                            value={workout.waitTime ?? ""}
                            onChange={(e) =>
                              updateAssignedWorkoutInfo(
                                day,
                                workout._id,
                                "waitTime",
                                Number(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                      </HStack>
                    </MotionBox>
                  ))
                ) : (
                  <Text>No workouts assigned</Text>
                )}
              </Box>
            ))}
            <HStack justifyContent="flex-start">
              <Button colorScheme="blue" onClick={assignFinalWorkoutPlanToUser}>
                Submit Workout Plan
              </Button>
              <Button
                colorScheme="teal"
                onClick={() => navigate(`/user-stats/${userId}`)}
              >
                View User Workout Plan
              </Button>
            </HStack>
          </SimpleGrid>
        </Box>
      </Box>

      {/* Description Modal */}
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
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
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
                    <option key={bodyPart.value} value={bodyPart.value}>
                      {bodyPart.label}
                    </option>
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
                    <option key={equipment.value} value={equipment.value}>
                      {equipment.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Desc</FormLabel>
                <Textarea
                  placeholder="Enter Description"
                  name="Desc"
                  value={newWorkout.Desc || ""}
                  onChange={handleNewWorkoutChange}
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

      {/* Modal for Deleting a Custom Workout */}
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
            <Button
              mr={3}
              colorScheme="blue"
              onClick={onCloseDeleteWorkoutModal}
            >
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
