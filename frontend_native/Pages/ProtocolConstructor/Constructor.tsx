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
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Header from './Header';
import Timeline from './Timeline';
import AddStepForm from './AddStepForm';
import { StepGroupWithStepsDTO } from 'common/dto/protocol.dto';
import { Method } from 'axios';
import { makeRequest } from '../../common/util';
import { useUser } from '../../contexts/UserContext';

const Constructor = ({ route, navigation }: NativeStackScreenProps<any>) => {
    const [name, setName] = useState('Protocol name');
    const [stepGroups, setStepGroups] = useState([
        {
            step_group: {
                id: 1,
                name: 'Step 1',
                protocol_id: 1,
                sequence_number: 1,
            },
            steps: [],
        },
    ] as StepGroupWithStepsDTO[]);
    const [activeStepGroup, setActiveStepGroup] = useState<number>(1);
    const { user } = useUser();

    const saveProtocol = () => {
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
                    steps: sg.steps.map((s) => ({
                        iterations: 1,
                        sequence_number: s.sequence_number,
                        target_temperature: s.targetTemperature,
                        incubation_time: s.incubation_time,
                        applied_liquid_id: s.applied_liquid_id,
                    })),
                })),
            }),
        ).then((response) => {
            console.log(response.data);
            navigation.navigate('Protocols');
        });
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
