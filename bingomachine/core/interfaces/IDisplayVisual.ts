module Core.Interfaces {
    export interface IDisplayVisual {
        /** change visual's position according to display orientation(landscape or portrait) */
        changeOrientation(orientation: DisplayOrientation): void;
        /** change visual according to visual type */
        changeVisual(type: VisualType): void;
         /** stage's init function */
        initProperties(): void;
    }
}