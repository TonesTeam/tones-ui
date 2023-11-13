import { View, StyleSheet, ScrollView } from "react-native";
import Txt from "../components/Txt";
import { CARTRIDGE_CONFIG } from "../common/cartridgeConfig";
import { AppStyles } from "../constants/styles";
import { StyleProps } from "react-native-reanimated";

function Table(props: { config: { x: number; y: number }; color: string; letterOffset: number }) {
  return (
    <View style={s.table}>
      <View style={s.header_row}>
        <View style={{ width: 35 }}></View>
        {Array(props.config.x)
          .fill(null)
          .map((_, header_index) => {
            return (
              <View
                key={header_index}
                style={{
                  flex: 1,
                  borderWidth: 0.5,
                  borderColor: AppStyles.color.elem_back,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Txt style={s.header_text}>
                  {String.fromCharCode(header_index + props.letterOffset + "A".charCodeAt(0))}
                </Txt>
              </View>
            );
          })}
      </View>
      {Array(props.config.y)
        .fill(null)
        .map((_, row_index) => {
          return (
            <View key={row_index} style={s.row}>
              <View
                style={{
                  backgroundColor: AppStyles.color.accent_dark,
                  width: 35,
                  borderWidth: 0.5,
                  borderColor: AppStyles.color.elem_back,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Txt style={s.header_text}>{row_index + 1}</Txt>
              </View>
              {Array(props.config.x)
                .fill(null)
                .map((_, col_index) => {
                  return (
                    <View key={col_index} style={[s.cell, { backgroundColor: props.color }]}>
                      <Txt>Aaa x{col_index}</Txt>
                    </View>
                  );
                })}
            </View>
          );
        })}
    </View>
  );
}
export function LiquidTable(props: { slots: number }) {
  const table_config = CARTRIDGE_CONFIG;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
      >
        <Table config={table_config.size_S} letterOffset={0} color={AppStyles.color.primary} />
        <Table
          config={table_config.size_M}
          letterOffset={table_config.size_S.x}
          color={AppStyles.color.secondary}
        />
        <Table
          config={table_config.size_L}
          letterOffset={table_config.size_M.x + table_config.size_S.x}
          color={AppStyles.color.block.main_temperature}
        />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  table: {
    flexDirection: "column",
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    height: 90,
  },

  header_row: {
    height: 30,
    flexDirection: "row",
    backgroundColor: AppStyles.color.accent_dark,
  },

  header_text: {
    textTransform: "uppercase",
    color: AppStyles.color.elem_back,
    fontFamily: "Roboto-bold",
    textAlign: "center",
  },

  cell: {
    width: 170,
    backgroundColor: AppStyles.color.elem_back,
    borderWidth: 0.5,
    borderColor: AppStyles.color.elem_back,
  },
});
