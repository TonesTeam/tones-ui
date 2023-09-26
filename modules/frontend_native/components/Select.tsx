import { Dimensions, View, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { LiquidDTO, LiquidTypeDTO } from "sharedlib/dto/liquid.dto";
import { AppStyles } from "../constants/styles";
import { useEffect, useState } from "react";
import Arrow_icon from "../assets/icons/arrow_down_2.svg";
import Txt from "./Txt";

interface CustomSelectProps {
  label?: string;
  list: LiquidDTO[] | LiquidTypeDTO[];
  selected: LiquidDTO | LiquidTypeDTO | undefined;
  canAdd?: boolean;
  onCreateOption?: (liquid: LiquidDTO) => void;
  onChangeSelect: (item: LiquidDTO | LiquidTypeDTO) => void;
}

enum OptionID {
  CUSTOM = -1,
  EMPTY_SEARCT_RESULT = -2,
}

export function CustomSelect(props: CustomSelectProps) {
  let canAdd = props.canAdd || false;

  const [searchList, setSearchList] = useState<LiquidDTO[] | LiquidTypeDTO[]>([]);
  const [selected, setSelected] = useState<LiquidDTO | LiquidTypeDTO | undefined>();

  const [filterInput, setFilterInput] = useState("");

  function initialization() {
    if (props.list.length == 0) {
      let emptyItem = {
        id: OptionID.EMPTY_SEARCT_RESULT,
        name: `No options found.${canAdd && " Add your own option by typing"}`,
        type: { id: 0, name: "Test cat" } as LiquidTypeDTO,
      } as LiquidDTO;
      setSearchList([emptyItem]);
      setSelected(emptyItem);
    } else {
      setSearchList(props.list);

      setSelected(props.list.find((item) => item == props.selected));
    }
  }

  useEffect(() => {
    initialization();
  }, []);

  useEffect(() => {
    if (selected != undefined) {
      props.onChangeSelect(selected);
    }
  }, [selected]);

  function suggestAdd(text: string) {
    let filteredList = searchList.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );

    //🔽 FOR LIQUID DTO ONLY!
    if (filteredList.length == 0) {
      if (canAdd && text != "") {
        filteredList = [
          {
            id: OptionID.CUSTOM,
            name: text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
            type: { id: 0, name: "Pseudo" } as LiquidTypeDTO,
          } as LiquidDTO,
        ];
      } else {
        filteredList = [
          {
            id: OptionID.EMPTY_SEARCT_RESULT,
            name: "0 search results",
            type: { id: 0, name: "Pseudo" } as LiquidTypeDTO,
          } as LiquidDTO,
        ];
      }
      //Setting list with pseudo-item
    }
    return filteredList;
  }

  function handleSelect(item: LiquidDTO | LiquidTypeDTO) {
    if (item.id == -1 && canAdd) {
      let newReagent = {
        id: searchList.length == 0 ? 0 : searchList[searchList.length - 1].id + 1,
        name: item.name,
        type: { id: -1, name: "Pseudo" },
      } as LiquidDTO;

      if (props.onCreateOption) props.onCreateOption(newReagent as LiquidDTO);
    } else {
      setSelected(searchList.find((listItem) => listItem.id == item.id));
    }
  }

  return (
    <>
      <View
        style={{
          width: "100%",
          flexDirection: "column",
        }}
      >
        {props.label && <Txt style={s.span}>{props.label}</Txt>}
        {searchList && selected && selected?.id != -1 && (
          <>
            <SelectDropdown
              //
              //Data
              data={suggestAdd(filterInput)}
              defaultValue={props.selected}
              search={true}
              searchPlaceHolder={"Search by name ..."}
              disabledIndexs={
                suggestAdd(filterInput)[0].id == OptionID.EMPTY_SEARCT_RESULT ? [0] : []
              }
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.name;
              }}
              defaultButtonText={`Select ${canAdd && "or add "}an option ...`}
              //
              //Styles
              dropdownStyle={{
                height: searchList.length > 3 ? Dimensions.get("window").height / 3 : undefined,
                borderRadius: AppStyles.layout.border_radius,
              }}
              dropdownOverlayColor={"#00000036"}
              buttonStyle={{
                width: "100%",
                borderRadius: AppStyles.layout.border_radius,
                borderColor: AppStyles.color.background,
                borderWidth: 1,
              }}
              buttonTextStyle={[
                {
                  marginLeft: 0,
                  textAlign: "left",
                  paddingHorizontal: 5,
                  fontFamily: "Roboto-regular",
                },
                selected.id < 0 && { color: AppStyles.color.text_faded, fontStyle: "italic" },
              ]}
              statusBarTranslucent={true}
              showsVerticalScrollIndicator={true}
              selectedRowStyle={{ backgroundColor: AppStyles.color.primary_faded }}
              rowStyle={{ width: "100%", justifyContent: "flex-start" }}
              rowTextStyle={{
                marginLeft: 0,
                paddingHorizontal: 10,
                textAlign: "left",
                fontFamily: "Roboto-regular",
              }}
              rowTextForSelection={(item) => {
                let text =
                  suggestAdd(filterInput)[0].id == -1 ? `Add item ${item.name}` : item.name;
                return text;
              }}
              renderDropdownIcon={() => {
                return <Arrow_icon height={20} width={20} stroke={AppStyles.color.text_primary} />;
              }}
              //
              //Events
              onSelect={(selectedItem, index) => {
                handleSelect(selectedItem);
              }}
              onBlur={() => {
                setFilterInput("");
              }}
              onChangeSearchInputText={(text) => setFilterInput(text)}
            />
          </>
        )}
      </View>
    </>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  span: {
    color: AppStyles.color.text_faded,
    paddingBottom: AppStyles.layout.elem_padding,
  },
});
