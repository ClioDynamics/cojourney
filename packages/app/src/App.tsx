import { MantineProvider } from "@mantine/core"
import { useColorScheme } from "@mantine/hooks"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { createClient } from "@supabase/supabase-js"
import { PostHogProvider } from "posthog-js/react"
import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./App.css"
import LoadingOverlay from "./components/LoadingOverlay/LoadingOverlay"
import constants from "./constants/constants"
import Error404 from "./pages/404/Error404"
import CJProfile from "./pages/app/CJProfile"
import RoomLayout from "./pages/app/Room/index"
import Root from "./pages/app/root"
import UserPreferences from "./pages/app/UserPreferences/UserPreferences"
import UserProfile from "./pages/app/UserProfile"
import Splash from "./pages/app/Screens/Splash"
import Welcome from "./pages/app/Screens/Welcome"
import Chat from "./pages/app/Screens/Chat"
import ConnectionsScreen from "./pages/app/Screens/Connections"
import CJProfileScreen from "./pages/app/Screens/CJProfile"
import FriendProfile from "./pages/app/Screens/FriendProfile"
import MyAccount from "./pages/app/Screens/MyAccount"

const supabase = createClient(
  constants.supabaseUrl || "",
  constants.supabaseAnonKey || ""
)

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/chat/:roomId",
        element: <RoomLayout />
      },
      {
        path: "/account",
        element: <UserPreferences />
      },
      {
        path: "/profile",
        element: <UserProfile />
      },
      {
        path: "/cjprofile",
        element: <CJProfile />
      }
    ]
  },
  {
    path: "/splash",
    element: <Splash />
  },
  {
    path: "/welcome",
    element: <Welcome />
  },
  {
    path: "/chat",
    element: <Chat />
  },
  {
    path: "/connections",
    element: <ConnectionsScreen />
  },
  {
    path: "/cj-profile",
    element: <CJProfileScreen />
  },
  {
    path: "/friend-profile",
    element: <FriendProfile />
  },
  {
    path: "/my-account",
    element: <MyAccount />
  }
])

const App = (): JSX.Element => {
  const colorScheme = useColorScheme()
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <MantineProvider
        theme={{
          colorScheme,
          primaryColor: "blue",
          defaultRadius: "md",
          colors: {
            // override dark colors to change them for all components
            dark: [
              "#c2c2c2",
              "#a7a7a7",
              "#7e7e7e",
              "#636363",
              "#474747",
              "#3f3f3f",
              "#202020",
              "#1a1a1a",
              "#141414",
              "#111111"
            ]
          },
          components: {
            Button: {
              defaultProps: {
                size: "xs",
                color: "blue"
              }
            }
          },
          fontSizes: {
            xxl: "1.75rem",
            "2xl": "2.25rem"
          },
          spacing: {
            xxl: "1.75rem",
            "2xl": "2rem",
            "3xl": "3rem",
            "4xl": "4rem",
            "5xl": "5rem"
          }
        }}
        withGlobalStyles
      >
        <PostHogProvider
          apiKey={constants.posthogApiKey}
          options={{
            api_host: "https://app.posthog.com"
          }}
        >
          <Notifications />
          <ModalsProvider>
            <RouterProvider router={router} />
            <LoadingOverlay />
          </ModalsProvider>
        </PostHogProvider>
      </MantineProvider>
    </SessionContextProvider>
  )
}

export default App
