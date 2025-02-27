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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useGetUserWorkoutPlan } from "../query/query";
import {
  BODY_PARTS,
  LEVELS,
  WORKOUT_CATEGORIES,
} from "@src/constants/constants";

// Define the workout interface
interface Workout {
  id: string;
  name: string;
  force: string;
  level: string;
  mechanic?: string;
  equipment: string;
  category: string;
  bodyPart?: string;
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
}

const AssignWorkout: React.FC = () => {
  const { mutate: getUserWorkoutPlan, isLoading } = useGetUserWorkoutPlan();
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

  // State for new custom workout form
  const [newWorkout, setNewWorkout] = useState<Omit<Workout, "id">>({
    name: "",
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

  // Responsive color for cards
  const cardBg = useColorModeValue("white", "gray.700");

  // Modal disclosure for creating custom workout
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Handle changes for filter fields.
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    const selectedDay = selectedDays[workout.id];
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
    setSelectedDays((prev) => ({ ...prev, [workout.id]: "" }));
  };

  // Handle changes in the custom workout modal form.
  const handleNewWorkoutChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    const workoutToAdd: Workout = {
      id: Date.now().toString(),
      ...newWorkout,
    };
    // Add the new workout to the existing search results.
    setResults((prev) => [workoutToAdd, ...prev]);
    // Optionally, you could also send this data to an API endpoint.
    // Reset the form.
    setNewWorkout({
      name: "",
      force: "",
      level: "",
      mechanic: "",
      equipment: "",
      category: "",
      bodyPart: "",
    });
    onClose();
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
          <Heading color="white" fontSize={{ base: "2xl", md: "3xl" }}>
            Build Your Weekly Workout Plan
          </Heading>
          <Text color="whiteAlpha.900" mt={2}>
            Search, assign, and stay motivated!
          </Text>
        </Box>
        <IconButton
          aria-label="Add custom workout"
          icon={<AddIcon />}
          colorScheme="teal"
          onClick={onOpen}
        />
      </Flex>

      <Box bg={cardBg} borderWidth="1px" rounded="md" p={6} boxShadow="md">
        <Heading mb={4} textAlign="center">
          Search Workout Plans
        </Heading>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Search</FormLabel>
            <Input
              placeholder="Search by name or instructions"
              name="search"
              value={filters.search}
              onChange={handleInputChange}
            />
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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

          <Button colorScheme="blue" onClick={handleSearch}>
            Search Workout Plans
          </Button>
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
            <Heading size="md" mb={4}>
              Search Results
            </Heading>
            <VStack spacing={4} align="stretch">
              {results.map((workout) => (
                <Box
                  key={workout.id}
                  borderWidth="1px"
                  borderRadius="md"
                  p={4}
                  bg={cardBg}
                  boxShadow="sm"
                >
                  <Heading size="sm">{workout.name}</Heading>
                  <Text>Force: {workout.force}</Text>
                  <Text>Level: {workout.level}</Text>
                  <Text>Mechanic: {workout.mechanic || "N/A"}</Text>
                  <Text>Equipment: {workout.equipment}</Text>
                  <Text>Category: {workout.category}</Text>
                  <HStack mt={2}>
                    <Select
                      placeholder="Select day"
                      value={selectedDays[workout.id] || ""}
                      onChange={(e) =>
                        handleDayChange(workout.id, e.target.value)
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
                      Assign Workout
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        <Box mt={8}>
          <Heading size="md" mb={4}>
            Assigned Workouts for the Week
          </Heading>
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
                  assignedWorkouts[day].map((workout) => (
                    <Box
                      key={workout.id}
                      borderWidth="1px"
                      borderRadius="md"
                      p={2}
                      mt={2}
                      boxShadow="xs"
                    >
                      <Text>{workout.name}</Text>
                      <Text fontSize="sm">Force: {workout.force}</Text>
                      <Text fontSize="sm">Level: {workout.level}</Text>
                    </Box>
                  ))
                ) : (
                  <Text>No workouts assigned</Text>
                )}
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* Modal for Creating a Custom Workout */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Custom Workout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Workout name"
                  name="name"
                  value={newWorkout.name}
                  onChange={handleNewWorkoutChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Force</FormLabel>
                <Select
                  placeholder="Select force"
                  name="force"
                  value={newWorkout.force}
                  onChange={handleNewWorkoutChange}
                >
                  <option value="push">Push</option>
                  <option value="pull">Pull</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Level</FormLabel>
                <Select
                  placeholder="Select level"
                  name="level"
                  value={newWorkout.level}
                  onChange={handleNewWorkoutChange}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Mechanic</FormLabel>
                <Select
                  placeholder="Select mechanic"
                  name="mechanic"
                  value={newWorkout.mechanic}
                  onChange={handleNewWorkoutChange}
                >
                  <option value="compound">Compound</option>
                  <option value="isolation">Isolation</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Equipment</FormLabel>
                <Select
                  placeholder="Select equipment"
                  name="equipment"
                  value={newWorkout.equipment}
                  onChange={handleNewWorkoutChange}
                >
                  <option value="body only">Body Only</option>
                  <option value="dumbbell">Dumbbell</option>
                  <option value="barbell">Barbell</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  placeholder="Select category"
                  name="category"
                  value={newWorkout.category}
                  onChange={handleNewWorkoutChange}
                >
                  <option value="strength">Strength</option>
                  <option value="stretching">Stretching</option>
                  <option value="cardio">Cardio</option>
                </Select>
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
    </Container>
  );
};

export default AssignWorkout;
