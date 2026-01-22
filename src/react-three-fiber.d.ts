import { Object3DNode } from '@react-three/fiber';
import { Group, Mesh, AmbientLight, PointLight } from 'three';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            group: Object3DNode<Group, typeof Group>;
            mesh: Object3DNode<Mesh, typeof Mesh>;
            ambientLight: Object3DNode<AmbientLight, typeof AmbientLight>;
            pointLight: Object3DNode<PointLight, typeof PointLight>;
        }
    }
}
