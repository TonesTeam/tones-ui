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

export function CustomSelect(props: CustomSelectProps) {
  let canAdd = props.canAdd || false;

  const [items, setItems] = useState<LiquidDTO[] | LiquidTypeDTO[]>([]);
  const [searchList, setSearchList] = useState<LiquidDTO[] | LiquidTypeDTO[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  //console.log("Dimentions: ", Dimensions.get("screen").height);

  useEffect(() => {
    setItems(props.list);
    //setting initial selected value (index of) with passed prop

    // if (props.selected != null) {
    //   let selectedInd = props.list.findIndex(
    //     (item) => item.id == (props.selected as LiquidDTO | LiquidTypeDTO).id
    //   );
    //   setSelectedIndex(selectedInd == -1 ? 0 : selectedInd);
    // }
  }, []);

  //"items" can change only on component inicialisation or when new liquid is added to list
  useEffect(() => {
    if (props.selected != undefined && items.length != 0) {
      let selectedInd = props.list.findIndex(
        (item) => item.id == (props.selected as LiquidDTO | LiquidTypeDTO).id
      );
      setSelectedIndex(selectedInd == -1 ? 0 : selectedInd);
      setSearchList(items);
    } else if (props.selected == undefined && items.length != 0) {
      setSelectedIndex(0);
      setSearchList(items);
    } else if (items.length == 0) {
      //This can FOR NOW applies only to LiquidDTO, if everything goes right
      setSearchList([
        {
          id: -2,
          name: `No options found.${canAdd && " Add your own option by typing"}`,
          type: { id: 0, name: "Test cat" } as LiquidTypeDTO,
        } as LiquidDTO,
      ]);
      setSelectedIndex(-3);
    }
  }, [items]);

  useEffect(() => {
    props.onChangeSelect(items[selectedIndex]);
  }, [selectedIndex]);

  function suggestAdd(text: string) {
    let filteredList = items.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
    if (filteredList.length == 0) {
      if (canAdd && text != "") {
        setSearchList([
          {
            id: -1,
            name: text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
            type: { id: 0, name: "Test cat" } as LiquidTypeDTO,
          } as LiquidDTO,
        ]);
      } else {
        setSearchList([
          {
            id: -2,
            name: "0 search results",
            type: { id: 0, name: "Pseudo" } as LiquidTypeDTO,
          } as LiquidDTO,
        ]);
      }
      //Settings list with pseudo-item
    } else {
      setSearchList(filteredList);
    }
  }

  function handleSelect(item: LiquidDTO | LiquidTypeDTO) {
    if (item.id == -1 && canAdd && props.onCreateOption) {
      //Updating overall liquid list
      let newReagent = {
        id: items.length == 0 ? 0 : items[items.length - 1].id + 1,
        name: item.name,
        type: { id: -1, name: "Pseudo" },
      } as LiquidDTO;

      setSelectedIndex(items.length);
      setItems([...items, newReagent]);
      props.onCreateOption(newReagent);
    } else {
      setSelectedIndex(searchList.findIndex((listItem) => listItem.id == item.id));
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
        {searchList && selectedIndex != -1 && (
          <SelectDropdown
            //
            //Data
            data={searchList}
            defaultValueByIndex={searchList.length != 0 ? selectedIndex : undefined}
            search={true}
            searchPlaceHolder={"Search by name ..."}
            disabledIndexs={
              (!canAdd && searchList[0].id == -1) || searchList[0].id == -2 ? [0] : []
            }
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name;
            }}
            defaultButtonText="Select an option ..."
            //
            //Styles
            dropdownStyle={{
              height: Dimensions.get("screen").height / 3,
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
              selectedIndex < 0 && { color: AppStyles.color.text_faded, fontStyle: "italic" },
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
              let text = searchList[0].id == -1 ? `Add item ${item.name}` : item.name;
              return text;
            }}
            renderDropdownIcon={() => {
              return <Arrow_icon height={20} width={20} stroke={AppStyles.color.text_primary} />;
            }}
            //
            //Actions
            onSelect={(selectedItem, index) => {
              handleSelect(selectedItem);
            }}
            onBlur={() => {
              if (!canAdd && searchList[0].id == -1) {
                setSearchList(items);
              }
            }}
            onChangeSearchInputText={(text) => suggestAdd(text)}
          />
        )}
        {/* <View>
          {props.list.map((liq) => {
            return (
              <Txt key={liq.id} style={{ fontSize: 10 }}>
                {liq.name}
              </Txt>
            );
          })}
        </View> */}
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
