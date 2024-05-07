import type { User } from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  scopes: ["https://www.googleapis.com/auth/user.photo.read"],
});

const SignIn = () => {
  const [info, setInfo] = useState<User["user"] | undefined>();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    void isSignedIn();
  }, []);

  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    setSignedIn(isSignedIn);
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { user } = await GoogleSignin.signIn();
      setInfo(user);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setInfo(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Hello world {JSON.stringify(info)}</Text>
      {signedIn ? (
        <Button title="Sign Out" onPress={signOut} />
      ) : (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          onPress={signIn}
        />
      )}
    </View>
  );
};

export default SignIn;
