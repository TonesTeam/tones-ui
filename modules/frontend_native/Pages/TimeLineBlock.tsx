import { Dimensions, StyleSheet, TouchableOpacity, View, Vibration } from "react-native";
import {
  OpacityDecorator,
  RenderItemParams,
  ScaleDecorator,
  ShadowDecorator,
} from "react-native-draggable-flatlist";
import { ReagentStep, StepDTO, TemperatureStep, WashStep } from "sharedlib/dto/step.dto";
import Txt from "../components/Txt";
import { StepType } from "sharedlib/enum/DBEnums";
import { AppStyles } from "../constants/styles";
import Washing_icon from "../assets/icons/washing_icon.svg";
import Reagent_icon from "../assets/icons/reagent_icon.svg";
import Temperature_icon from "../assets/icons/temperature_icon.svg";
import Arrow_icon from "../assets/icons/arrow_constructor.svg";

const iconSize = 18;

function ParamItem(props: { label: string; value: string | number | null; measurement?: string }) {
  const st = StyleSheet.create({
    text: {
      color: AppStyles.color.elem_back,
      fontFamily: "Roboto-bold",
    },
    supplementary: {
      fontSize: 13,
      color: "#ffffffcc",
      //textTransform: "uppercase",
      fontFamily: "Roboto-thin",
    },
    container: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
  });
  return (
    <View style={st.container}>
      {/* <Arrow_icon height={10} width={10} stroke={AppStyles.color.elem_back} /> */}
      <Txt style={[st.supplementary, { textTransform: "uppercase" }]}>{props.label}: </Txt>
      <Txt style={st.text}>{props.value}</Txt>
      <Txt style={st.supplementary}> {props.measurement}</Txt>
    </View>
  );
}

export const renderTimelineBlock = ({ item, drag, isActive }: RenderItemParams<StepDTO>) => {
  let block = item;

  let blockColor = "";
  switch (block.type) {
    case StepType.WASHING:
      {
        blockColor = isActive
          ? AppStyles.color.block.transp_washing
          : AppStyles.color.block.main_washing;
      }
      break;
    case StepType.LIQUID_APPL:
      {
        blockColor = isActive
          ? AppStyles.color.block.transp_reagent
          : AppStyles.color.block.main_reagent;
      }
      break;
    case StepType.TEMP_CHANGE:
      {
        blockColor = isActive
          ? AppStyles.color.block.transp_temperature
          : AppStyles.color.block.main_temperature;
      }
      break;
  }

  let blockName =
    block.type == StepType.WASHING
      ? "Washing"
      : block.type == StepType.LIQUID_APPL
      ? "Reagent"
      : "Temperature";

  let blockIcon =
    block.type == StepType.WASHING ? (
      <Washing_icon height={iconSize} width={iconSize} fill={AppStyles.color.elem_back} />
    ) : block.type == StepType.LIQUID_APPL ? (
      <Reagent_icon height={iconSize} width={iconSize} fill={AppStyles.color.elem_back} />
    ) : (
      <Temperature_icon height={iconSize} width={iconSize} fill={AppStyles.color.elem_back} />
    );

  return (
    <TouchableOpacity
      activeOpacity={1}
      onLongPress={drag}
      delayLongPress={220}
      disabled={isActive}
      style={[
        s.block,
        {
          backgroundColor: blockColor,
        },
      ]}
    >
      <View style={s.upper_part}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={s.icon}>{blockIcon}</View>
          <Txt style={{ color: AppStyles.color.elem_back, fontSize: 16 }}>
            {blockName} ({block.id})
          </Txt>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={s.btn}>
            <Txt>EDIT</Txt>
          </TouchableOpacity>
          <TouchableOpacity style={s.btn}>
            <Txt>DELETE</Txt>
          </TouchableOpacity>
        </View>
      </View>
      <View style={s.lower_part}>
        {block.type == StepType.WASHING && (
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={s.row}>
              <ParamItem label={"With"} value={(block.params as WashStep).liquid.name} />
              <ParamItem
                label={"Incubate for"}
                value={(block.params as WashStep).incubation}
                measurement="sec"
              />
            </View>
            <View style={s.row}>
              <ParamItem
                label={"Iterate for"}
                value={(block.params as WashStep).iters}
                measurement="times"
              />
              <ParamItem
                label={"At"}
                value={(block.params as WashStep).temperature}
                measurement="°C"
              />
            </View>
          </View>
        )}
        {block.type == StepType.LIQUID_APPL && (
          <>
            <Txt>Liquid: {(block.params as ReagentStep).liquid.name}</Txt>
            <Txt>Incubation: {(block.params as ReagentStep).incubation}</Txt>
            <Txt>AutoWash: {(block.params as ReagentStep).autoWash ? "Yes" : "No"}</Txt>
          </>
        )}
        {block.type == StepType.TEMP_CHANGE && (
          <>
            <Txt>From: {(block.params as TemperatureStep).source}</Txt>
            <Txt>Target: {(block.params as TemperatureStep).target}</Txt>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  block: {
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    borderRadius: 8,
    paddingHorizontal: "2%",
    paddingVertical: "1%",
  },
  text: {
    color: AppStyles.color.elem_back,
  },
  icon: {
    height: iconSize * 2,
    width: iconSize * 2,
    borderRadius: iconSize * 2,
    backgroundColor: "#0000002b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10%",
  },

  upper_part: {
    flex: 2,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#ffffff2d",
    borderBottomWidth: 1,
    paddingVertical: "1%",
  },

  lower_part: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: "1%",
  },

  btn: {
    width: 80,
    borderRadius: 8,
    backgroundColor: "#0000002b",
    padding: "1%",
    alignItems: "center",
    justifyContent: "center",
  },

  row: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  col: {},
});
