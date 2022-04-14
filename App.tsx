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

function HomeScreen(props: NativeStackScreenProps<RootParamList, 'Home'>) {
  console.log(props)
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Link to={{ screen: 'Settings' }}>Go to settings screen</Link>
    </View>
  )
}

function SettingsScreen() {
  const nav = useNavigation()
  ;(window as any).nav = nav
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
    </View>
  )
}

const Stack = createNativeStackNavigator()

export type RootParamList = {
  Home: { bookId: string }
  Settings: {}
}

const linking: LinkingOptions<RootParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    initialRouteName: 'Home',
    screens: {
      Home: ':bookId',
      Settings: 'settings',
    },
  },
}

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
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
