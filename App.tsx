import 'expo-dev-client'
import * as Linking from 'expo-linking'
import {
  Link,
  LinkingOptions,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'

function Links() {
  const nav = useNavigation()
  ;(window as any).nav = nav
  return (
    <View style={{ marginTop: 30 }}>
      <Link to={{ screen: 'Tabs' }}>Go to tabs screen</Link>
      <Link to={{ screen: 'Settings' }}>Go to settings screen</Link>
      <Link to={{ screen: 'TabDetail', params: { tabId: '1' } }}>
        Go to tab 1
      </Link>
      <Link to={{ screen: 'TabDetail', params: { tabId: '2' } }}>
        Go to tab 2
      </Link>
    </View>
  )
}

function TabsScreen(props: NativeStackScreenProps<RootParamList, 'Tabs'>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Tabs Screen</Text>
      <Links />
    </View>
  )
}

function TabDetailScreen(
  props: NativeStackScreenProps<RootParamList, 'TabDetail'>
) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Tabs detail: {props.route.params.tabId}</Text>
      <Links />
    </View>
  )
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Links />
    </View>
  )
}

export type RootParamList = {
  Tabs: {}
  TabDetail: { tabId: string }
  Settings: {}
}

const linking: LinkingOptions<RootParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    initialRouteName: 'Tabs',
    screens: {
      Tabs: 'tabs',
      TabDetail: 'tabs/:tabId',
      Settings: 'settings',
    },
  },
}

const Stack = createNativeStackNavigator<RootParamList>()

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={TabsScreen} />
        <Stack.Screen
          name="TabDetail"
          component={TabDetailScreen}
          getId={({ params }) => params.tabId}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
