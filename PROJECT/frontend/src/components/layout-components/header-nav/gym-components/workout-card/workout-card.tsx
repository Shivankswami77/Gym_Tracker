import { DeleteIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

export const WorkoutCard: React.FC<any> = ({
  workout,
  setSelectedCustomWorkoutId,
  onOpenDeleteWorkoutModal,
  setSelectedDescription,
  onOpenDescModal,
  children,
}) => (
  <Card direction={{ base: "column" }} overflow="hidden" variant="unstyled">
    <Stack>
      <CardBody>
        <HStack mt={2} justifyContent={"space-between"}>
          <Heading size="md">{workout.Title}</Heading>
          {workout.isCustomWorkout && (
            <DeleteIcon
              color={"red"}
              cursor={"pointer"}
              onClick={() => {
                setSelectedCustomWorkoutId(workout._id);
                onOpenDeleteWorkoutModal();
              }}
            />
          )}
        </HStack>
        <Text>Body Part: {workout.BodyPart}</Text>
        <Text>Level: {workout.Level}</Text>
        <Text>Equipment: {workout.Equipment}</Text>
        {workout.Desc && workout.Desc.length > 100 ? (
          <Text>
            Description: {workout.Desc.substring(0, 100)}...
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => {
                setSelectedDescription(workout.Desc);
                onOpenDescModal();
              }}
            >
              Read More
            </Button>
          </Text>
        ) : (
          <Text>Description: {workout.Desc}</Text>
        )}
      </CardBody>
      <div>{children}</div>
    </Stack>
  </Card>
);
