import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  InputModeOptions,
} from "react-native";
import { AppStyles, MainContainer, globalElementStyle } from "../constants/styles";
import NavBar from "../navigation/CustomNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Txt from "../components/Txt";
import Step1 from "../assets/pics/step1.svg";
import Step2 from "../assets/pics/step2.svg";
import Step2_inactive from "../assets/pics/step2_inactive.svg";
import Step3 from "../assets/pics/step3.svg";
import Step3_inactive from "../assets/pics/step3_inactive.svg";
import { useState } from "react";
import { LiquidTable } from "./LiquidTable";

enum LaunchStage {
  STEP_ONE = 1,
  STEP_TWO = 2,
  STEP_THREE = 3,
}

function StageMenu(props: { stage: LaunchStage; changeStage: (stage: LaunchStage) => void }) {
  return (
    <View style={{ flex: 1, alignItems: "center", flexDirection: "row" }}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Step1 height={50} width={180} style={{ zIndex: 100 }} />
        <Txt
          style={{
            position: "absolute",
            zIndex: 110,
            color: AppStyles.color.elem_back,
            fontFamily: "Roboto-bold",
          }}
        >
          Step 1
        </Txt>
      </View>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {props.stage.valueOf() > 1 ? (
          <Step2_inactive
            height={50}
            width={180}
            style={{ left: -30, zIndex: 90 }}
            onPress={() => console.log("Pressed!")}
          />
        ) : (
          <Step2
            height={50}
            width={180}
            style={{ left: -30, zIndex: 90 }}
            onPress={() => console.log("Pressed!")}
          />
        )}

        <Txt
          style={{
            position: "absolute",
            zIndex: 110,
            color: AppStyles.color.elem_back,
            fontFamily: "Roboto-bold",
            left: 40,
          }}
        >
          Step 2
        </Txt>
      </View>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {props.stage.valueOf() > 2 ? (
          <Step3_inactive height={50} width={180} style={{ left: -70, zIndex: 80 }} />
        ) : (
          <Step3 height={50} width={180} style={{ left: -70, zIndex: 80 }} />
        )}

        <Txt
          style={{
            position: "absolute",
            zIndex: 110,
            color: AppStyles.color.elem_back,
            fontFamily: "Roboto-bold",
            left: 20,
          }}
        >
          Step 3
        </Txt>
      </View>
    </View>
  );
}

export default function Launch({ route, navigation }: NativeStackScreenProps<any>) {
  const protocol_ID = route.params
    ? (route.params as { protocol_ID: number }).protocol_ID
    : undefined;

  const [stage, setStage] = useState<LaunchStage>(LaunchStage.STEP_ONE);
  const [slotNumber, setSlotNumber] = useState<number | "">(1);

  return (
    <MainContainer>
      <NavBar />
      <View style={[globalElementStyle.page_container, s.container]}>
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <StageMenu stage={stage} changeStage={setStage} />
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            {stage == LaunchStage.STEP_ONE && (
              <View
                style={{
                  alignSelf: "flex-end",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Txt
                  style={{
                    fontFamily: "Roboto-bold",
                    fontSize: 16,
                    flex: 1,
                    paddingHorizontal: 10,
                  }}
                >
                  Choose quantity of slots used for current deployment:
                </Txt>
                <View
                  style={{
                    flexDirection: "row",
                    borderRadius: 8,
                    backgroundColor: AppStyles.color.background,
                    height: 60,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: AppStyles.color.background,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 45,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => Number(slotNumber) > 1 && setSlotNumber(Number(slotNumber) - 1)}
                  >
                    <Txt style={{ fontSize: 50 }}>-</Txt>
                  </TouchableOpacity>
                  <View
                    style={{
                      backgroundColor: AppStyles.color.elem_back,
                      height: "100%",
                      width: 80,
                    }}
                  >
                    <TextInput
                      textAlign={"center"}
                      maxLength={1}
                      value={slotNumber.toString()}
                      onChangeText={(text) =>
                        setSlotNumber(Number(text) == 0 || isNaN(Number(text)) ? "" : Number(text))
                      }
                      onBlur={(e) => {
                        if (slotNumber == "") setSlotNumber(1);
                      }}
                      inputMode={"numeric" as InputModeOptions}
                      style={{ flex: 1, fontSize: 30 }}
                    />
                  </View>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 45,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => setSlotNumber(slotNumber == "" ? 1 : Number(slotNumber) + 1)}
                  >
                    <Txt style={{ fontSize: 40 }}>+</Txt>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
        <View style={s.body}>
          {stage == LaunchStage.STEP_ONE && (
            <LiquidTable slots={slotNumber == "" ? 1 : Number(slotNumber)} />
          )}
        </View>
        <View style={s.footer}>
          <Txt>Footer</Txt>
        </View>
      </View>
    </MainContainer>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  body: {
    flex: 10,
    //width: "100%",
    paddingHorizontal: 25,
    backgroundColor: AppStyles.color.background,
  },

  footer: {
    flex: 2,
  },
});
