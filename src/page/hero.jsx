import { Suspense, useRef, useState, useEffect } from "react";
import { Await } from "react-router-dom";
import { useRouteLoaderData, useAsyncValue } from "react-router";


export function LandingPage(){
    const { previews } = useRouteLoaderData("root");
    const [focusItem, setFocusItem] = useState("");

    return (
        <div className="grow rounded-lg bg-gray-800 my-3 mr-3 p-4 flex flex-col justify-between items-center">
            <h1 className="text-white text-3xl font-bold text-center">
                Discover the best shows from around the world
            </h1>
            <Suspense fallback={<h1 className="text-2xl font-bold p-4 text-center">Loading blog posts...</h1>}>
                <Await resolve={previews}>
                    <img src={focusItem} className="size-96"/>
                    <ImageSlider activeCallback={setFocusItem}/>
                </Await>
            </Suspense>
        </div>
    );
};

function ImageSlider({ activeCallback }) {
    const data = useAsyncValue();
    const container = useRef(null);
    const index = useRef({max: data.length, current: 0});

    useEffect(() => {
        activeCallback(data[index.current.current].image)
    });

    function scrollRight(){
        index.current.current += 1;
        if (index.current.current >= index.current.max){
            index.current.current = 0;
        };

        const activeItem = container.current.children.item(index.current.current);
        activeItem.scrollIntoView();
        activeCallback(data[index.current.current].image);
    };

    function scrollLeft(){
        index.current.current -= 1;
        if (index.current.current <= 0){
            index.current.current = index.current.max-1;
        };
        
        const activeItem = container.current.children.item(index.current.current);
        activeItem.scrollIntoView();
        activeCallback(data[index.current.current].image);
    };


    return (
        <div className="relative w-[800px] h-fit py-4 px-12">
            <button
                className="rounded-full size-10 bg-gray-300/40 hover:bg-gray-300 absolute top-1/2 -translate-y-5 left-0"
                onClick={scrollLeft}
            >
                <i className="fas fa-chevron-left size-3" />
            </button>
            <button
                className="rounded-full size-10 bg-gray-300/40 hover:bg-gray-300 absolute top-1/2 -translate-y-5 right-0"
                onClick={scrollRight}
            >
                <i className="fas fa-chevron-right size-3" />
            </button>
            <div
                ref={container}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth"
            >
                { data.sort((a, b)=>{ return a.title > b.title })
                .map((el, index) => (
                    <div key={index} className="snap-center snap-always shrink-0 first:pl-40 last:pr-40">
                        <img
                            className="size-40 object-cover"
                            src={el.image}
                            alt={`image ${index}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
