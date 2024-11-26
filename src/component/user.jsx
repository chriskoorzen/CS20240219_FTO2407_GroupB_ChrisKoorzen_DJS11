import { useState } from "react";
import {
    Button,
    Dialog,
    Card,
    CardBody,
    CardFooter,
    Typography,
    Input
  } from "@material-tailwind/react";


export function DashBoard(){
    const [auth, setAuth] = useState(false);

    return (
        <div className="size-full flex justify-center items-center">
            {auth ? (<h1>Welcome</h1>): <SignUp />}
        </div>
    );
};


function SignUp(){
    const [openLogin, setOpenLogin] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);

    function signIn(){};

    return (
        <div className="grow flex flex-col justify-center items-center gap-3">
            <h1 className="text-white font-bold">Log In To See Your Favorite Shows</h1>
            <div className="flex items-center justify-center gap-2">
                <Button
                    onClick={()=>{setOpenLogin(true)}}
                >
                    Log In
                </Button>
                <Button
                    onClick={()=>{setOpenSignUp(true)}}
                    className="bg-purple-500 drop-shadow-md"
                >
                        Sign Up
                </Button>
            </div>
            <Dialog
                size="xs"
                open={openLogin}
                handler={()=>{setOpenLogin(val => !val)}}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full max-w-96 bg-gray-900 border border-white">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="white">
                            Log In
                        </Typography>
                        <Typography
                            className="mb-3 font-normal"
                            variant="paragraph"
                            color="white"
                        >
                            Enter your username and password to Log In.
                        </Typography>
                        <Typography className="-mb-2" variant="h6" color="white">
                            Your Username
                        </Typography>
                        <Input label="Username" size="lg" color="white"/>
                        <Typography className="-mb-2" variant="h6" color="white">
                            Your Password
                        </Typography>
                        <Input label="Password" size="lg" color="white"/>
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button variant="gradient" color="blue-gray" onClick={()=>{console.log("log in")}} fullWidth>
                            Log In
                        </Button>
                        <Typography variant="small" className="mt-4 flex justify-center" color="white">
                            Don&apos;t have an account?
                            <Typography
                                variant="small"
                                color="purple"
                                className="ml-1 font-bold hover:underline cursor-pointer"
                                onClick={()=>{setOpenLogin(false); setOpenSignUp(true)}}
                            >
                                Sign up
                            </Typography>
                        </Typography>
                    </CardFooter>
                </Card>
            </Dialog>

            <Dialog
                size="xs"
                open={openSignUp}
                handler={()=>{setOpenSignUp(val => !val)}}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full max-w-96 bg-gray-900 border border-white">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="purple">
                            Sign Up
                        </Typography>
                        <Typography
                            className="mb-3 font-normal"
                            variant="paragraph"
                            color="white"
                        >
                            Enter your details to Sign Up.
                        </Typography>
                        <Typography className="-mb-2" variant="h6" color="white">
                            Your Name
                        </Typography>
                        <Input label="Name" size="lg" color="white"/>
                        <Typography className="-mb-2" variant="h6" color="white">
                            Your Username
                        </Typography>
                        <Input label="Username" size="lg" color="white"/>
                        <Typography className="-mb-2" variant="h6" color="white">
                            Your Password
                        </Typography>
                        <Input label="Password" size="lg" color="white"/>
                        <Typography className="-mb-2" variant="h6" color="white">
                            Re-enter Your Password
                        </Typography>
                        <Input label="Re-enter Password" size="lg" color="white"/>
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button variant="gradient" color="purple" onClick={()=>{console.log("sign up")}} fullWidth>
                            Sign Up
                        </Button>
                        <Typography variant="small" className="mt-4 flex justify-center" color="white">
                            Already have an account?
                            <Typography
                                variant="small"
                                color="white"
                                className="ml-1 font-bold hover:underline cursor-pointer"
                                onClick={()=>{setOpenSignUp(false); setOpenLogin(true);}}
                            >
                                Log in
                            </Typography>
                        </Typography>
                    </CardFooter>
                </Card>
            </Dialog>
        </div>
    );
};