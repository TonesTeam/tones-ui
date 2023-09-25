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
import React, { useEffect, useState } from "react";
import { LiquidDTO } from "sharedlib/dto/liquid.dto";
import {
  ReagentStep,
  StepDTO,
  StepParams,
  TemperatureStep,
  WashStep,
} from "sharedlib/dto/step.dto";
import { StepType } from "sharedlib/enum/DBEnums";
import { SvgProps } from "react-native-svg";
import WorkBlock from "./Block";

export const DEFAULT_TEMEPRATURE = 25; //default tempretaure for the system
export const LIQUID_INJECT_TIME: number = 10; //default time to inject liduid into slot chip

export const stepTypeClass = new Map<StepType, string>([
  [StepType.WASHING, "washing"],
  [StepType.LIQUID_APPL, "reagent"],
  [StepType.TEMP_CHANGE, "temperature"],
]);

function StepTab(props: { type: StepType; active: boolean; onPress: () => void }) {
  let params = {
    main_color:
      AppStyles.color.block[
        `main_${stepTypeClass.get(props.type)}` as keyof typeof AppStyles.color.block
      ],
    back_color:
      AppStyles.color.block[
        `faded_${stepTypeClass.get(props.type)}` as keyof typeof AppStyles.color.block
      ],
    icon: {} as React.FC<SvgProps>,
  };
  switch (props.type) {
    case StepType.WASHING:
      {
        params.icon = Washing_icon;
      }
      break;
    case StepType.LIQUID_APPL:
      {
        params.icon = Reagent_icon;
      }
      break;
    case StepType.TEMP_CHANGE:
      {
        params.icon = Temperature_icon;
      }
      break;
  }
  return (
    <TouchableOpacity
      style={[
        s.tab,
        { backgroundColor: props.active ? params.back_color : AppStyles.color.elem_back },
      ]}
      onPressIn={props.onPress}
    >
      <View
        style={[
          s.tab_icon,
          { backgroundColor: props.active ? params.main_color : AppStyles.color.background },
        ]}
      >
        <params.icon
          height={25}
          width={25}
          fill={props.active ? AppStyles.color.elem_back : AppStyles.color.text_faded}
        />
      </View>
      <Txt
        style={[
          s.tab_label,
          {
            color: props.active ? AppStyles.color.text_primary : AppStyles.color.text_faded,
            fontWeight: props.active ? "bold" : "normal",
          },
        ]}
      >
        {stepTypeClass.get(props.type)}
      </Txt>
    </TouchableOpacity>
  );
}

export default function Constructor(props: any) {
  const [blocks, setBlocks] = useState<StepDTO[]>([]); //All steps
  const [workBlock, setWorkBlock] = useState<StepDTO>(); //Current edited block
  const [currentTemp, setCurrentTemp] = useState(DEFAULT_TEMEPRATURE); //Last temperature used in steps
  const [settingAutoWash, setSettingAutoWash] = useState(true);
  const [preSaveModal, showPreSaveModal] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [customLiquids, setCustomLiquids] = useState<LiquidDTO[]>([]);
  const [liquidsList, setLiquidList] = useState<LiquidDTO[]>([]);

  useEffect(() => {
    console.log("(Constructor) Work block initialized with ID: ", workBlock?.id);
  }, [workBlock]);

  function revealWorkBlock(step_data: StepDTO) {
    //let step_params = step_data?.params || ({} as WashStep | ReagentStep | TemperatureStep);
    setWorkBlock(step_data);
  }

  return (
    <MainContainer>
      <NavBar />
      <View style={[globalElementStyle.page_container]}>
        <View style={s.header_section}>
          <Txt style={{ fontSize: 24, fontFamily: "Roboto-bold" }}>Protocol Constructor</Txt>
        </View>
        <View style={s.body_section}>
          <View style={s.workspace_container}>
            <View style={s.tabs}>
              <StepTab
                type={StepType.WASHING}
                active={workBlock?.type == StepType.WASHING}
                onPress={() =>
                  revealWorkBlock({
                    type: StepType.WASHING,
                    id: -1,
                    params: {} as WashStep,
                  } as StepDTO)
                }
              />
              <StepTab
                type={StepType.LIQUID_APPL}
                active={workBlock?.type == StepType.LIQUID_APPL}
                onPress={() =>
                  revealWorkBlock({
                    type: StepType.LIQUID_APPL,
                    id: -1,
                    params: {} as ReagentStep,
                  } as StepDTO)
                }
              />
              <StepTab
                type={StepType.TEMP_CHANGE}
                active={workBlock?.type == StepType.TEMP_CHANGE}
                onPress={() =>
                  setWorkBlock({
                    type: StepType.TEMP_CHANGE,
                    id: -1,
                    params: {
                      source: currentTemp,
                      target: -1,
                    } as TemperatureStep,
                  } as StepDTO)
                }
              />
            </View>
            <View style={s.workspace}>{workBlock?.id && <WorkBlock block={workBlock} />}</View>
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
    width: "100%",
    paddingHorizontal: "2%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: AppStyles.color.elem_back,
  },
  body_section: {
    flex: 11,
    flexDirection: "row",
  },

  workspace_container: {
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
    borderWidth: 0.5,
    borderColor: AppStyles.color.background,
  },

  tab_icon: {
    height: 45,
    width: 45,
    borderRadius: 23,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: AppStyles.color.elem_back,
  },
});
