import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AppStyles, MainContainer, globalElementStyle } from "../constants/styles";
import NavBar from "../navigation/CustomNavigator";
import { useEffect, useState } from "react";
import { LiquidDTO, LiquidTypeDTO } from "sharedlib/dto/liquid.dto";
import { getRequest } from "../common/util";
import Txt from "../components/Txt";
import Search_Icon from "../assets/icons/search.svg";
import Edit_Icon from "../assets/icons/edit_btn.svg";
import Delete_Icon from "../assets/icons/delete_btn.svg";
import User_s_Icon from "../assets/icons/user_settings.svg";
import System_s_Icon from "../assets/icons/system_settings.svg";
import Lib_s_Icon from "../assets/icons/reag_lib_settings.svg";

enum SettingTabs {
  USER = "User Settings",
  SYSTEM = "System Settings",
  LIBRARY = "Reagent Library",
}

function Library() {
  const [liquids, setLiquids] = useState<LiquidDTO[]>([]);
  const [categories, setCategories] = useState<LiquidTypeDTO[]>([]);
  const [liquidModal, setLiquidModal] = useState(false);
  const [filterInput, setFilterInput] = useState("");
  const [active, setActive] = useState(false);

  const listInitilizer = () => {
    getRequest<LiquidDTO[]>("/liquids").then((r) => {
      setLiquids(r.data);
    });

    getRequest<LiquidTypeDTO[]>("/types").then((r) => {
      setCategories(r.data);
    });
  };

  useEffect(listInitilizer, []);

  // function filterAndSort() {
  //   let filteredList = liquids.filter((e) =>
  //     filterInput === "" ? e : e.name.toLowerCase().includes(filterInput.toLowerCase())
  //   );
  //   let sortedList = filteredList;
  //   return sortedList;
  // }

  const lib_s = StyleSheet.create({
    header: {
      width: "100%",
      flex: 1,
      flexDirection: "row",
    },
    list: {
      flex: 11,
      marginTop: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: AppStyles.color.accent_back,
      overflow: "hidden",
      //backgroundColor: "#ff366f",
    },
    btn: {
      flex: 2,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: "2%",
      backgroundColor: AppStyles.color.secondary,
      borderRadius: 8,
    },

    search_bar: {
      flex: 6,
      flexDirection: "row",
      backgroundColor: AppStyles.color.elem_back,
      alignItems: "center",
      borderRadius: 10,
      marginRight: 30,
    },

    row: {
      flexDirection: "row",
      width: "100%",
      height: 50,
      borderBottomColor: AppStyles.color.accent_back,
      borderBottomWidth: 2,
    },

    cell: {
      alignItems: "center",
      justifyContent: "center",
      borderLeftWidth: 1,
      borderLeftColor: AppStyles.color.accent_back,
      borderRightWidth: 1,
      borderRightColor: AppStyles.color.accent_back,
    },

    option_cell: {
      flex: 1,
      height: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <>
      {liquids.length != 0 && (
        <View>
          <View style={lib_s.header}>
            <View
              style={[
                lib_s.search_bar,
                {
                  borderWidth: 1,
                  borderColor: active ? AppStyles.color.primary : AppStyles.color.elem_back,
                },
              ]}
            >
              <Search_Icon height={30} width={50} stroke={AppStyles.color.text_faded} />
              <TextInput
                placeholder="Search by reagent name ..."
                value={filterInput}
                style={{ fontFamily: "Roboto-regular" }}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                onChangeText={(e) => setFilterInput(e.toLowerCase())}
              />
            </View>
            <TouchableOpacity style={lib_s.btn} onPress={() => setLiquidModal(true)}>
              <Txt style={{ color: AppStyles.color.elem_back, fontFamily: "Roboto-bold" }}>
                Add New Reagent
              </Txt>
            </TouchableOpacity>
          </View>
          <View style={lib_s.list}>
            <View style={[lib_s.row, { backgroundColor: AppStyles.color.accent_dark, height: 40 }]}>
              <View style={[lib_s.cell, { flex: 3 }]}>
                <Txt style={{ color: AppStyles.color.elem_back }}>Reagent name</Txt>
              </View>
              <View style={[lib_s.cell, { flex: 2 }]}>
                <Txt style={{ color: AppStyles.color.elem_back }}>Categoty</Txt>
              </View>
              <View style={[lib_s.cell, { flex: 1 }]}>
                <Txt style={{ color: AppStyles.color.elem_back }}>Toxicity</Txt>
              </View>
              <View style={[lib_s.cell, { flex: 1 }]}>
                <Txt style={{ color: AppStyles.color.elem_back }}>Used cold</Txt>
              </View>
              <View style={[lib_s.cell, { flex: 3 }]}>
                <Txt style={{ color: AppStyles.color.elem_back }}>Options</Txt>
              </View>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
              {liquids.map((liq, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      lib_s.row,
                      {
                        backgroundColor:
                          index % 2 != 0 ? AppStyles.color.background : AppStyles.color.elem_back,
                      },
                    ]}
                  >
                    <View style={[lib_s.cell, { flex: 3 }]}>
                      <Txt>{liq.name}</Txt>
                    </View>
                    <View style={[lib_s.cell, { flex: 2 }]}>
                      <Txt>{liq.type.name}</Txt>
                    </View>
                    <View style={[lib_s.cell, { flex: 1 }]}>
                      <Txt>{liq.id}</Txt>
                    </View>
                    <View style={[lib_s.cell, { flex: 1 }]}>
                      <Txt>{liq.id}</Txt>
                    </View>
                    <View style={[lib_s.cell, { flex: 3, flexDirection: "row" }]}>
                      {/* <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                        }}
                      > */}
                      <TouchableOpacity
                        style={[
                          lib_s.option_cell,
                          { borderRightColor: AppStyles.color.background, borderRightWidth: 0.5 },
                        ]}
                      >
                        <Edit_Icon height={15} width={15} stroke={AppStyles.color.primary} />
                        <Txt
                          style={{
                            marginLeft: 10,
                            color: AppStyles.color.primary,
                            letterSpacing: 1.1,
                            fontSize: 12,
                          }}
                        >
                          EDIT
                        </Txt>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          lib_s.option_cell,
                          { borderLeftColor: AppStyles.color.accent_back, borderLeftWidth: 0.5 },
                        ]}
                      >
                        <Delete_Icon height={15} width={15} stroke={AppStyles.color.warning} />
                        <Txt
                          style={{
                            marginLeft: 10,
                            color: AppStyles.color.warning,
                            letterSpacing: 1.1,
                            fontSize: 12,
                          }}
                        >
                          DELETE
                        </Txt>
                      </TouchableOpacity>
                      {/* </View> */}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}
    </>
  );
}

export default function Settings(props: any) {
  const [currentTab, setCurrentTab] = useState<SettingTabs>(SettingTabs.LIBRARY);

  return (
    <MainContainer>
      <NavBar />

      <View style={[globalElementStyle.page_container]}>
        <View style={{ flex: 1 }}>
          <View style={s.tab_bar}>
            <TouchableOpacity
              style={[
                s.tab,
                currentTab == SettingTabs.USER && { backgroundColor: AppStyles.color.background },
              ]}
              onPress={() => setCurrentTab(SettingTabs.USER)}
            >
              <View
                style={[
                  s.tab_icon,
                  currentTab == SettingTabs.USER && {
                    backgroundColor: AppStyles.color.elem_back,
                  },
                ]}
              >
                <User_s_Icon height={25} width={25} fill={AppStyles.color.accent_dark} />
              </View>
              <Txt
                style={[
                  s.tab_text,
                  currentTab == SettingTabs.USER && {
                    color: AppStyles.color.primary,
                    fontWeight: "700",
                  },
                ]}
              >
                User Settings
              </Txt>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                s.tab,
                currentTab == SettingTabs.SYSTEM && { backgroundColor: AppStyles.color.background },
              ]}
              onPress={() => setCurrentTab(SettingTabs.SYSTEM)}
            >
              <View
                style={[
                  s.tab_icon,
                  currentTab == SettingTabs.SYSTEM && {
                    backgroundColor: AppStyles.color.elem_back,
                  },
                ]}
              >
                <System_s_Icon height={30} width={30} fill={AppStyles.color.accent_dark} />
              </View>
              <Txt
                style={[
                  s.tab_text,
                  currentTab == SettingTabs.SYSTEM && {
                    color: AppStyles.color.primary,
                    fontWeight: "700",
                  },
                ]}
              >
                System Settings
              </Txt>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                s.tab,
                currentTab == SettingTabs.LIBRARY && {
                  backgroundColor: AppStyles.color.background,
                },
              ]}
              onPress={() => setCurrentTab(SettingTabs.LIBRARY)}
            >
              <View
                style={[
                  s.tab_icon,
                  currentTab == SettingTabs.LIBRARY && {
                    backgroundColor: AppStyles.color.elem_back,
                  },
                ]}
              >
                <Lib_s_Icon height={27} width={27} fill={AppStyles.color.accent_dark} />
              </View>
              <Txt
                style={[
                  s.tab_text,
                  currentTab == SettingTabs.LIBRARY && {
                    color: AppStyles.color.primary,
                    fontWeight: "700",
                  },
                ]}
              >
                Reagent Library
              </Txt>
            </TouchableOpacity>
          </View>
          <View style={s.body}>
            {currentTab == SettingTabs.LIBRARY && <Library />}
            {currentTab != SettingTabs.LIBRARY && <Txt>Other tab</Txt>}
          </View>
        </View>
      </View>
    </MainContainer>
  );
}

const s = StyleSheet.create({
  tab_bar: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    marginRight: 18,
  },

  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: AppStyles.color.background,
    borderRightWidth: 1,
    borderRightColor: AppStyles.color.background,
    backgroundColor: AppStyles.color.elem_back,
  },

  tab_text: {
    textTransform: "uppercase",
    color: AppStyles.color.text_primary,
    fontSize: 18,
    fontFamily: "Roboto-regular",
  },

  tab_icon: {
    height: 50,
    width: 50,
    borderRadius: 40,
    backgroundColor: AppStyles.color.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  body: {
    width: "100%",
    flex: 10,
    alignItems: "center",
    marginTop: 20,
    marginRight: 18,
    paddingHorizontal: "3%",
  },

  btn: {
    borderRadius: 8,
    paddingHorizontal: "5%",
    paddingVertical: "3%",
    alignItems: "center",
    borderWidth: 1,
  },
});
