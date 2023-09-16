import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { AppStyles, MainContainer, globalElementStyle } from "../constants/styles";
import NavBar from "../navigation/CustomNavigator";
import Txt from "../components/Txt";
import Washing_icon from "../assets/icons/washing_icon.svg";
import Reagent_icon from "../assets/icons/reagent_icon.svg";
import Temperature_icon from "../assets/icons/temperature_icon.svg";
import { useState } from "react";
import { LiquidDTO } from "sharedlib/dto/liquid.dto";
import { StepDTO } from "sharedlib/dto/step.dto";
//import { StepType } from "../common/DBEnums";
// import { StepType } from "sharedlib/enum/DBEnums"; //<- UNCOMMENT TO GET ERROR

export const DEFAULT_TEMEPRATURE = 25; //default tempretaure for the system
export const LIQUID_INJECT_TIME: number = 10; //default time to inject liduid into slot chip

// export const stepTypeClass = new Map<StepType, string>([
//   [StepType.WASHING, "washing"],
//   [StepType.LIQUID_APPL, "reagent"],
//   [StepType.TEMP_CHANGE, "temperature"],
// ]);

export default function Constructor(props: any) {
  const [blocks, setBlocks] = useState<StepDTO[]>([]);
  const [workBlock, setWorkBlock] = useState<StepDTO>();
  const [currentTemp, setCurrentTemp] = useState(DEFAULT_TEMEPRATURE);
  const [settingAutoWash, setSettingAutoWash] = useState(true);
  const [preSaveModal, showPreSaveModal] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [customLiquids, setCustomLiquids] = useState<LiquidDTO[]>([]);
  const [liquidsList, setLiquidList] = useState<LiquidDTO[]>([]);

  return (
    <MainContainer>
      <NavBar />
      <View style={[globalElementStyle.page_container, { backgroundColor: "#5da4faff" }]}>
        <View style={s.header_section}></View>
        <View style={s.body_section}>
          <View style={s.workspace_container}>
            <View style={s.tabs}>
              <TouchableOpacity style={s.tab}>
                <View
                  style={[
                    s.tab_icon,
                    // {
                    //   backgroundColor:
                    //     workBlock?.type == StepType.WASHING
                    //       ? AppStyles.color.block_washing
                    //       : AppStyles.color.accent_back,
                    // },
                  ]}
                >
                  <Washing_icon height={25} width={25} fill={AppStyles.color.text_faded} />
                </View>
                <Txt style={s.tab_label}>Washing</Txt>
              </TouchableOpacity>

              <TouchableOpacity style={s.tab}>
                <View style={s.tab_icon}>
                  <Reagent_icon height={25} width={25} fill={AppStyles.color.text_faded} />
                </View>
                <Txt style={s.tab_label}>Reagent</Txt>
              </TouchableOpacity>

              <TouchableOpacity style={s.tab}>
                <View style={s.tab_icon}>
                  <Temperature_icon height={25} width={25} fill={AppStyles.color.text_faded} />
                </View>
                <Txt style={s.tab_label}>Temperature</Txt>
              </TouchableOpacity>
            </View>
            <View style={s.workspace}></View>
          </View>
          <View style={s.timeline}>
            <Txt>Timeline</Txt>
          </View>
        </View>
      </View>
    </MainContainer>
  );
}

const s = StyleSheet.create({
  header_section: {
    flex: 1,
    backgroundColor: AppStyles.color.elem_back,
  },
  body_section: {
    flex: 11,
    flexDirection: "row",
  },

  workspace_container: {
    backgroundColor: "#5bffb5",
    flex: 1,
  },

  timeline: {
    backgroundColor: "#df3eff",
    flex: 1,
  },

  tabs: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  tab_icon: {
    height: 45,
    width: 45,
    borderRadius: 23,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppStyles.color.background,
  },

  tab_label: {
    textTransform: "uppercase",
    color: AppStyles.color.text_faded,
    fontFamily: "Roboto-bold",
    fontSize: 10,
    letterSpacing: 1.5,
  },

  workspace: {
    flex: 7,
  },
});
