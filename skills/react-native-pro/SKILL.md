---
name: react-native-pro
description: Production React Native patterns — navigation, state, performance, native modules
triggers: [React Native, mobile development, iOS, Android, cross-platform, mobile app]
---

# SKILL: React Native Pro

## Navigation Patterns

```tsx
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

## State Management (Zustand)

```tsx
import { create } from 'zustand'

const useStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null })
}))

function Profile() {
  const { user, logout } = useStore()
  return <Button onPress={logout}>Logout</Button>
}
```

## Performance Optimization

```tsx
// ✅ Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <View>{/* render */}</View>
})

// ✅ FlatList for large lists (virtualized)
<FlatList
  data={items}
  renderItem={({ item }) => <Item data={item} />}
  keyExtractor={item => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={5}
/>

// ❌ Don't use ScrollView for large lists
```

## Platform-Specific Code

```tsx
import { Platform } from 'react-native'

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.select({
      ios: 20,
      android: 0
    })
  }
})
```

## Quality Checks
- [ ] Navigation setup (React Navigation)
- [ ] State management (Zustand/Redux)
- [ ] Performance optimized (FlatList, memoization)
- [ ] Platform-specific code handled
- [ ] Testing configured (Jest, Testing Library)
- [ ] Deep linking enabled
- [ ] Push notifications configured
- [ ] Offline support implemented
