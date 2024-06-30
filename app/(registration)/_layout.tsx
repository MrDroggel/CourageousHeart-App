import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { Stack, useRouter } from "expo-router";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";

export default function RegistrationLayout() {
  const [initializing, setInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const router = useRouter();

  useEffect(() => {
    const auth = FIREBASE_AUTH;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(currentUser);
        if (user.emailVerified) {
          router.replace("/(tabs)");
        } else {
          auth.signOut();
        }
      }

      if (initializing) setInitializing(false);
    });

    return () => unsubscribe();
  }, [initializing, router, currentUser]);

  if (initializing) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profilData" />
      <Stack.Screen name="accountData" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
