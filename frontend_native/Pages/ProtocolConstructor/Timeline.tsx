import { StepGroupWithStepsDTO } from 'common/dto/protocol.dto';
import { Text, HStack, VStack, ScrollView } from '@gluestack-ui/themed';
import StepGroup from './StepGroup';

interface TimelineProps {
    stepGroups: StepGroupWithStepsDTO[];
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    activeStepGroup: number;
    setActiveStepGroup: (id: number) => void;
}

const Timeline = ({
    stepGroups,
    setStepGroups,
    activeStepGroup,
    setActiveStepGroup,
}: TimelineProps) => {
    return (
        <VStack>
            <HStack>
                <Text color="black" fontSize={16}>
                    Timeline
                </Text>
                <Text color="black" fontSize={16} ml="auto">
                    00:8:00
                </Text>
            </HStack>
            <ScrollView mt={24} showsVerticalScrollIndicator={false}>
                {stepGroups.map((group, index) => (
                    <StepGroup
                        key={index}
                        stepGroup={group}
                        setStepGroups={setStepGroups}
                        allStepGroups={stepGroups}
                        activeStepGroup={activeStepGroup}
                        setActiveStepGroup={setActiveStepGroup}
                    />
                ))}
            </ScrollView>
        </VStack>
    );
};

export default Timeline;
