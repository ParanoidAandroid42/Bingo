module Core.Filters {
    export class ToneFilter extends PIXI.Filter {
        constructor(tone: number = 0) {
            let fragmentSrcData: string =
                "precision mediump float;\n" +
                "varying vec2 vTextureCoord;\n" +
                "uniform float tone;\n" +
                "uniform sampler2D uSampler;\n" +
                "void main(void) {\n" +
                "   gl_FragColor = texture2D(uSampler, vTextureCoord);\n" +
                "   gl_FragColor.rgb = gl_FragColor.rgb * (1.0 - tone);\n" +
                "}";

            super(null, fragmentSrcData, { tone: { type: "1f", value: tone }});
        }
    }
}