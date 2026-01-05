import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { Float, PerspectiveCamera, Environment } from "@react-three/drei";

const Phone = ({ textureUrl, position, rotation }: { textureUrl: string; position: [number, number, number]; rotation: [number, number, number] }) => {
    const texture = useLoader(THREE.TextureLoader, textureUrl);

    return (
        <group position={position} rotation={rotation}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh>
                    <boxGeometry args={[1.5, 3, 0.1]} />
                    <meshStandardMaterial map={texture} />
                </mesh>
                {/* Side/Back material (dark grey) */}
                <mesh position={[0, 0, -0.06]}>
                    <boxGeometry args={[1.52, 3.02, 0.05]} />
                    <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
                </mesh>
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
        "/iphone-17pro(front).jpeg",
        "/black-galaxy-s24-ultra.jpg",
        "/Grey-Google-Pixel-9-Pro-XL.jpg"
    ];

    return (
        <group ref={groupRef}>
            {phones.map((url, i) => {
                const angle = (i / phones.length) * Math.PI * 2;
                const x = Math.sin(angle) * radius;
                const z = Math.cos(angle) * radius;

                return (
                    <Phone
                        key={i}
                        textureUrl={url}
                        position={[x, 0, z]}
                        rotation={[0, angle, 0]}
                    />
                );
            })}
        </group>
    );
};

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
