import {
    View,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import Txt from '../../components/Txt';
import { useState } from 'react';
import { AppStyles } from '../../constants/styles';
import Slot_Active_Icon from '../../assets/icons/slot_active_mark.svg';
import { SLOT_QUANTITY } from '../../common/cartridgeConfig';

export function SlotMap(props: {
    slotsMap: boolean[];
    changeActiveSlots: (num: number) => void;
    limitReached: boolean;
}) {
    return (
        <View style={s.container}>
            <View style={s.header}>
                <Txt
                    style={{
                        fontFamily: 'Roboto-thin',
                        fontSize: 24,
                        textTransform: 'uppercase',
                        letterSpacing: 1.1,
                    }}
                >
                    Tap to mark slot as active
                </Txt>
            </View>
            <View style={s.slot_container}>
                {Array(SLOT_QUANTITY)
                    .fill(null)
                    .map((_, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    s.slot_box,
                                    props.slotsMap[index] == true &&
                                        s.slot_active_box,
                                ]}
                                onPress={() => {
                                    if (
                                        props.limitReached == false ||
                                        (props.limitReached == true &&
                                            props.slotsMap[index] == true)
                                    ) {
                                        props.changeActiveSlots(index);
                                    }
                                }}
                            >
                                <ImageBackground
                                    source={require('../../assets/pics/slot.png')}
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                    }}
                                    resizeMode="center"
                                >
                                    <Txt
                                        style={{
                                            textAlign: 'center',
                                            fontFamily: 'Roboto-bold',
                                            fontStyle: 'italic',
                                            fontSize: 20,
                                        }}
                                    >
                                        Nr. {index + 1}
                                    </Txt>
                                </ImageBackground>
                                {props.slotsMap[index] == true && (
                                    <Slot_Active_Icon
                                        height={50}
                                        style={s.active_icon}
                                    />
                                )}
                            </TouchableOpacity>
                        );
                    })}
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slot_container: {
        flex: 7,
        flexDirection: 'row',
        paddingHorizontal: '5%',
    },
    slot_box: {
        padding: '2%',
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        marginVertical: 40,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'transparent',
    },

    slot_active_box: {
        backgroundColor: AppStyles.color.block.faded_reagent,
        borderWidth: 2,
        borderColor: AppStyles.color.secondary,
    },

    active_icon: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: -25,
    },
});
