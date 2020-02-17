module Core.Filters {
    export class InvertFilter extends PIXI.Filter {
        constructor(invert: number = 0) {
            let fragmentSrcData: string =
                "precision mediump float;\n" +
                "varying vec2 vTextureCoord;\n" +
                "uniform float invert;\n" +
                "uniform sampler2D uSampler;\n" +
                "void main(void) {\n" +
                "   gl_FragColor = texture2D(uSampler, vTextureCoord);\n" +
                "   gl_FragColor.rgb = mix((vec3(1)-gl_FragColor.rgb) * gl_FragColor.a, gl_FragColor.rgb, (1.0 - invert));\n" +
                "   gl_FragColor.rgb = gl_FragColor.rgb * gl_FragColor.a;\n" +
                "}";

            super(null, fragmentSrcData, { invert: { type: "1f", value: invert }});
        }
    }
}