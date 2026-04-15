import {
    Box,
    HStack,
    Text,
    Pressable,
    Icon,
    Button,
    ButtonText,
    Input,
    InputField,
    InputIcon,
} from '@gluestack-ui/themed';
import { MainContainer, globalElementStyle } from '../../constants/styles';
import NavBar from '../../navigation/NavBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Pencil } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Header from './Header';
import Timeline from './Timeline';
import AddStepForm from './AddStepForm';
import {
    ProtocolWithStepsDTO,
    StepGroupWithStepsDTO,
} from 'common/dto/protocol.dto';
import { Method } from 'axios';
import { makeRequest } from '../../common/util';
import { useUser } from '../../contexts/UserContext';
import { StepDTO } from 'common/dto/step.dto';
import { LiquidDTO } from 'common/dto/liquid.dto';

const Constructor = ({ route, navigation }: NativeStackScreenProps<any>) => {
    const [name, setName] = useState('Protocol name');
    const [stepGroups, setStepGroups] = useState([
        {
            step_group: {
                id: 1,
                name: 'Step Group 1',
                protocol_id: 1,
                sequence_number: 1,
            },
            steps: [],
        },
    ] as StepGroupWithStepsDTO[]);
    const [activeStepGroup, setActiveStepGroup] = useState<number>(1);
    const [liquids, setLiquids] = useState([] as LiquidDTO[]);
    const { user } = useUser();
    const editingMode = route.params?.edit ? true : false;
    const [historyId, setHistoryId] = useState('');

    useEffect(() => {
        makeRequest('GET' as Method, '/liquids').then((response) => {
            setLiquids(response.data as LiquidDTO[]);
        });
    }, []);

    useEffect(() => {
        if (route.params?.protocol_ID) {
            makeRequest(
                'GET' as Method,
                `/protocols/${route.params.protocol_ID}`,
            ).then((response) => {
                const protocol = response.data as ProtocolWithStepsDTO;
                setStepGroups(protocol.step_groups);
                setHistoryId(protocol.metadata.history_id);

                if (editingMode) {
                    setName(protocol.metadata.name);
                }
            });
        } else {
            setStepGroups([
                {
                    step_group: {
                        id: 1,
                        name: 'Step Group 1',
                        protocol_id: 1,
                        sequence_number: 1,
                    },
                    steps: [],
                },
            ] as StepGroupWithStepsDTO[]);
        }
    }, [route.params]);

    useEffect(() => {
        console.log('stepGroups', stepGroups);
        stepGroups.sort(
            (a, b) =>
                a.step_group.sequence_number - b.step_group.sequence_number,
        );
    }, [stepGroups]);

    const saveProtocol = () => {
        if (editingMode) {
            makeRequest(
                'PUT' as Method,
                `/protocols/${route.params?.protocol_ID}`,
                JSON.stringify({
                    history_id: historyId,
                    new_protocol: {
                        name,
                        description: '',
                        author_id: user?.id,
                        step_groups: stepGroups.map((sg) => ({
                            name: sg.step_group.name,
                            description: '',
                            sequence_number: sg.step_group.sequence_number,
                            steps: sg.steps.map(
                                (s) =>
                                    ({
                                        iterations: 1,
                                        sequence_number: s.sequence_number,
                                        target_temperature:
                                            s.target_temperature,
                                        incubation_time: s.incubation_time,
                                        applied_liquid_id: s.applied_liquid_id,
                                        washing_iterations:
                                            s.washing_iterations,
                                        single_wash_duration:
                                            s.single_wash_duration,
                                    }) as StepDTO,
                            ),
                        })),
                    },
                }),
            ).then((response) => {
                console.log(response.data);
                navigation.navigate('Protocols');
            });
        } else {
            makeRequest(
                'POST' as Method,
                '/protocols',
                JSON.stringify({
                    name,
                    description: '',
                    author_id: user?.id,
                    step_groups: stepGroups.map((sg) => ({
                        name: sg.step_group.name,
                        description: '',
                        sequence_number: sg.step_group.sequence_number,
                        steps: sg.steps.map(
                            (s) =>
                                ({
                                    iterations: 1,
                                    sequence_number: s.sequence_number,
                                    target_temperature: s.target_temperature,
                                    incubation_time: s.incubation_time,
                                    applied_liquid_id: s.applied_liquid_id,
                                    washing_iterations: s.washing_iterations,
                                    single_wash_duration:
                                        s.single_wash_duration,
                                }) as StepDTO,
                        ),
                    })),
                }),
            ).then((response) => {
                console.log(response.data);
                navigation.navigate('Protocols');
            });
        }
    };

    const liquidsToLiquidMap = (liquids: LiquidDTO[]) => {
        const liquidMap: Map<number, string> = new Map();
        liquids.forEach((liquid) => {
            liquidMap.set(liquid.id, liquid.name);
        });
        return liquidMap;
    };

    return (
        <MainContainer>
            <NavBar />
            <Box flex={1} p={24}>
                <Header
                    saveProtocol={saveProtocol}
                    navigation={navigation}
                    name={name}
                    setName={setName}
                    editingMode={editingMode}
                />

                <Box
                    mt={38}
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="row"
                    width="100%"
                    flex={1}
                    borderRadius={20}
                    bg="white"
                    overflow="hidden"
                >
                    <Box flex={621} height="100%">
                        <LinearGradient
                            colors={[
                                'rgba(255, 255, 255, 0.7)',
                                'rgba(238, 240, 242, 0.07)',
                            ]}
                            locations={[0, 1]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                flex: 1,
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#EEF0F2',
                                paddingHorizontal: 32,
                                paddingTop: 44,
                            }}
                        >
                            <Timeline
                                stepGroups={stepGroups}
                                setStepGroups={setStepGroups}
                                activeStepGroup={activeStepGroup}
                                setActiveStepGroup={setActiveStepGroup}
                                liquidMap={liquidsToLiquidMap(liquids)}
                            />
                        </LinearGradient>
                    </Box>
                    <Box
                        flex={392}
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                    >
                        <AddStepForm
                            stepGroups={stepGroups}
                            setStepGroups={setStepGroups}
                            activeStepGroup={activeStepGroup}
                            setActiveStepGroup={setActiveStepGroup}
                        />
                    </Box>
                </Box>
            </Box>
        </MainContainer>
    );
};

export default Constructor;
