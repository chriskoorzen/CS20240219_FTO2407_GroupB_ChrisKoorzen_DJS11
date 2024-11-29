import { useState, useRef } from "react";
import {
    Button,
    Checkbox,
    Dialog,
    Card,
    CardBody,
    CardFooter,
    Typography,
    Input
} from "@material-tailwind/react";


import { users } from "../api/storage";


export function SignUp({setUserID}){
    const [openLogin, setOpenLogin] = useState(false);
    const loginForm = useRef(null);
    const [loginError, setLoginError] = useState(false);

    const [openSignUp, setOpenSignUp] = useState(false);
    const signupForm = useRef(null);
    const [passMatchError, setPassMatchError] = useState(false);
    const [userExistsError, setUserExistsError] = useState(false);


    function logIn(event){
        event.preventDefault();

        const user = users.logIn(
            event.target.elements["username"].value,
            event.target.elements["password"].value,
            event.target.elements["stayLoggedIn"].checked,
        );

        if (user === false){
            setLoginError(true);
            return;
        };

        // All checks passed
        setLoginError(false);
        setOpenLogin(false);
        setUserID(user);
    };

    function signUp(event){
        event.preventDefault();

        if (event.target.elements["password"].value
            !==
            event.target.elements["password-verify"].value){
                setPassMatchError(true);
                setUserExistsError(false);
                return;
        };

        const newUser = users.signUp(
            event.target.elements["name"].value,
            event.target.elements["username"].value,
            event.target.elements["password"].value,
            event.target.elements["stayLoggedIn"].checked,
        );

        if (newUser === false){
            setUserExistsError(true);
            setPassMatchError(false);
            return;
        };

        // All checks passed
        setPassMatchError(false);
        setUserExistsError(false);
        setOpenSignUp(false);
        setUserID(newUser);
    };

    return (
        <div className="flex flex-col justify-center items-center gap-3">
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
                <form ref={loginForm} onSubmit={logIn}>
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
                        <Input label="Username" size="lg" color="white" name="username" error={loginError}/>
                        <Typography className="-mb-2" variant="h6" color="white">
                            Your Password
                        </Typography>
                        <Input label="Password" size="lg" color="white" name="password" error={loginError}/>
                        <div className="-ml-2.5 -mt-3">
                            <Checkbox color="purple" label="Remember Me" name="stayLoggedIn"/>
                        </div>
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button variant="gradient" color="blue-gray" onClick={()=>{loginForm.current.requestSubmit()}} fullWidth>
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
                </form>
            </Dialog>

            <Dialog
                size="xs"
                open={openSignUp}
                handler={()=>{setOpenSignUp(val => !val)}}
                className="bg-transparent shadow-none"
            >
                <form ref={signupForm} onSubmit={signUp}>
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
                        <Input label="Name" size="lg" color="white" name="name"/>
                        <Typography className="-mb-2" variant="h6" color="white">
                            Your Username
                        </Typography>
                        <Input label="Username" size="lg" color="white" name="username" error={userExistsError}/>
                        <Typography className="-mb-2" variant="h6" color="white">
                            Your Password
                        </Typography>
                        <Input label="Password" size="lg" color="white" name="password" error={passMatchError}/>
                        <Typography className="-mb-2" variant="h6" color="white">
                            Re-enter Your Password
                        </Typography>
                        <Input label="Re-enter Password" size="lg" color="white" name="password-verify" error={passMatchError}/>
                        <div className="-ml-2.5 -mt-3">
                            <Checkbox color="purple" label="Remember Me" name="stayLoggedIn"/>
                        </div>
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button variant="gradient" color="purple" onClick={()=>{signupForm.current.requestSubmit()}} fullWidth>
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
                </form>
            </Dialog>
        </div>
    );
};