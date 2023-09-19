import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from "react-native";
import { AppStyles } from "../constants/styles";
import { ReagentStep, StepDTO, TemperatureStep, WashStep } from "sharedlib/dto/step.dto";
import { LiquidDTO } from "sharedlib/dto/liquid.dto";
import React, { useEffect, useState } from "react";
import Txt from "../components/Txt";
import { getRequest } from "../common/util";
import { CustomSelect } from "../components/Select";

export interface WorkBlockProps {
  block: StepDTO;
  addBlock: (block: StepDTO) => void;
  editBlock: (block: StepDTO) => void;
  toggleAutoWash: (val: boolean) => void;
  currentAutoWash: boolean;
  addCustomLiquid: (liquids: LiquidDTO) => void;
  customLiquids: LiquidDTO[];
}

export default function WorkBlock(props: any) {
  //const [liquidsList, setLiquidList] = useState<{ label: string; value: number }[]>([]);
  const [liquidsList, setLiquidList] = useState<LiquidDTO[]>();

  useEffect(() => {
    getLiquids();
  }, []);

  async function getLiquids() {
    const liquidList = (await getRequest<LiquidDTO[]>("/liquids")).data;
    setLiquidList(liquidList.filter((liq) => liq.type.id != 2));
  }

  return (
    <>
      {liquidsList && (
        <View style={s.block_container}>
          <View style={s.section_inputs}>
            <Txt>WorkBlock</Txt>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <CustomSelect list={liquidsList} selected={liquidsList[2]} canAdd={true} />
              <CustomSelect list={liquidsList} selected={liquidsList[4]} />
            </View>

            {/* <View style={{ flex: 1, flexDirection: "row" }}>
              <CustomSelect list={liquidsList} selected={liquidsList[1]} />
            </View> */}
          </View>
          <View style={s.section_footer}>
            <Txt>Button</Txt>
          </View>
        </View>
      )}
    </>
  );
}

const s = StyleSheet.create({
  block_container: {
    flex: 1,
    alignItems: "center",
  },

  section_inputs: {
    flex: 4,
    width: "80%",
    //backgroundColor: AppStyles.color.primary_faded,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  section_footer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ff0173ff",
  },
});
