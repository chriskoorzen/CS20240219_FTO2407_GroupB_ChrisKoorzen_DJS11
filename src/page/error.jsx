import { useRouteError, Link } from "react-router-dom";


export function MainErrorPage(){
    const error = useRouteError();

    return (
        <div className="size-full p-16 bg-gray-900 flex flex-col gap-10">
            <h1 className="text-center text-4xl text-white font-bold">Something went wrong.</h1>
            <p className="text-center text-white">Sorry about that.</p>
            <p className="text-center text-white">
                Please contact <a className="font-bold underline hover:text-purple-400" href="mailto:someone@example.com">support</a> and paste the error message below into the email body:
            </p>

            <p className="p-3 bg-yellow-100 w-full rounded">{error.toString()}</p>

            <Link to="/" className="p-2 rounded-lg bg-white font-bold block w-fit mx-auto">Go back Home</Link>
        </div>
    );
};


export function RouteNotFound(){

    return (
        <div className="bg-gray-900 flex flex-col gap-10">
            <h1 className="text-center text-4xl text-white font-bold">This Page does not exist.</h1>
            <p className="text-center text-white">The requested route is not recognized. Please check the address carefully and try again.</p>

            <Link to="/" className="p-2 rounded-lg bg-white font-bold block w-fit mx-auto">Go back Home</Link>
        </div>
    );
};