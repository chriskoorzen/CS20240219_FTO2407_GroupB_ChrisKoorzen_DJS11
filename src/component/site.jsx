import { Link } from "react-router-dom";

import {
    Navbar,
    Input,
    Button,
    Typography
} from "@material-tailwind/react";

import iconURL from "../asset/music.png";

export function SiteHeader(){

    return (
        <Navbar
            variant="gradient"
            color="blue-gray"
            className="from-gray-900 to-gray-800 px-5 py-2 h-16"
            fullWidth={true}
        >
            <div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
                <Link to="/" className="flex items-center cursor-pointer ">
                    <img
                        className="size-12 bg-purple-500 rounded-xl p-1"
                        src={iconURL}
                    />
                    <Typography
                        variant="h6"
                        className="mx-3"
                    >
                        QCast
                    </Typography>
                </Link>
                <div className="relative flex w-full gap-2 md:w-max">
                    <Input
                        type="search"
                        color="white"
                        label="Search Titles..."
                        className="pr-20"
                        containerProps={{
                        className: "min-w-72",
                        }}
                    />
                    <Button
                        size="sm"
                        color="white"
                        className="!absolute right-1 top-1 rounded"
                    >
                        Search
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button>Sign Up</Button>
                    <Button>Log In</Button>
                </div>
            </div>
    </Navbar>
    );
};