import { Dimensions, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { LiquidDTO, LiquidTypeDTO } from "sharedlib/dto/liquid.dto";
import { AppStyles } from "../constants/styles";
import { useEffect, useState } from "react";
import Txt from "./Txt";
import Arrow_icon from "../assets/icons/arrow_down_2.svg";

interface CustomSelectProps {
  list: LiquidDTO[] | LiquidTypeDTO[];
  selected: LiquidDTO | LiquidTypeDTO;
  canAdd?: boolean;
  addNewLiquid?: (liquid: LiquidDTO) => void;
}

export function CustomSelect(props: CustomSelectProps) {
  let canAdd = props.canAdd || false;

  const [items, setItems] = useState<LiquidDTO[] | LiquidTypeDTO[]>([]);
  const [searchList, setSearchList] = useState<LiquidDTO[] | LiquidTypeDTO[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  useEffect(() => {
    setItems(props.list);
    //setting initial selected value (index of) with passed prop
    let selectedInd = props.list.findIndex((item) => item.id == props.selected.id);
    setSelectedIndex(selectedInd);
    //setSearchList(props.list);
  }, []);

  //"items" can change only on component inicialisation or when new liquid is added to list
  useEffect(() => {
    setSearchList(items);
  }, [items]);

  useEffect(() => {}, [selectedIndex]);

  function suggestAdd(text: string) {
    let filteredList = items.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
    if (filteredList.length == 0) {
      if (canAdd) {
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
            id: -1,
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
    if (item.id == -1 && canAdd) {
      //Updating overall liquid list
      let newReagent = {
        id: items[items.length - 1].id + 1,
        name: item.name,
        type: { id: 0, name: "Test" },
      };
      setSelectedIndex(items.length);
      setItems([...items, newReagent]);
    } else setSelectedIndex(searchList.findIndex((listItem) => listItem.id == item.id));
  }

  return (
    <>
      <View style={{ width: "100%", flex: 1 }}>
        {searchList.length != 0 && selectedIndex != -1 && (
          <SelectDropdown
            //
            //Data
            data={searchList}
            defaultValueByIndex={selectedIndex}
            search={true}
            searchPlaceHolder={"Search by name ..."}
            disabledIndexs={!canAdd && searchList[0].id == -1 ? [0] : []}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name;
            }}
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
            buttonTextStyle={{
              marginLeft: 0,
              textAlign: "left",
              paddingHorizontal: 10,
            }}
            statusBarTranslucent={true}
            showsVerticalScrollIndicator={true}
            selectedRowStyle={{ backgroundColor: AppStyles.color.primary_faded }}
            rowStyle={{ width: "100%", justifyContent: "flex-start" }}
            rowTextStyle={{
              marginLeft: 0,
              paddingHorizontal: 10,
              textAlign: "left",
            }}
            rowTextForSelection={(item, index) => {
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
