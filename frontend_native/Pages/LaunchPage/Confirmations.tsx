import { View, StyleSheet, AppState } from 'react-native';
import Txt from '../../components/Txt';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { SvgProps } from 'react-native-svg';
import { AppStyles } from '../../constants/styles';
import { useState } from 'react';
import {
    LucideIcon,
    FlaskRound,
    LockKeyhole,
    Table,
    VectorSquare,
} from 'lucide-react-native';
import { Icon } from '../../components/ui/icon';

function ConfirmBox(props: {
    icon: LucideIcon;
    text: string;
    title: string;
    toggleConfirm: (state: boolean) => void;
}) {
    const [cheched, setChecked] = useState(false);

    const st = StyleSheet.create({
        box: {
            flex: 1,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: AppStyles.color.background,
            flexDirection: 'column',
            marginHorizontal: '4%',
            marginVertical: '2%',
        },
        icon_circle: {
            width: 45,
            height: 45,
            borderRadius: 25,
            backgroundColor: AppStyles.color.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
    return (
        <View
            style={[
                st.box,
                cheched && { borderColor: AppStyles.color.secondary },
            ]}
        >
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View
                    style={{
                        flex: 2,
                        paddingHorizontal: 10,
                        paddingVertical: 20,
                        marginLeft: 10,
                    }}
                >
                    <View style={{ flex: 5 }}>
                        <View style={st.icon_circle}>
                            <Icon as={props.icon} color="white" size="xl" />
                        </View>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Txt
                            style={{ fontFamily: 'Roboto-bold', fontSize: 20 }}
                        >
                            {props.title}
                        </Txt>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Txt style={{ fontSize: 14 }}>{props.text}</Txt>
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <BouncyCheckbox
                        size={60}
                        fillColor={AppStyles.color.secondary}
                        unfillColor={AppStyles.color.background}
                        onPress={(state: boolean) => {
                            setChecked(state);
                            props.toggleConfirm(state);
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

export function Confirmations(props: {
    updateConfirmations: (state: boolean) => void;
}) {
    return (
        <View style={s.container}>
            <View style={s.boxes}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <ConfirmBox
                        title="Slots are in place."
                        text="Make sure that slides are placed in earlier chosen slots and properly fixated."
                        icon={VectorSquare}
                        toggleConfirm={(state: boolean) =>
                            props.updateConfirmations(state)
                        }
                    />
                    <ConfirmBox
                        title="Reagents are in place."
                        text="Make sure that reagents are filled in tubes according to the configuration table at Step 1."
                        icon={Table}
                        toggleConfirm={(state: boolean) =>
                            props.updateConfirmations(state)
                        }
                    />
                </View>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <ConfirmBox
                        title="Washing buffer is filled."
                        text="Ensure that washing buffer canister is filled with according washing liquid."
                        icon={FlaskRound}
                        toggleConfirm={(state: boolean) =>
                            props.updateConfirmations(state)
                        }
                    />
                    <ConfirmBox
                        title="Doors are closed."
                        text="Double-check that slot module cover and reagent module door are closed."
                        icon={LockKeyhole}
                        toggleConfirm={(state: boolean) =>
                            props.updateConfirmations(state)
                        }
                    />
                </View>
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
    },
    boxes: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: '5%',
    },
});
