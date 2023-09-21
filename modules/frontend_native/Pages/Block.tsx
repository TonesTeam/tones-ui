import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  InputModeOptions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { AppStyles } from "../constants/styles";
import { ReagentStep, StepDTO, TemperatureStep, WashStep } from "sharedlib/dto/step.dto";
import { LiquidDTO, LiquidTypeDTO } from "sharedlib/dto/liquid.dto";
import React, { useEffect, useState } from "react";
import Txt from "../components/Txt";
import { getRequest } from "../common/util";
import { CustomSelect } from "../components/Select";
import InputField from "../components/InputField";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Info_icon from "../assets/icons/info.svg";
import { StepType } from "sharedlib/enum/DBEnums";
import Setting_icon from "../assets/icons/setting.svg";

const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 240;

export interface WorkBlockProps {
  block: StepDTO;
  //addBlock: (block: StepDTO) => void;
  //editBlock: (block: StepDTO) => void;
  //toggleAutoWash: (val: boolean) => void;
  //currentAutoWash: boolean;
  //addCustomLiquid: (liquids: LiquidDTO) => void;
  //customLiquids: LiquidDTO[];
}

interface BlockInputsProps {
  stepData: StepDTO;
  change: (arg0: WashStep | ReagentStep | TemperatureStep) => void;
  //addNewLiquid?: (liquid: LiquidDTO) => void;
  existingCustomLiquids?: LiquidDTO[];
}

const bs = StyleSheet.create({
  inputs: {
    width: "100%",
    flexDirection: "column",
  },

  row: {
    flexDirection: "row",
    height: "auto",
    borderBottomColor: AppStyles.color.background,
    borderBottomWidth: 1,
    paddingBottom: 30,
  },
});

