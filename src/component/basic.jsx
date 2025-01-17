import { useState, useRef, Children, useEffect, cloneElement } from "react";


export function AsyncImage({ imgUrl, className, alt }){
    const [isReady, setIsready] = useState(false);

    return (
        <>
            <img 
                src={imgUrl} 
                className={`${isReady ? "": "hidden"} ${className}`} 
                alt={alt}
                onLoad={()=>{setIsready(true)}}
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                preserveAspectRatio="none"
                strokeWidth={2}
                stroke="currentColor"
                className={`text-gray-500 ${isReady ? "hidden": ""} animate-pulse ${className}`}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
            </svg>
        </>
    );
};


export function ImageSlider({ setActiveIndexCallback, children }) {
    const container = useRef(null);
    const index = useRef(0);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(()=>{
        setTimeout(()=>{
            // Workaround, because on immediate mount scrollWidth always === clientWidth
            const overflow = container.current.scrollWidth > container.current.clientWidth;
            setIsOverflowing(overflow);
        }, 300);

    });

    function scrollRight(){
        index.current += 1;
        if (index.current >= children.length){
            index.current = 0;
        };

        const activeItem = container.current.children.item(index.current);
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };

    function scrollLeft(){
        index.current -= 1;
        if (index.current < 0){
            index.current = children.length-1;
        };
        
        const activeItem = container.current.children.item(index.current);
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };

    function clickSelect(event){
        event.stopPropagation();
        const pos = Array.from(container.current.children).indexOf(event.currentTarget);

        index.current = pos;
        event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        if (setActiveIndexCallback){
            setActiveIndexCallback(pos);
        };
    };


    return (
        <div className="relative h-fit py-4 px-12">
            {isOverflowing ? (<>
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
            </>) : null}
            <div
                ref={container}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth"
            >
                { Children.map(children, (child) => (
                    cloneElement(child, {
                        clickSelect
                    })
                ))}
            </div>
        </div>
    );
};


export function SliderItem({children, clickSelect}){

    return (
        <div className="snap-center snap-always shrink-0 first:ml-4 last:mr-4" onClick={clickSelect}>
            {children}
        </div>
    );
};
