import { StepGroupWithStepsDTO } from 'common/dto/protocol.dto';
import { Text, HStack, VStack, ScrollView } from '@gluestack-ui/themed';
import StepGroup from './StepGroup';
import { useEffect, useState } from 'react';
import { getRequest, makeRequest } from '../../common/util';
import { Method } from 'axios';

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
                    target_temperature: s.targetTemperature,
                    incubation_time: s.incubation_time,
                    applied_liquid_id: s.applied_liquid_id,
                    washing_iterations: s.washing_iterations,
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
                {/* TODO: do some neat time formatting? or just do like in the mockup? */}
                <Text color="black" fontSize={16} ml="auto">
                    {estimatedExectuionTime} sec
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
                    />
                ))}
            </ScrollView>
        </VStack>
    );
};

export default Timeline;
