'use client'
import React, { useState } from "react";
import Image from "next/image";
import Banner from "../assets/homeBanner.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

// interfaces

interface UserDetails {
  email: string;
  username: string;
  password: string;
}
const Home = () => {
  const [isLogin, setIsLogin] = React.useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    email: "",
    username: "",
    password: "",
  });
  const testApi = trpc.users.getUser.useQuery();
  console.log(testApi?.data);


  const router = useRouter();

//   Login Api handled
  const handleLogin = trpc.users.loginUser.useMutation({
    onSuccess: (data) => {
      console.log("Login successful", data);
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login failed", error.message);
    },
  });

//   Signup Api handled
  const handleSignup = trpc.users.signupUser.useMutation({
    onSuccess: (data) => {
      console.log("Signup successful", data);
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Signup failed", error.message);
    },
  });
  return (
    <div className={"w-full bg-black h-screen text-white"}>
      <div className={"h-full container w-full max-w-[1280px] mx-auto my-0"}>
        <div className={" w-full h-full flex  items-center justify-center"}>
          <div className="h-[80vh] w-full flex flex-1 border border-1 rounded-3xl p-4 gap-5">
            {/*    left*/}
            <div className={"h-full flex flex-[0.5] flex-col gap-5"}>
              <h1 className={"text-center"}>Login</h1>
              <p className={"text-center"}>
                Let&apos;s get started with your expense management journey
              </p>
              <label htmlFor="">
                <p>Email</p>
                <Input
                  onChange={(e) => {
                    setUserDetails({ ...userDetails, email: e.target.value });
                  }}
                />
              </label>
              <label htmlFor="">
                <p>Username</p>
                <Input
                  onChange={(e) => {
                    setUserDetails({
                      ...userDetails,
                      username: e.target.value,
                    });
                  }}
                />
              </label>
              <label htmlFor="">
                <p>Password</p>
                <Input
                  onChange={(e) => {
                    setUserDetails({
                      ...userDetails,
                      password: e.target.value,
                    });
                  }}
                />
              </label>
              <Button
                onClick={() => {
                  if (isLogin) {
                    handleLogin.mutate({
                      identifier: userDetails?.username,
                      password: userDetails?.email,
                    });
                  } else {
                    handleSignup.mutate(userDetails);
                  }
                }}
                variant={"outline"}
                className={"text-black w-fit"}
              >
                {isLogin ? "Log in" : "Register"}
              </Button>
              {!isLogin && (
                <p>
                  Already have an account?{" "}
                  <span
                    onClick={() => {
                      setIsLogin(true);
                    }}
                    className={"font-extrabold underline cursor-pointer"}
                  >
                    Login
                  </span>
                </p>
              )}
            </div>
            {/*    right*/}
            <div className="flex-[0.5] h-full home-bg rounded-3xl home-responsive">
              <Image
                className={"w-full h-full object-cover"}
                src={Banner}
                alt={"home-banner"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
