import { useState } from "react";
import { Button } from "@material-tailwind/react";


export function DashBoard(){
    const [auth, setAuth] = useState(false);

    return (
        <div className="size-full flex justify-center items-center">
            {auth ? (<h1>Welcome</h1>): <SignUp />}
        </div>
    );
};


function SignUp(){

    return (
        <div className="grow flex flex-col justify-center items-center gap-3">
            <h1 className="text-white font-bold">Log In To See Your Favorite Shows</h1>
            <div className="flex items-center justify-center gap-2">
                <Button>Log In</Button>
                <Button className="bg-purple-500 drop-shadow-md">Sign Up</Button>
            </div>
        </div>
    );
};