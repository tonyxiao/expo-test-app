import 'expo-dev-client'
import * as Linking from 'expo-linking'
import {
  Link,
  LinkingOptions,
  NavigationContainer,
  NavigatorScreenParams,
  useNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native'
import { NavigationProp, NavigationState } from '@react-navigation/core'
import { StyleSheet, Text, View } from 'react-native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'

import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs'
import { useReduxDevToolsExtension } from '@react-navigation/devtools'
import { useEffect, useLayoutEffect } from 'react'

function Links() {
  const nav = useNavigation()
  ;(window as any).nav = nav
  return (
    <View style={{ marginTop: 30 }}>
      <Link to={{ screen: 'Tabs', params: { bookId: 'kkk' } }}>
        Go to tabs screen
      </Link>
      <Link to={{ screen: 'Settings', params: { bookId: '1232' } }}>
        Go to settings screen
      </Link>
      <Link to={{ screen: 'TabDetail', params: { bookId: '333', tabId: '1' } }}>
        Go to tab 1
      </Link>
      <Link to={{ screen: 'TabDetail', params: { bookId: '333', tabId: '2' } }}>
        Go to tab 2
      </Link>

      <Link
        to={{
          screen: 'Transaction',
          params: { bookId: '333', tabId: '2', transactionId: 'afd' },
        }}
      >
        Go to transaction afd
      </Link>
      <Link
        to={{
          screen: 'Transaction',
          params: { bookId: '333', tabId: '2', transactionId: 'zzz' },
        }}
      >
        Go to transaction zzz
      </Link>
    </View>
  )
}

function TabsScreen(props: BottomTabScreenProps<BottomTabsParamList, 'Tabs'>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Tabs Screen</Text>
      <Text>{JSON.stringify(props.route, null, 4)}</Text>
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
      <Text>{JSON.stringify(props.route, null, 4)}</Text>
      <Links />
    </View>
  )
}

function TransactionScreen(
  props: NativeStackScreenProps<RootParamList, 'Transaction'>
) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Transaction: {props.route.params.transactionId}</Text>
      <Text>{JSON.stringify(props.route, null, 4)}</Text>
      <Links />
    </View>
  )
}

function SettingsScreen(
  props: BottomTabScreenProps<BottomTabsParamList, 'Settings'>
) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Text>{JSON.stringify(props.route, null, 4)}</Text>
      <Links />
    </View>
  )
}

export type RootParamList = {
  Home: NavigatorScreenParams<BottomTabsParamList>
  TabDetail: { bookId: string; tabId: string }
  Transaction: { bookId: string; tabId: string; transactionId: string }
  RedirectMe: {}
}

export type BottomTabsParamList = {
  Tabs: { bookId: string }
  Settings: {}
}

const linking: LinkingOptions<RootParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    initialRouteName: 'Home',
    screens: {
      Home: {
        path: ':bookId',
        screens: {
          Tabs: 'tabs',
          Settings: {
            // `:bookId` here doesn't work in case where navigate action results from
            // pressing the bottom tab bar, it works after a refresh though
            path: ':bookId/settings',
            exact: true,
          },
        },
      },
      TabDetail: ':bookId/tabs/:tabId',
      Transaction: ':bookId/tabs/:tabId/transactions/:transactionId',
      RedirectMe: 'redir',
    },
  },
}

const Stack = createNativeStackNavigator<RootParamList>()

const BottomTabs = createBottomTabNavigator<BottomTabsParamList>()

function BottomTabsScreen(
  props: NativeStackScreenProps<RootParamList, 'Home'>
) {
  return (
    <BottomTabs.Navigator
      screenOptions={{ headerShown: false }}
      screenListeners={({ route }) => ({
        // state: (e) => {
        //   // console.log(args)e
        //   const state = (e.data as any)?.state as NavigationState<{}>
        //   const childRoute = state?.routes[state?.index ?? 0]

        //   props.navigation.setOptions({
        //     title: `Home: ${childRoute.name}`,
        //   })

        //   // debugger
        // },
        focus: (..._args) => {
          props.navigation.setOptions({
            title: `Home: ${route.name}`,
          })
          // console.log(args)

          // debugger
        },
      })}
    >
      <BottomTabs.Screen name="Tabs" component={TabsScreen} />
      <BottomTabs.Screen name="Settings" component={SettingsScreen} />
    </BottomTabs.Navigator>
  )
}

export default function App() {
  const navigationRef = useNavigationContainerRef()
  useReduxDevToolsExtension(navigationRef)

  return (
    <NavigationContainer linking={linking} ref={navigationRef as any}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={BottomTabsScreen}
          // options={({ route, navigation }) => {
          //   console.log('home route', route, navigation.getState())
          //   const childState = (navigation as NavigationProp<{}>)
          //     .getState()
          //     .routes.find((r) => r.key === route.key)?.state

          //   // Nice idea but doesn't always work because child state can be undefined in the very beginning
          //   // https://cln.sh/ZL1PHX
          //   const childRoute = childState?.routes[childState?.index ?? 0]

          //   console.log('child', childState, childRoute)

          //   // debugger

          //   return {
          //     title: `Home: ${childRoute?.name}`,
          //   }
          // }}
        />
        <Stack.Screen
          name="TabDetail"
          component={TabDetailScreen}
          getId={({ params }) => params.tabId}
          options={({ route }) => ({
            title: `Book ${route.params.bookId} Tab ${route.params.tabId}`,
          })}
        />
        <Stack.Screen
          name="Transaction"
          component={TransactionScreen}
          getId={({ params }) => params.transactionId}
          options={({ route }) => ({
            title: `Book ${route.params.bookId} Tab ${route.params.tabId} Txn ${route.params.transactionId}`,
          })}
        />
        <Stack.Screen name="RedirectMe">
          {(props) => <RedirectMe {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function RedirectMe(
  props: NativeStackScreenProps<RootParamList, 'RedirectMe'>
) {
  useLayoutEffect(() => {
    props.navigation.navigate('Home', {
      screen: 'Tabs',
      params: { bookId: '1111' },
    })
  }, [props.navigation])

  return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
