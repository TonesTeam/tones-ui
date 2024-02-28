import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pages } from "./Screens";

const Stack = createNativeStackNavigator();

export function AppStack(props: any) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "card",
        animationTypeForReplace: "pop",
        animation: "fade", //"none",
      }}
      initialRouteName="Logout"
    >
      {Pages.map((page, index) => {
        return <Stack.Screen key={index} name={page.name} component={page.component} />;
      })}
    </Stack.Navigator>
  );
}
