import { useEffect, useState } from "react";

const RotatingPhoneNames = () => {
    const phones = [
        "iPhone 17 Pro Max",
        "Samsung Galaxy S25 Ultra",
        "Google Pixel 9 Pro XL",
        "OnePlus 13",
        "Xiaomi 15 Ultra"
    ];

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            {/* Rotating Container */}
            <div className="relative w-[600px] h-[600px] animate-spin-slow">
                {phones.map((phone, index) => {
                    const angle = (index / phones.length) * 360;
                    const radius = 280; // Distance from center

                    return (
                        <div
                            key={phone}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            style={{
                                transform: `rotate(${angle}deg) translate(0, -${radius}px)`,
                            }}
                        >
                            <span className="text-gold/40 text-sm font-medium tracking-[0.2em] uppercase whitespace-nowrap">
                                {phone}
                            </span>
                        </div>
                    );
                })}

                {/* Inner decorative ring */}
                <div className="absolute inset-0 rounded-full border border-gold/10" />
            </div>
        </div>
    );
};

export default RotatingPhoneNames;
