import { StepGroupWithStepsDTO } from 'common/dto/protocol.dto';
import { Text, HStack, VStack, ScrollView } from '@gluestack-ui/themed';
import StepGroup from './StepGroup';
import { useEffect, useState } from 'react';
import { formatDuration, getRequest, makeRequest } from '../../common/util';
import { Method } from 'axios';
import { StepDTO } from 'common/dto/step.dto';

interface TimelineProps {
    stepGroups: StepGroupWithStepsDTO[];
    setStepGroups: (stepGroups: StepGroupWithStepsDTO[]) => void;
    activeStepGroup: number;
    setActiveStepGroup: (id: number) => void;
    liquidMap: Map<number, string>;
    setEditingStep?: (editingStep: {
        step: StepDTO;
        stepGroupSequenceNumber: number;
    }) => void;
}

const Timeline = ({
    stepGroups,
    setStepGroups,
    activeStepGroup,
    setActiveStepGroup,
    liquidMap,
    setEditingStep,
}: TimelineProps) => {
    const [estimatedExectuionTime, setEstimatedExecutionTime] = useState(
        '' as '' | number,
    );

    useEffect(() => {
        const payload = JSON.stringify(
            stepGroups.map((sg) => ({
                name: sg.step_group.name,
                description: '',
                sequence_number: sg.step_group.sequence_number,
                steps: sg.steps.map((s) => ({
                    iterations: 1,
                    sequence_number: s.sequence_number,
                    target_temperature: s.target_temperature,
                    incubation_time: s.incubation_time,
                    applied_liquid_id: s.applied_liquid_id,
                    washing_iterations: s.washing_iterations,
                    single_wash_duration: s.single_wash_duration,
                })),
            })),
        );

        console.log('payload', payload);

        const res = makeRequest(
            'POST' as Method,
            '/estimated-execution-time',
            payload,
        );

        res.then((contents) => {
            console.log(contents.status);
            console.log(contents.data);
            setEstimatedExecutionTime(
                contents.data['estimated_execution_time'] || 0,
            );
        });
    }, [stepGroups]);

    return (
        <VStack>
            <HStack>
                <Text color="black" fontSize={16}>
                    Timeline
                </Text>
                <Text color="black" fontSize={16} ml="auto">
                    ~ {formatDuration(estimatedExectuionTime || 0)}
                </Text>
            </HStack>
            <ScrollView
                mt={24}
                showsVerticalScrollIndicator={false}
                height="91%"
            >
                {stepGroups.map((group, index) => (
                    <StepGroup
                        key={index}
                        stepGroup={group}
                        setStepGroups={setStepGroups}
                        allStepGroups={stepGroups}
                        activeStepGroup={activeStepGroup}
                        setActiveStepGroup={setActiveStepGroup}
                        liquidMap={liquidMap}
                        setEditingStep={setEditingStep}
                    />
                ))}
            </ScrollView>
        </VStack>
    );
};

export default Timeline;
