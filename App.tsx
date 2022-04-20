import 'expo-dev-client'
import * as Linking from 'expo-linking'
import {
  createNavigationContainerRef,
  Link,
  LinkingOptions,
  NavigationContainer,
  NavigatorScreenParams,
  useNavigation,
  useNavigationContainerRef,
  useNavigationState,
} from '@react-navigation/native'
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
import React, { useEffect, useState } from 'react'

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
        screens: {
          Tabs: 'tabs',
          Settings: {
            path: ':bookId/settings',
            exact: true,
          },
        },
      },
      TabDetail: ':bookId/tabs/:tabId',
    },
  },
}

const Stack = createNativeStackNavigator<RootParamList>()

const BottomTabs = createBottomTabNavigator<BottomTabsParamList>()

function BottomTabsScreen() {
  return (
    <BottomTabs.Navigator>
      <BottomTabs.Screen name="Tabs" component={TabsScreen} />
      <BottomTabs.Screen name="Settings" component={SettingsScreen} />
    </BottomTabs.Navigator>
  )
}

const navigationRef = createNavigationContainerRef()
;(window as any).navRef = navigationRef

export function useNavigationoute() {
  const [route, setRoute] = useState(navigationRef.getCurrentRoute())
  useEffect(
    () =>
      navigationRef.addListener('state', () =>
        setRoute(navigationRef.getCurrentRoute())
      ),
    []
  )
  return route
}

function GetRoute(props: { ready: boolean }) {
  const navigation = useNavigation()
  const state = useNavigationState((s) => s)
  const route = useNavigationoute()
  console.log({ ...props, route, state, navigation })
  return null
}

function useCurrentRouteParam(key: string) {
  return useNavigationState((s) => {
    if (!s) {
      return undefined
    }

    function findFocusedRoute() {
      let current = s

      while (current?.routes[current.index ?? 0].state != null) {
        // @ts-ignore
        current = current.routes[current.index ?? 0].state
      }
      const route = current?.routes[current?.index ?? 0]

      return route
    }
    // @ts-ignore
    return findFocusedRoute().params?.[key] as string
    // return s.routes[s.index ?? s.routes.length - 1].params
  })
}

function HandleTokens({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation()
  const token = useCurrentRouteParam('token')
  const [handled, setHandled] = useState(false)

  useEffect(() => {
    if (!token) {
      return
    }
    if (!handled) {
      setTimeout(() => {
        setHandled(true)
        // navigation.setParams({ token: undefined })
      }, 2000)
    } else {
      navigation.setParams({ token: undefined })
    }
  }, [token, handled])

  if (token && !handled) {
    return <div>Loading token...</div>
  }

  return <>{children}</>
}

export default function App() {
  useReduxDevToolsExtension(navigationRef)
  const [ready, setReady] = useState(false)

  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef as any}
      onReady={() => {
        console.log(
          'onReady : navigationRef.isReady()',
          navigationRef.isReady()
        )
        setReady(true)
      }}
    >
      <HandleTokens>
        <GetRoute ready={ready} />
        <Stack.Navigator>
          <Stack.Screen name="Home" component={BottomTabsScreen} />
          <Stack.Screen
            name="TabDetail"
            component={TabDetailScreen}
            getId={({ params }) => params.tabId}
          />
        </Stack.Navigator>
      </HandleTokens>
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