function WashInputs(props: BlockInputsProps) {
  const [washParams, setWashParams] = useState(props.stepData.params as WashStep);
  const [selectedLiquid, setSelectedLiquid] = useState<LiquidDTO>();
  const [allowSave, setAllowSave] = useState(false);
  const [liquidsList, setLiquidList] = useState<LiquidDTO[]>([]);

  useEffect(() => {
    getLiquids();
  }, []);

  useEffect(() => {
    let liquid = washParams.liquid != undefined ? washParams.liquid : liquidsList[0];
    setSelectedLiquid(liquid);
    handleParamChange("liquid", liquid);
  }, [liquidsList]);

  async function getLiquids() {
    const liquidList = (await getRequest<LiquidDTO[]>("/liquids")).data;
    setLiquidList(liquidList.filter((liq) => liq.type.id == 2));
  }

  function handleParamChange(key: string, value: any) {
    setWashParams((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }

  useEffect(() => {
    console.log("Wash params changed");
    props.change(washParams);
  }, [washParams]);

  return (
    <>
      {liquidsList && selectedLiquid && (
        <>
          <View style={bs.row}>
            <CustomSelect
              list={liquidsList}
              selected={selectedLiquid || liquidsList[0]}
              canAdd={false}
              label="REAGENT:"
              onChangeSelect={(liq) => handleParamChange("liquid", liq)}
            />
          </View>
          <View style={[bs.row, { paddingTop: 20 }]}>
            <InputField
              placeholder="|"
              containerStyle={{ marginRight: 100 }}
              label="ITERATIONS:"
              type={"numeric" as InputModeOptions}
              onInputChange={(iters) => handleParamChange("iters", iters)}
            />
            <InputField
              placeholder="|"
              label="INCUBATION TIME:"
              type={"numeric" as InputModeOptions}
              onInputChange={(incub) => handleParamChange("incubation", incub)}
            />
          </View>
        </>
      )}
    </>
  );
}

function ReagentInputs(props: BlockInputsProps) {
  const [reagParams, setReagParams] = useState(props.stepData.params as ReagentStep);

  const [categories, setCategories] = useState<LiquidTypeDTO[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<LiquidTypeDTO>();

  const [liquids, setLiquids] = useState<LiquidDTO[]>([]);
  const [filteredLiquids, setFilteredLiquids] = useState<LiquidDTO[]>();
  const [selectedLiquid, setSelectedLiquid] = useState<LiquidDTO | undefined>(undefined);

  const [firstRender, setFirstRender] = useState(true);

  async function getLiquidData() {
    const liquidList = (await getRequest<LiquidDTO[]>("/liquids")).data;
    const categoryList = (await getRequest<LiquidTypeDTO[]>("/types")).data;

    const finalLiquids = [...liquidList, ...(props.existingCustomLiquids || [])];
    setLiquids(finalLiquids);
    setCategories(categoryList);

    let category = reagParams.liquid == undefined ? categoryList[0] : reagParams.liquid.type;
    setSelectedCategory(category);
    setFilteredLiquids(finalLiquids.filter((liq) => liq.type.id == category.id));

    let liquid =
      reagParams.liquid == undefined
        ? finalLiquids.findIndex((liq) => liq.type.id == category.id) != -1
          ? finalLiquids.filter((liq) => liq.type.id == category.id)[0]
          : undefined
        : reagParams.liquid;
    setSelectedLiquid(liquid);
  }

  useEffect(() => {
    getLiquidData();
  }, []);

  useEffect(() => {
    props.change(reagParams);
  }, [reagParams]);

  // useEffect(() => {
  //   if (filteredLiquids.length == 0)
  //     setFilteredLiquids(
  //       liquids.filter(
  //         (liq) => liq.type.id == (selectedCategory ? selectedCategory.id : categories[0].id)
  //       )
  //     );
  // }, [selectedCategory]);

  function handleParamChange(key: string, value: any) {
    setReagParams((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }

  // useEffect(() => {
  //   if (selectedCategory && filteredLiquids.length != 0) {
  //     let liquid =
  //       reagParams.liquid == undefined
  //         ? filteredLiquids.filter((liq) => liq.type.id == selectedCategory.id)[0]
  //         : reagParams.liquid;
  //     setSelectedLiquid(liquid);
  //   }
  // }, [filteredLiquids]);

  function handleCategoryChange(cat: LiquidTypeDTO) {
    if (cat != undefined && !firstRender) {
      let filtered = liquids.filter((liq) => liq.type.id == cat.id);
      setFilteredLiquids(filtered);
      setSelectedLiquid(filtered.length == 0 ? undefined : filtered[0]);
      setSelectedCategory(cat);
    } else {
      setFirstRender(false);
    }
  }

  const addCustomLiquid = (newLiquid: LiquidDTO) => {
    const newCustomLiquid: LiquidDTO = {
      id: newLiquid.id,
      name: newLiquid.name,
      type: selectedCategory!,
    };
    //props.addNewLiquid!(newLiquid);
    setLiquids((liqs) => [...liqs!, newCustomLiquid]);
    setFilteredLiquids((liqs) => [...liqs!, newCustomLiquid]);
    setSelectedLiquid(newCustomLiquid);
    //handleParamChange("liquid", newCustomLiquid);
  };

  return (
    <>
      {categories.length != 0 && selectedCategory && filteredLiquids && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={150}>
          <ScrollView style={{ flex: 1 }}>
            <View style={bs.row}>
              <CustomSelect
                list={categories}
                selected={selectedCategory}
                canAdd={false}
                label="REAGENT CATEGORY:"
                onChangeSelect={(cat) => {
                  handleCategoryChange(cat as LiquidTypeDTO);
                }}
              />
            </View>
            <View style={[bs.row, { paddingTop: 20 }]}>
              <CustomSelect
                key={Math.random()}
                list={filteredLiquids}
                selected={selectedLiquid}
                canAdd={true}
                label="REAGENT:"
                onChangeSelect={(liq) => {
                  //handleParamChange("liquid", liq);
                  //setSelectedLiquid(liq as LiquidDTO);
                }}
                onCreateOption={(liq) => addCustomLiquid(liq)}
              />
            </View>
            <View style={[bs.row, { paddingTop: 20 }]}>
              <InputField
                placeholder="|"
                containerStyle={{ marginRight: 100 }}
                label="ITERATIONS:"
                type={"numeric" as InputModeOptions}
                onInputChange={(iters) => handleParamChange("iters", iters)}
              />
              <InputField
                placeholder="|"
                label="INCUBATION TIME (sec):"
                type={"numeric" as InputModeOptions}
                onInputChange={(incub) => handleParamChange("incubation", incub)}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </>
  );
}

function TemperatureInputs(props: BlockInputsProps) {
  const [temperParams, setTemperParams] = useState(props.stepData.params as TemperatureStep);

  function handleParamChange(key: string, value: any) {
    setTemperParams((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }

  return (
    <KeyboardAvoidingView style={bs.inputs} behavior="padding">
      <View style={[bs.row]}>
        <InputField
          placeholder="|"
          containerStyle={{ marginRight: 100 }}
          label="FROM:"
          type={"numeric" as InputModeOptions}
          onInputChange={(iters) => handleParamChange("iters", iters)}
        />
        <InputField
          placeholder="|"
          label="TARGET:"
          type={"numeric" as InputModeOptions}
          onInputChange={(incub) => handleParamChange("incubation", incub)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

export default function WorkBlock(props: WorkBlockProps) {
  const [params, setParams] = useState<{ [key: string]: any }>({});

  function updateParams(step_params: any) {
    // setParams((params) => ({
    //   ...params,
    //   ...step_params,
    // }));
    //console.log("(WorkBlock) 'Update params' function");
  }

  // useEffect(() => {
  //   console.log("Work block params changed:", params);
  // }, [params]);

  //console.log("(Workblock) Work Block initialized with params: ", props);

  return (
    <>
      <View style={s.block_container}>
        <View style={s.section_inputs}>
          {props.block.type == StepType.WASHING && (
            <WashInputs stepData={props.block} change={updateParams} />
          )}
          {props.block.type == StepType.LIQUID_APPL && (
            <ReagentInputs stepData={props.block} change={updateParams} />
          )}
          {props.block.type == StepType.TEMP_CHANGE && (
            <TemperatureInputs stepData={props.block} change={updateParams} />
          )}
          <View style={{ alignSelf: "flex-start", paddingVertical: 30 }}>
            <TouchableOpacity style={s.setting_btn}>
              <Setting_icon height={20} width={20} stroke={AppStyles.color.text_primary} />
              <Txt style={{ marginLeft: 10 }}>Workspace Settings</Txt>
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.section_footer}>
          <TouchableOpacity style={[s.btn, { backgroundColor: AppStyles.color.background }]}>
            <Info_icon width={20} height={20} stroke={AppStyles.color.text_primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              s.btn,
              {
                width: "85%",
                backgroundColor: AppStyles.color.primary,
              },
            ]}
          >
            <Txt style={{ color: AppStyles.color.elem_back, alignSelf: "center" }}>Add Step</Txt>
          </TouchableOpacity>
        </View>
      </View>
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
    marginTop: Dimensions.get("screen").height / 40,
    height: "auto",
    flexDirection: "column",
    //justifyContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },

  section_footer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: "10%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: AppStyles.color.background,
    borderTopWidth: 1,
  },

  btn: {
    padding: "3%",
    borderRadius: 10,
  },

  setting_btn: {
    padding: "3%",
    borderRadius: 10,
    borderColor: AppStyles.color.background,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
