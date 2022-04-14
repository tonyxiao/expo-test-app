import { useReduxDevToolsExtension } from '@react-navigation/devtools'
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from '@react-navigation/drawer'
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native'
import 'expo-dev-client'
import { useRef } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

function TabDetailScreen(props: DrawerScreenProps<{}>) {
  const collapsed = useRef(false)

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Tabs detail: {JSON.stringify(props.route.params, null, 2)}</Text>
      <Text>{JSON.stringify(props.route, null, 4)}</Text>
      <Button
        title="Toggle drawer"
        onPress={() => {
          collapsed.current = !collapsed.current
          props.navigation.setOptions({
            drawerType: collapsed.current ? 'front' : 'permanent',
          })
        }}
      />
    </View>
  )
}

const Drawer = createDrawerNavigator()

function DrawerScreen() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'permanent',
        // drawerStyle: {
        //   width: '100%',
        // },
      }}
    >
      <Drawer.Screen
        name="Tab 1"
        component={TabDetailScreen}
        initialParams={{ tabId: 1 }}
      />
      <Drawer.Screen
        name="Tab 2"
        component={TabDetailScreen}
        initialParams={{ tabId: 2 }}
      />
      <Drawer.Screen
        name="Tab 3"
        component={TabDetailScreen}
        initialParams={{ tabId: 3 }}
      />
    </Drawer.Navigator>
  )
}

export default function DrawerApp() {
  const navigationRef = useNavigationContainerRef()
  useReduxDevToolsExtension(navigationRef)

  return (
    <NavigationContainer ref={navigationRef as any}>
      <DrawerScreen />
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
