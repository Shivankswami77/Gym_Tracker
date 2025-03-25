import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  Input,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  useGetUserWorkoutPlanById,
  useUpdateUserStatsWorkoutPlanById,
} from "../query/query";
import { debounce } from "lodash";

// Interfaces for workout and workout plan.
interface Workout {
  _id: string;
  isCustomWorkout?: boolean;
  Title?: string;
  Desc?: string;
  Type?: string;
  BodyPart?: string;
  Equipment?: string;
  Level?: string;
  Rating?: string;
  RatingDesc?: string;
  completed?: boolean;
}

interface WorkoutPlan {
  _id: string;
  user: string;
  Monday: Workout[];
  Tuesday: Workout[];
  Wednesday: Workout[];
  Thursday: Workout[];
  Friday: Workout[];
  Saturday: Workout[];
  Sunday: Workout[];
  createdAt: string;
  updatedAt: string;
}

// Days of week array.
const daysOfWeek: string[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Motion-enabled Box component.
const MotionBox = motion(Box);

const UserWorkoutScheduleWithCompletion: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>();
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedWorkoutDesc, setSelectedWorkoutDesc] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue("white", "gray.700");

  const { mutate: getUserWorkoutPlanById } = useGetUserWorkoutPlanById();
  const { mutate: updateUserStatsWorkoutPlanById } =
    useUpdateUserStatsWorkoutPlanById();

  // Determine the current day (e.g., "Monday").
  const currentDay: string = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getUserWorkoutPlanById(
        { userId },
        {
          onSuccess: (response: any) => {
            setWorkoutPlan(response);
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

  // Toggle the "completed" state (only for the current day).

  // Reset all workouts' completed status to false.
  const resetWorkoutSchedule = () => {
    if (!workoutPlan) return;
    const updatedPlan = { ...workoutPlan };
    daysOfWeek.forEach((day) => {
      updatedPlan[day] = updatedPlan[day].map((workout: any) => ({
        ...workout,
        completed: false,
      }));
    });
    setWorkoutPlan(updatedPlan);
    updateUserStatsWorkoutPlanById(
      { userId, workoutPlan: updatedPlan },
      {
        onSuccess: (response: any) => {
          setWorkoutPlan(response);
        },
        onError: (err: any) => {
          setError("Failed to reset workout plan.");
        },
      }
    );
  };

  const debouncedSubmit = useCallback(
    debounce((updatedPlan: WorkoutPlan) => {
      updateUserStatsWorkoutPlanById(
        { userId, workoutPlan: updatedPlan },
        {
          onSuccess: (response: any) => {
            // Optionally update state with response.
            setWorkoutPlan(response);
          },
          onError: (err: any) => {
            setError("Failed to update workout plan.");
          },
        }
      );
    }, 2000),
    [userId, updateUserStatsWorkoutPlanById]
  );
  const toggleWorkoutCompletion = (day: string, workoutId: string) => {
    if (!workoutPlan) return;
    if (day !== currentDay) return; // Only allow toggling for the current day.
    const updatedPlan = { ...workoutPlan };
    updatedPlan[day] = updatedPlan[day].map((workout: any) =>
      workout._id === workoutId
        ? { ...workout, completed: !workout.completed }
        : workout
    );
    setWorkoutPlan(updatedPlan);
    debouncedSubmit(updatedPlan);
  };

  if (loading) {
    return (
      <Container maxW="container.lg" py={8}>
        <Spinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Heading mb={6}>Your Weekly Workout Plan</Heading>
      <Accordion allowToggle defaultIndex={[daysOfWeek.indexOf(currentDay)]}>
        {daysOfWeek.map((day) => {
          // All Accordion items are clickable.
          const isCurrentDay = day === currentDay;
          return (
            <AccordionItem key={day} border="none">
              <h2>
                <AccordionButton _expanded={{ bg: "teal.100" }}>
                  <Box flex="1" textAlign="left">
                    {day} {isCurrentDay ? "(Today)" : ""}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {workoutPlan &&
                workoutPlan[day] &&
                workoutPlan[day].length > 0 ? (
                  <VStack spacing={3} align="stretch">
                    {workoutPlan[day].map((workout: any) => (
                      <MotionBox
                        key={workout._id}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        whileHover={isCurrentDay ? { scale: 1.02 } : {}}
                        animate={{
                          backgroundColor: workout.completed
                            ? "#d4edda"
                            : cardBg,
                        }}
                        transition={{ duration: 0.3 }}
                        onClick={() => {
                          if (isCurrentDay)
                            toggleWorkoutCompletion(day, workout._id);
                        }}
                        cursor={isCurrentDay ? "pointer" : "default"}
                      >
                        <VStack align="start" spacing={2}>
                          <Text
                            fontWeight="bold"
                            textDecoration={
                              workout.completed ? "line-through" : "none"
                            }
                          >
                            {workout.Title}
                          </Text>
                          <Text>Body Part: {workout.BodyPart}</Text>
                          <Text>Level: {workout.Level}</Text>
                          <Text>Equipment: {workout.Equipment}</Text>
                          {workout.Desc && workout.Desc.length > 50 ? (
                            <Text>
                              {workout.Desc.substring(0, 50)}...
                              <Button
                                size="xs"
                                variant="link"
                                colorScheme="blue"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedWorkoutDesc(workout.Desc || "");
                                  onOpen();
                                }}
                              >
                                Read More
                              </Button>
                            </Text>
                          ) : (
                            <Text>{workout.Desc}</Text>
                          )}
                          {/* Additional Inputs for Sets, Reps, Wait Time */}
                        </VStack>
                      </MotionBox>
                    ))}
                  </VStack>
                ) : (
                  <Text>No workouts assigned</Text>
                )}
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Reset Workout Schedule Button */}
      <Box mt={6} textAlign="center">
        <Button colorScheme="red" onClick={resetWorkoutSchedule}>
          Reset Workout Schedule
        </Button>
      </Box>

      {/* Description Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Workout Description</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{selectedWorkoutDesc}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default UserWorkoutScheduleWithCompletion;
