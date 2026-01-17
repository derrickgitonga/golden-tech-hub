import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, PerspectiveCamera, Environment, useTexture, Text } from "@react-three/drei";

const Phone = ({
    textureUrl,
    position,
    rotation,
    phoneName
}: {
    textureUrl: string;
    position: [number, number, number];
    rotation: [number, number, number];
    phoneName: string;
}) => {
    const texture = useTexture(textureUrl);

    return (
        <group position={position} rotation={rotation}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Front face with phone image */}
                <mesh>
                    <boxGeometry args={[1.5, 3, 0.1]} />
                    <meshStandardMaterial map={texture} />
                </mesh>
                {/* Back face with gradient and phone name */}
                <mesh position={[0, 0, -0.06]}>
                    <boxGeometry args={[1.52, 3.02, 0.05]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>
                {/* Phone name text on the back */}
                <Text
                    position={[0, 0, -0.09]}
                    rotation={[0, Math.PI, 0]}
                    fontSize={0.18}
                    color="#fbbf24"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={1.3}
                    textAlign="center"
                    font="/fonts/Inter-Bold.woff"
                    outlineWidth={0.01}
                    outlineColor="#000000"
                >
                    {phoneName}
                </Text>
            </Float>
        </group>
    );
};

const Carousel = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.5; // Rotate the entire group
        }
    });

    const radius = 2.5;
    const phones = [
        { url: "/iphone-17pro(front).jpeg", name: "iPhone 17 Pro" },
        { url: "/black-galaxy-s24-ultra.jpg", name: "Galaxy S24 Ultra" },
        { url: "/Grey-Google-Pixel-9-Pro-XL.jpg", name: "Pixel 9 Pro XL" }
    ];

    return (
        <group ref={groupRef}>
            {phones.map((phone, i) => {
                const angle = (i / phones.length) * Math.PI * 2;
                const x = Math.sin(angle) * radius;
                const z = Math.cos(angle) * radius;

                return (
                    <Phone
                        key={i}
                        textureUrl={phone.url}
                        phoneName={phone.name}
                        position={[x, 0, z]}
                        rotation={[0, angle, 0]}
                    />
                );
            })}
        </group>
    );
};

// Preload textures
[
    "/iphone-17pro(front).jpeg",
    "/black-galaxy-s24-ultra.jpg",
    "/Grey-Google-Pixel-9-Pro-XL.jpg"
].forEach(url => useTexture.preload(url));


const PhoneCarousel3D = () => {
    return (
        <div className="w-full h-[300px] md:hidden relative z-10 my-8">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Carousel />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};

export default PhoneCarousel3D;
