module Core.Filters {
    export class GrayFilter extends PIXI.Filter {
        constructor(gray: number = 1) {
            let fragmentSrcData: string =
                "precision mediump float;\n"+
                "varying vec2 vTextureCoord;\n"+
                "varying vec4 vColor;\n"+
                "uniform sampler2D uSampler;\n"+
                "uniform float gray;\n"+
                "void main(void) {\n"+
                "   gl_FragColor = texture2D(uSampler, vTextureCoord);\n"+
                "   gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), gray);\n"+
                "}";

            super(null, fragmentSrcData, { gray: { type: "1f", value: gray }});
        }
    }
}