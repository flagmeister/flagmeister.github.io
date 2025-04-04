/* eslint-disable no-console */

// languages "ar:Arabic:sa,cs:Czech:cz,da:Danish:dk,de:German:de,el:Greek:gr,en:English:gb,en-gb:English:us,es:Spanish,fr:French:fr,fi:Finnish:fi,he:Hebrew:il,hu:Hungarian:hu,it:Italian,ja:Japanse:jp,ko:Korean:kr,nb:Norwegian:no,nl:Dutch:nl,pl:Polish:pl,pt:Brazilian:br,pt-pt:Portugese:pt,ro:Romanian:ro,ru:Russian:ru,sv,tr:Turkish:tr,uk:Ukranian:ua,zh:Chinese:cn"
!(function () {
  function log(...args) {
    // window.console.log(...args);
  }
  //-----------------------------------------------------------
  // FlagMeister.github.io - One Custom Element for 300+ flags
  // license: UNlicense
  // This file is optimized for best GZip dowload/performance
  //------------------------------------------------------------

  // TODO:
  // flags with less detail:argentina (face in sun),angola details in knife
  // replace #000 in stripes,bars with 0 (illegal color) - saves 35 Bytes

  // make colors first parameters
  // lazy load delay

  // replace "M  with "m
  // replace [0] and [1] with destructuring
  // todo use index number reference to use previous color

  // usetransform:(transform,id)=><use transform='${transform}' href='${id}'/>

  // learnings:
  // ""+"" are concatenated by terser, but ``+"" results in more bytes, thus better to stuff everything into one `` (if `` is really required)
  // find colors with capitals regexp: #(?:^|[^A-Z])[A-Z](?![A-Z])

  // language codes
  // ar, cs, da, de, el, en, en-gb, es, fr, fi, he, hu, it, ja, ko, nb, nl, pl, pt, pt-pt, ro, ru, sv, tr, uk, zh, zh-hant
  // https://stackoverflow.com/questions/2511076/which-iso-format-should-i-use-to-store-a-users-language-code

  // Syntax
  // starrotate:x,y,fill,scale=1,len=30,wid=4
  // semicircle: path:blue,M33 160 a1 1 0 0 0 124 0,,10,yellow

  // Probably NOT todo: recreate (only the detail) Detail flags in FlagMeister own Repo, easier to load full SVG from other Repo

  // resources
  // https://css-tricks.com/snippets/svg/svg-patterns/

  // eurovision participants - https://en.wikipedia.org/wiki/List_of_countries_in_the_Eurovision_Song_Contest#2020s
  // todo: Moldova, San Marino

  // FlagMeister Helper functions creating SVG

  //replaced for 2 usages: smaller GZ file
  //let $nTimes = n => [...Array(~~n).keys()];// cast string n to integer because flag parser passes a string
  if (!customElements.get("svg-flag")) {
    let $stroke_W_Color = (width, color) =>
      width ? ` stroke-width='${width}' stroke='${color}' ` : "";

    let $p_path_Color_D__id_strokewidth_stroke_color_transform = (
      color,
      d_path,
      id = "none",
      strokewidth = false,
      strokeColor,
      transform = ""
    ) =>
      `<path fill='${color}' id='${id}' d='${d_path}' ${$stroke_W_Color(
        strokewidth,
        strokeColor
      )} transform='${transform}'/>`;

    let $R_rect_X_Y_W_H___colorNone_strokewidth_stroke = (
      x,
      y,
      w,
      h,
      color = "none",
      strokewidth, //todo all usages for now are 2,BLACK
      stroke = "#000",
      attr = "" // rx="10" ry="10"
    ) =>
      `<rect x='${x}' y='${y}' width='${w}' height='${h}' fill='${color}' ${$stroke_W_Color(
        strokewidth,
        stroke
      )} ${attr}/>`;

    //todo merge next 2 functions; check for #incolor/x
    let $S_Color_X_Y_Scale___Rotate0 = (color, x, y, scale, rotate) =>
      `<defs>${$p_path_Color_D__id_strokewidth_stroke_color_transform(
        color,
        "M12 7.7l3 9h9l-7.4 5.4 2.8 8.7-7.4-5.4-7.4 5.4 2.8-8.7-7.4-5.4h9.2z",
        "s"
      )}</defs>${x ? $U_use_X_Y___scale1_rot0(x, y, scale, rotate) : ""}`;

    //todo savebytes, BUT REF all flags! put x y in outside <g> so rotate is no x,y mess
    let $U_use_X_Y___scale1_rot0 = (
      // use:
      x,
      y,
      scale = 1,
      rotate = 0,
      id = "s"
    ) =>
      `<use transform='rotate(${rotate}) scale(${scale})' href='#${id}' x='${x}' y='${y}'/>`;

    let $T_triangle_X1_Y1_X2_Y2_X3_Y3_Color_strokewidth_stroke = (
      x1,
      y1,
      x2,
      y2,
      x3,
      y3,
      color,
      strokewidth,
      stroke
    ) =>
      $p_path_Color_D__id_strokewidth_stroke_color_transform(
        color,
        `M${x1} ${y1}L${x2} ${y2}L${x3} ${y3}`,
        "tr",
        strokewidth,
        stroke
      );

    //https://stackoverflow.com/questions/34229483/why-is-my-svg-line-blurry-or-2px-in-height-when-i-specified-1px/34229584
    let $S_stripe_Y_Size__color_length_x = (
      y,
      size = 30,
      color = "#fff",
      length = 640,
      x = 640 - length
    ) =>
      $p_path_Color_D__id_strokewidth_stroke_color_transform(
        color,
        `M${x} ${y}h${length}v${size}H${x}`
      ); //,"",crisp ? `shape-rendering='crispEdges'` :"");//todo test anti-aliasing of stripe/bar

    let $H_bar_X_Size__color_height_y = (
      x,
      size,
      color = "#fff",
      height = 480,
      y = 480 - height
    ) =>
      $p_path_Color_D__id_strokewidth_stroke_color_transform(
        color,
        `M${x} ${y}h${size}v${height}h-${size}`
      ); //,"",crisp ? `shape-rendering='crispEdges'` :"");//todo remove crisp for better compression

    // define globals for variables used in destructuring "color" value inside stripes: and bars:
    // makes for smaller code and global values can be re-used by other flagparser functions
    let previous_color,
      repeat_color,
      repeat_x,
      repeat_y,
      repeat_size,
      repeat_width,
      repeat_height;

    let $F_stripes_arr = (
      stripes_array,
      width,
      offset = 0, // y position
      x,
      repeat_height = 480 / stripes_array.length,
      gap = 0
    ) =>
      stripes_array.map(
        (color, idx) => (
          // first sets variables
          ([
            repeat_color = previous_color,
            repeat_x = x, // if no y1 specified
            repeat_y = (repeat_height + gap) * idx + offset, // if no x1 specified in bars_array Value red>x1>y1
            repeat_size = repeat_height,
            repeat_width = width,
          ] = color.split(">")), //::
          // last returns the value
          $S_stripe_Y_Size__color_length_x(
            repeat_y,
            repeat_size, // + 2  old adjustment for overlapping stripes?
            (previous_color = repeat_color || previous_color),
            repeat_width,
            repeat_x
          )
        )
      ).join``;

    let $B_bars_arr = (
      bars_array, // array of colord: red|green|blue  OR red>x1>y1|green|blue>x1 >x1>y1 specifications overrule calculations
      height, // when undefined defaults to Flag height 480 in $H_bar_X_Size__color_height_y
      offset = 0, // origin , the map function calcs the x location
      y, // when undefined defaults to 0 in $H_bar_X_Size__color_height_y
      repeat_width = 640 / bars_array.length // auto calculate bar_width
    ) =>
      bars_array.map(
        (color, idx) => (
          // first sets variables
          ([
            repeat_color,
            repeat_x = repeat_width * idx + offset, // if no x1 specified in bars_array Value red>x1>y1
            repeat_y = y, // if no y1 specified
            repeat_size = repeat_width,
            repeat_height = height,
          ] = color.split(">")),
          // last returns the value
          $H_bar_X_Size__color_height_y(
            repeat_x,
            repeat_size,
            (previous_color = repeat_color || previous_color),
            repeat_height,
            repeat_y
          )
        )
      ).join``;

    let $GTransform_Content_X_Y_Rot_Scale_Id_SW_Stroke = (
      content,
      x = 0,
      y = 0,
      rot = 0,
      scale = 1,
      id = "none",
      strokewidth,
      stroke
    ) =>
      `<g fill='none' id='${id}' transform='translate(${x} ${y}) rotate(${rot}) scale(${scale})' ${$stroke_W_Color(
        strokewidth,
        stroke
      )}>${content}</g>`;

    let $L_line_width_color_x1_y1_x2_y2 = (w, c, x1, y1, x2, y2 = y1) =>
      `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' ${$stroke_W_Color(
        w,
        c
      )}/>`;

    let $X_cross_color_x_y_len__w_h = (
      color,
      x,
      y,
      len,
      w = 20,
      h = len,
      hx = len / 2,
      hy = h / 2
    ) =>
      $L_line_width_color_x1_y1_x2_y2(w, color, x - hx, y, x + hx, y) +
      $L_line_width_color_x1_y1_x2_y2(w, color, x, y - hy, x, y + hy);

    let $T_text_str_size520_x320_y430_fill_width_stroke_font_weight_anchor = (
      //Object keys are important here, match usage in textstring JSON object
      {
        str = "text",
        size = 520,
        x = 320,
        y = 430,
        fill = false,
        width,
        stroke,
        font = "courier", //'Bookman Old Style'
        weight = "bold",
        anchor = "middle", // start,end,middle // Minify more: anchor never used hardcode middle
      }
    ) =>
      `<text x='${x}' y='${y}' font-size='${size}' ${fill ? `fill='${fill}'` : ""
      } ${$stroke_W_Color(
        width,
        stroke
      )}font-family='${font}' font-weight='${weight}' text-anchor='${anchor}'>${str}</text>`;

    let $C_circle__x320_y240_r80_fill_strokewidth_stroke = (
      x = 320,
      y = 240,
      r = 80,
      fill, // setting = "none"
      strokewidth,
      stroke
    ) =>
      `<circle cx='${x}' cy='${y}' r='${r}' ${fill ? `fill='${fill}'` : ""
      } ${$stroke_W_Color(strokewidth, stroke)}/>`;

    let commands = {
      text: $T_text_str_size520_x320_y430_fill_width_stroke_font_weight_anchor,
      // text parameter defaults:
      // str='fm'
      // ,size=520
      // ,x=320
      // ,y=430
      // ,fill=""
      // ,stroke=""
      // ,font='Bookman Old Style'
      // ,weight='bold'
      // ,anchor='middle'// start,end,middle

      circle: $C_circle__x320_y240_r80_fill_strokewidth_stroke,
      //, circle: attrs => $C_circle__x320_y240_r80_fill_strokewidth_stroke

      rect: $R_rect_X_Y_W_H___colorNone_strokewidth_stroke,
      line: $L_line_width_color_x1_y1_x2_y2,
      stripe: $S_stripe_Y_Size__color_length_x,
      triangle: $T_triangle_X1_Y1_X2_Y2_X3_Y3_Color_strokewidth_stroke,
      stripes: $F_stripes_arr,
      bar: $H_bar_X_Size__color_height_y,
      cross: $X_cross_color_x_y_len__w_h,
      star: $S_Color_X_Y_Scale___Rotate0,
      use: $U_use_X_Y___scale1_rot0,
      path: $p_path_Color_D__id_strokewidth_stroke_color_transform,

      // at what pixel WIDTH image will FlagMeister lazy load a more detailed SVG:
      // include as SVG comment
      detail: (x) => `<!--dtl:${x}dtl:-->`,

      // Vertical bars
      bars: $B_bars_arr,

      rotate: (
        times,
        SVG_part,
        center_x = 320,
        center_y = 240,
        partscale = 1,
        id = "r",
        startdegree = 0, //(=90 degrees) top=-90
        max = times,
        x,
        y,
        rotation = 0,
        scale = 1
      ) =>
        $GTransform_Content_X_Y_Rot_Scale_Id_SW_Stroke(
          [...Array(~~times).keys()].map((n) =>
            max > n
              ? $GTransform_Content_X_Y_Rot_Scale_Id_SW_Stroke(
                SVG_part,
                //flagparser(part.replace(/|/g, ','))
                //todo proces as: flagparser(part)
                //but part can NOT have commas in 'path:#fff,M100 0c10 10', so need to be escaped somehow

                center_x,
                center_y,
                startdegree + (n * 360) / times, // rotate
                partscale
                //, id
                //, strokewidth
                //, stroke
              )
              : ""
          ).join``, //Content

          x,
          y,
          rotation,
          scale,
          id
          // , strokewidth
          // , stroke
        ), // rotate:

      circles: (times, x, y, gap, fill, strokewidth, stroke) =>
        [...Array(~~times).keys()].map((n) =>
          $C_circle__x320_y240_r80_fill_strokewidth_stroke(
            x,
            y,
            gap + n * gap,
            fill,
            strokewidth,
            stroke
          )
        ).join``,

      flag: (isoref, scale = 1, x = 0, y = 0) =>
        `<g id='${isoref}' transform='translate(${x} ${y})'><g transform='scale(${1 / scale
        })'>${flagparser(flags[isoref])}</g></g>`,

      // ! todo create patchwork flag
      // , flags: (str, n = Math.sqrt(str.length), x = 0, y = 0) => {
      //     let fl = str.map((iso, idx) => commands.flag(
      //         iso,
      //         n,
      //         x++ * (640 / n),
      //         (x > n ? (x = 0, y++) : y) * (480 / n)
      //     )).join``;
      //     return fl;
      // }

      bgcolor: (color) => $S_stripe_Y_Size__color_length_x(0, 480, color), // ! todo fix anti alias with crispEdges

      outline: (d) =>
        $p_path_Color_D__id_strokewidth_stroke_color_transform(
          "none",
          d,
          "outline"
        ),

      striangle: (colors_array, trianglecolor, x = 290, extra = "") =>
        $F_stripes_arr(colors_array) +
        extra +
        $T_triangle_X1_Y1_X2_Y2_X3_Y3_Color_strokewidth_stroke(
          -1,
          0,
          x,
          240,
          -1,
          480,
          trianglecolor
        ),

      //full flag diagonal cross todo: add x1,y1 x2,y2 parameters, and bgcolor=""none
      crossx: (bgcolor, color, size = 70) =>
        flagparser(
          `bgcolor:${bgcolor};pathstroke:M0 0L640 480h${size}v-480h-${size}L0 480,${bgcolor},${size},${color}`
        ),

      doublecross: (x, y, c1, c2 = c1, w1 = 480 / 4.5, w2 = w1 / 2) =>
        $X_cross_color_x_y_len__w_h(c1, 320 + x, 240 + y, 640, w1, 640, 640) +
        $X_cross_color_x_y_len__w_h(c2, 320 + x, 240 + y, 640, w2, 480, 640),

      diagonal: (trcolor, strokecolor, linefill) =>
        $T_triangle_X1_Y1_X2_Y2_X3_Y3_Color_strokewidth_stroke(
          0,
          480,
          640,
          0,
          640,
          480,
          trcolor
        ) +
        $L_line_width_color_x1_y1_x2_y2(160, strokecolor, -60, 480, 700, 0) +
        $L_line_width_color_x1_y1_x2_y2(120, linefill, -60, 480, 700, 0),

      pathstroke: (
        //D_Fill__width_col_transform
        d,
        fill,
        w = 0,
        col = "none",
        transform
      ) =>
        $p_path_Color_D__id_strokewidth_stroke_color_transform(
          fill,
          d,
          "p", // id
          w,
          col,
          transform
        ), //prf

      shield: (
        fill = "#fff",
        h = 100, // default h,x for shields in gb flags
        x = 390,
        y = 225, // for 3x in Portugal
        strokewidth,
        stroke
      ) =>
        $p_path_Color_D__id_strokewidth_stroke_color_transform(
          fill,
          `M${x} ${y}v${h}a1 1 0 0 0 ${h * 1.5} 0v-${h}z`,
          "",
          strokewidth,
          stroke
        ),

      scross: (color, x = 0, y = 0, scale = 1) =>
        $GTransform_Content_X_Y_Rot_Scale_Id_SW_Stroke(
          $S_Color_X_Y_Scale___Rotate0(color) +
          [
            [40, 70, 2],
            [10, 110, 2],
            [70, 100, 2],
            [110, 275, 1],
            [40, 160, 2],
          ].map((stars) => $U_use_X_Y___scale1_rot0(...stars)),
          x,
          y,
          0,
          scale
          // , id
          // , strokewidth
          // , stroke
        ),
      curve: (
        // _cx_cy_dx_dy_x1_y1__strokewidth_stroke_fill_id_(x3)_(y3)
        cx,
        cy,
        dx,
        dy,
        x1,
        y1,
        strokewidth = 1,
        stroke = "#000", //todo test if other functions process undefined parameter as #000
        fill = "none",
        id,
        x3 = x1 + dx / 2 + cx,
        y3 = y1 + dy / 2 + cy
      ) =>
        $p_path_Color_D__id_strokewidth_stroke_color_transform(
          fill,
          `M${x1} ${y1}C${x3} ${y3} ${x3} ${y3} ${x1 + dx} ${y1 + dy}`,
          id,
          strokewidth,
          stroke
        ),

      // base version is spanish castle
      castle: (x = 168, y = 255, scaleX = 1, scaleY = 1, rotate = 0) =>
        flagparser(
          `<g transform='translate(${x} ${y})'><g transform='scale(${scaleX} ${scaleY}) rotate(${rotate})'><defs><pattern patternUnits='userSpaceOnUse' patternTransform='scale(.2 .2)' id='castle' width='42' height='44'><g fill='none' fill-rule='evenodd'><g fill='#000'>;pathstroke:M0 0h42v44H0V0m1 1h40v20H1V1M0 23h20v20H0V23m22 0h20v20H22;</g></g></pattern></defs>;pathstroke:M0 0h2v-12h-2v-8h4v-4h-2v-4 h2v2h1v-2h2v2h1v-2h2v4h-2v4h4v-8h-2v-4 h2v2h1v-2h2v2h1v-2h2v4h-2v8h4v-4h-2v-4 h2v2h1v-2h2v2h1v-2h2v4h-2v4h4v8h-2 v12h3v8 h-31v-8,#f1bf00,.4,#000;pathstroke:M0 0h2v-12h-2v-8h4v-4h-2v-4 h2v2h1v-2h2v2h1v-2h2v4h-2v4h4v-8h-2v-4 h2v2h1v-2h2v2h1v-2h2v4h-2v8h4v-4h-2v-4 h2v2h1v-2h2v2h1v-2h2v4h-2v4h4v8h-2 v12h3v8 h-31v-8,url(#castle),.4,#000;</g></g>`
        ),

      // more presets:
      // + horizontal lines:
      //line:1,#000,0,0,30,0;line:1,#000,0,-12,28,-12;

      //, sun: (repeat, x = 320, y = 240, scale = 1) => { }
    };

    let stringIncludesSVGextension = (x) => x.includes(".svg");

    // DISABLED in 2024
    // all SVG commands can be called by fullname or abbreviated letter
    // the minified file is patched in the built step to set these same letters
    // can't use : to split because the : is in the key: (in JS source code)
    // "detail a,bgcolor b,circle c,diagonal d,circles e,flag f,doublecross g,stripes h,outline i,line l,scross m,bar n,rotate o,path p,pathstroke q,rect r,star s,stripe t,use u,bars v,striangle w,crossx x,country y,triangle z"
    //   .split`,`
    //   .map(
    //     (def) => (
    //       ([commandname, letter] = def.split` `),
    //       console.log(commandname,letter),
    //       (commands[commandname] = commands[commandname] || commands[letter])
    //     )
    //   );

    let flagparser = (fp_input, element) => {
      //if (fp_input) {
      let presets = {
        // presets the flagparser can proces
        // the output goes into the SVG string

        // display text from given attributename in font-size at y position
        // example: <img is=flag-nl alt='Netherlands' draw='attr:alt,80'>
        attr: (attrname, size, y) =>
          $T_text_str_size520_x320_y430_fill_width_stroke_font_weight_anchor({
            str: element.getAttribute(attrname),
            size,
            y,
          }),

        // set the alt attribute to specified name
        // example: country: "country:Andorra;detail:40;bars:#0018a8|#fedf00|#d0103a"
        // the flagparser creates SVG so we return an empty string
        country: (name) => (
          element && element.setAttribute("alt", name), "" //return empty string
        ),

        left: "0 0 480 480",
        center: "80 0 480 480",
        right: "160 0 480 480",

        signal: () => (
          (element.box = "0 0 480 480"),
          //make 640:480 a square flag with scale(.75 1)
          flagparser(
            "<g transform='scale(.75 1)'>;" +
            {
              a: "bars:#fff|#00f",
              b: "bgcolor:#f00",
              c: "stripes:#00f|#fff|red|#fff|#00f",
              d: "stripes:#ff0|#00f|#00f|#00f|#ff0",
              e: "stripes:#00f|#f00",
              j: "stripes:#00f|#fff|#00f",
              f: "bgcolor:#fff;path:#f00,M320 0l320 240l-320 240l-320-240z",
              g: "bars:#ff0|#00f|#ff0|#00f|#ff0|#00f",
              h: "bars:#fff|#f00",
              i: "bgcolor:#ff0;circle:320,240,140,#000",
              k: "bars:#ff0|#00f",
              l: "bgcolor:#000;path:#ff0,m0 240V0h320v480h320V240z",
              m: "crossx:#00f,#fff",
              // white/blue checker : white background, blue id='s'
              n: "bgcolor:#fff;path:#00f,m0 0h160v120h-160z,s;use:320;use:160,120;use:480,120;use:0,240;use:320,240;use:160,360;use:480,360",
              o: "bgcolor:#ff0;path:#f00,m0 0h640v480z",
              p: "bgcolor:#00f;rect:140,120,340,240,#fff",
              q: "bgcolor:#ff0",
              r: "bgcolor:#f00;doublecross:0,0,#ff0",
              s: "bgcolor:#fff;rect:140,120,340,240,#00f",
              t: "bars:#f00|#fff|#00f",
              u: "bgcolor:;path:#f00,m0 240V0h320v480h320V240z",
              v: "crossx:#fff,#f00",
              w: "bgcolor:#00f;pathstroke:m160 140h320v200h-320z,#f00,100,#fff",
              x: "bgcolor:;doublecross:0,0,#00f",
              y: "bgcolor:#ff0;path:#f00,m10 520l700-520,s,80,#f00;use:-110,-110;use:-220,-220;use:110,110;use:220,220",
              z: "bgcolor:#000;triangle:320,240,0,0,640,0,#ff0;triangle:320,240,640,480,640,0,#00f;triangle:320,240,640,480,0,480,#f00",

              0: "bgcolor:;cross:#00f,140,100,100;cross:#00f,500,100,100;cross:#00f,140,380,100;cross:#00f,500,380,100;cross:#00f,320,240,100",
              1: "stripes:#f00|#ff0|#f00",
              2: "stripes:#ff0|#f00|#ff0",
              3: "stripes:#00f|#f00|#00f",
              4: "crossx:#f00,#fff",
              5: "crossx:#ff0,#00f",
              6: "bgcolor:#fff;path:#00f,m0 480l640-480,s,100,#00f;use:-140,-140;use:140,140",
              7: "bars:#f00|#fff|#f00",
              8: "bars:#ff0|#00f|#ff0",
              9: "bars:#00f|#fff|#00f",
            }[element.getAttribute("char")] +
            ";</g>"
          )
        ),
        ics: () => (
          //set value
          //clip a square from the center of the flag
          (element.clip = "outline:M0 0l640 160l0 160l-640 160z"),
          //return value:
          flagparser(
            [
              "bars:#ff0|#f00|#ff0",
              "bgcolor:#fff;circle:200,240,120,#f00",
              "bgcolor:#00f;circle:200,240,120,#fff",
              "bars:#f00|#fff|#00f",
              "bgcolor:#f00;doublecross:-120,0,#fff",
              "bars:#ff0|#00f",
              "stripes:#000|#fff",
              "stripes:#ff0|#f00",
              "bgcolor:#fff;doublecross:-120,0,#f00",
              "stripes:#000|#ff0;rect:0,0,320,240,#fff;rect:0,240,320,240,#f00",
            ][element.getAttribute("char")]
          )
        ),

        // used in clip examples
        // <img is=flag-gd clip="bigstar" box="center">
        bigstar: (attrs) =>
          $p_path_Color_D__id_strokewidth_stroke_color_transform(
            "#000",
            // bigstar centers on left by default: 80
            `m${80 + ~~element.box.split` `[0]
            } 466 146-452 146 452-384-280h476`,
            attrs
          ), // center star depending on BOX location

        // used in clip examples
        // <img is=flag-gb clip="heart">
        heart: (attrs) =>
          $p_path_Color_D__id_strokewidth_stroke_color_transform(
            "#000",
            // heart centers on flag by default: 350
            `m${350 + ~~element.box.split` `[0]
            } 31a122 122 0 0 0-111 69 122 122 0 0 0-233 52c0 128 233 297 233 297s233-169 233-297a122 122 0 0 0-122-122`,
            attrs
          ),

        //todo: still used??
        overlay: "<use href='#overlay'/>",

        border: (width, color) =>
          `<use href='#outline' ${$stroke_W_Color(width, color)}/>`,

        // ,outline:() => `
        // <filter id='ff'>
        // <!-- Start by grabbing the alpha channel of the text and dilating it-->
        // <feMorphology operator='dilate' radius='8' in='SourceAlpha' result='thick'/>
        // <!-- Next,grab the original text (SourceGraphic) and use it to cut out the inside of the dilated text -->
        // <feComposite operator='out' in='thick' in2='SourceGraphic'></feComposite>
        // </filter>`

        //FILTER
        light: ({
          //bevel and shadows:
          color1 = "#ddd",
          color2 = "#333",
          offset = 4,
          blur = 4,
          //spotlight:
          x = 320,
          y = 240,
          z = 70,
          spot = "transparent",
          focus = 15,
        }) =>
          `<filter id='ff'><feGaussianBlur in='SourceAlpha' stdDeviation='${blur}' result='f'></feGaussianBlur><feOffset dy='${offset}' dx='${offset}'></feOffset><feComposite in2='f' operator='arithmetic' k2='-1' k3='1' result='a'></feComposite><feFlood flood-color='${color1}'></feFlood><feComposite in2='a' operator='in'></feComposite><feComposite in2='SourceGraphic' result='b' operator='over'></feComposite><feGaussianBlur in='b' stdDeviation='${blur}'></feGaussianBlur><feOffset dy='${-2 * offset
          }' dx='${-2 * offset
          }'></feOffset><feComposite in2='b' operator='arithmetic' k2='-1' k3='1' result='c'></feComposite><feFlood flood-color='${color2}'></feFlood><feComposite in2='c' operator='in'></feComposite><feComposite in2='b' operator='over' result='d'></feComposite><feSpecularLighting result='e' in='d' specularExponent='${focus}' lighting-color='${spot}'><fePointLight x='${x}' y='${y}' z='${z}'/></feSpecularLighting><feComposite in2='e' in='d' operator='arithmetic' k1='0' k2='1' k3='1' k4='0'/></filter>`,
        //TEXT

        //United Nations world
        lun: () =>
          flagparser(
            `path:#fff,m360 357l-6 6c-13-14-29-30-45-30-9 0-16 8-24 12-11 7-26 12-39 6-7-2-14-6-19-12 11 7 25 8 37 3 12-6 25-13 40-13 21 0 42 15 56 28zm-93-28l-8-3c-15-6-17-21-25-32 10 7 19 16 28 25 7 6 15 9 24 10l-7 1c-15 4-33 10-49 4-11-4-29-18-27-22 13 8 48 22 64 17zm-32-13l-10-11c-8-12-6-29-12-42 6 7 11 14 15 22 6 13 7 28 20 38-13-4-29-4-40-12-13-8-24-21-27-36 10 20 35 32 54 41zm-64-80c11 19 17 29 36 50l-3-5c-3-6-4-13-3-20 1-9 4-17 3-27 8 17 5 37 10 55l4 12c-7-6-17-11-25-17s-15-14-19-24c-3-8-3-17-3-24zm4-44c2 22 9 40 16 59-2-17 3-30 11-42l4-11c1 7-1 15-2 22l-8 26v18c-7-13-18-21-22-32-3-10-4-20-3-30zm16-38c-4 6-3 56-2 56l1-4c2-12 12-20 21-28l4-7-5 17c-6 13-19 24-22 40-1-15-10-26-10-41 1-5 7-33 13-33zm22-20c-11 8-10 20-13 31 0 2-6 12-3 12 2-5 4-9 8-13 8-6 19-11 22-21-1 14-13 25-24 33-5 4-9 8-12 14v-11c-1-13-2-26 7-36zm28-14c-8 7-13 15-19 24-5 6-12 10-18 16 3-6 4-14 8-20 0-7 29-19 29-20,l;<use transform='translate(640,0) scale(-1,1)' href='#l'/>;path:#fff,M375 206c-2 0-1 5-5 4-3-1 0-3 1-5-1-3-6-2-6 0-4 3 1-3-4-3 1-3-4-2-5-4-4-2-5 3-6 3-2 0-2 3-3-2 2-2 4-1 0-3-2 3-4 4-4 1-3 3-6 0-7 0-4 1 1 4-1 5-3 1-5-3-7-2 2-3 2-7-1-3 0 1-3 4-5 1-2-2-8 1-3 2 3 1-1 3-2 1 0 3 3 4 4 5 3-1 7 2 6 4-4 3 0 0 1 1-1 1 2 3 0 5-4 3-2 1 1 2 2 1 0 5 2 7 0 3-1 6-4 5s-4 3-4 5c-3 4 1 4 3 5-1-2 1-9 1-4 1 1 2 4-1 5-3 0-2-2-4 1-1 1 0 4-4 3 2 3-1 5-3 3-1 2-1 4 1 5 2 3 4-2 6-3 2-2 5-1 7 1 2-1-1-1-2-3 3-1 5 3 7 3 3 2 1 0 0-1-2-3 2-2 1-6-3-2 4 1 2-2 2 1 8-2 5-3-3-2 1-2 2-1 4 1 2 3-1 2-4 1-1 3-3 4s-6 2-5 5c2 2 7-4 6 1 0 3-3 3-5 3-3 0-4 4-7 2-2 1-3-3-6-1-3-1-5 3-7 2-1-2-5 2-6 2l-4 5c-1 2-2 3 0 5s3 6 6 6 4 2 7 1c3 0 6-2 8 0 3 1 2 5 6 5l1 7 6 6c2 2 5 3 7 3 4-1 7-5 10-7 2-2 6-3 4-6 2-2 1-5 0-6 0-2 5-3 3-6s-8-4-4-8c4-3 1-10-1-11-1 5-5 7-10 5l-7-4h4c2 2 5 1 7 2 4 1 4-2 4-5 2-1 2-3 2-6s-5-4-4 0c-2 1-4 3-5 1 1-1 4-2 6-5 1-4 5-4 7-7 2 2 4 0 6-1 5 1 2-3 0-4l-5-7c-2-2 2-3 2-5 4-1-1-3 4-4 3 1 5-3 6-5l-1-1zm28 32c-1 0-3 0 0 0zm2 12c-1 2 3 1 0 0zm3-2c2 5 0-4 0 0zm1-1c0-4-1 4 0 0zm-5 4c2 1-1 3 0 0zm-98 29c-3 0 0 2 0 0zm28-132c-3 0 2 3 0 0zm-25 3c4 0 4 3 0 1 0-1-2-1 0-1zm11-1c5 0 1-4 0-3-2 1 0 2 0 3zm10-17c-2 1 4 1 6 1s6-4 2-3c-3-1-4 1-7 1l-1 1zm0 5c-2-2-1-5-3-5-3 0-7 4-2 3l5 1v1zm35 8c5-3 4 6 0 1v-1zm-11 3c-3 4 2 2 1 5l4 7c-1 2 0 6 2 6 5-3 6 2 5 5 0 2 4 7 5 4 3 0 2 5 6 5l6 4c1 3 3 2 3 5 3 1 5-3 7-5 0-3-3-5-4-8l-5-5c0-4-4-2-5-6-3-1 0-3-1-6-3 2-1-3-5-3 1-3-2-3-3-5l-6-3c-2-2-4-2-5 0h-5zm-18-1c2 4 5 0 1-1l-1 1zm11 15c0-3-5-3-5-6-2-2-3-1-1 2l6 4zm1 3c-2-4 6-2 4 0-2 0-6 5-4 0zm16 13c3-3-3-4-2-7 2 0-3-6-5-5-2-1-4-7-6-5 3 0 2 4 3 5 2 1 2 5 3 7s2 5 5 6l2-1zm-23 13c2 1 3 4 6 3 3 0 7 2 4-2-3-1-6 1-8-2l-2 1zm-5 1c0 2 5 4 4 0h-4zm-1 1c-2 0-3 0 0 0zm18 0c-1-3 3 1 0 0zm3 2c-2-1 1-2 0 0zm8-10c-1-3 3 1 0 0zm3-10c0 1 0 1 0 0zm0 14c0 1 0 1 0 0zm-2-8c0 4 6 3 3-1-1-4-5 0-3 1zm4 6c2-3 7 0 4 1 0 3-4 1-4-1zm-13 8c5-2-1 3 0 0zm7-1c-5 1 0-2-1-4-1-1 1-6 3-4 1 3-3 4-2 6 7 2 0 0 0 2zm11-11l-3-3c-1-3 7 4 3 3zm-1 1c3 1 2 4 4 5 2-2-2-5-4-5zm7 16l-3-7c0-3 2-3 2 0 2 2 1 9 1 7zm1 6c0-1 0-1 0 0zm-2-5c-4 1-2 4-3 7 0 1-1 6 2 4l2-7-1-4zm-4-10c-2 0-7-3-6 1-3 2 4 1 4 5s5 3 5 2c-2 0 0-4-2-5-3 1 2-2-1-3zm-6 25c5 0 2-1 1-1l-1 1zm5-2c-1 3 3-1 0 0zm-2 14c0-4 5 1 0 0zm-11 19c3 0-1 4 0 0zm7 23c1 2 3 3 6 2 0-3 1-7-2-9s-1 4-3 5l-1 2zm-29-21c2-1 1-4 0 0zm-14 1v1m3 1c3-3-3 0 0 0zm-6-26c4-4-2-3 0 0zm-5 7c-2 3-6-3-2 0h2zm-2-13c1-5-3-2-4 1-1 2 0 4-3 4 0 2-4 6-1 7 2-1 4-3 7-2 2-1 3-2 3-5 2-1 3-4-1-4l-1-1zm-3-6c-1-1-1 3-4 4 0 4-3 2-4 5 2 4 3 0 5-2 3-1 1-4 4-5 0 0 1-3-1-2zm5-12c-2 0 1-6-4-4 0-5-1 1-3 1 0 3-4 3-6 3-4 0-7 0-10-2-4-4-7 1-11 0-1 3-6 2-1 2-1 3-3 3-6 3-2 1-2 5-4 6 0 3-1 5-3 7l-2 6c-3 2 4 3 0 4-1 1-7-6-9 0-2 2-4 3-4 6s1 6-3 7c-1 3-5-1-7 0-3 1-3-2-7-1-2 6 0-1-3 0-4-1-4 2-4 4l1 7c0 3 4 6 3 1 0-3 6 2 6 1l6 5c1 3 4 4 6 5 2 3 5 2 7 4 3 2 6-1 9 3 2 3 5 2 8 2 2-2 6-1 9-3-2-3 0-7-3-8-2-3-8-5-5-8-2-3-3-7-3-10 3-3-3-4-2-8 0-3-4-5-3-8-3-3 2-4 3-4-2-5 4-3 4-6-3-1-2-8 2-5 5 0 1 6 2 9-1 3-3 6 0 6 1-5 4-1 7-1 4 0 2 4 6 3-1 2 3 4 3 1 0 2 2 8 2 2 2-1 5-5 5-8 2 0-2-4-3-4s-3 4-4 1l5-4c3-1 1 7 4 2 2 2 2-3 4-3-1-2 5-5 0-5 0 2 1-4 3-3 3-1 6-2 5-6zm-75 64c-2-1-4-7-1-4-2 2 4 4 1 4zm-7-9c-3 0 2 4 1 1l-1-1zm78-61c-1-3 3 1 0 0zm2-1c-3 1 1-3 0 0zm0-1c0-1 0-1 0 0zm1-1c1 0 1 0 0 0`
          ),

        // detail world wun
        //+ `<path fill='white' d='M326 196h-1v1h1zm-2-1h1v1h-1zm-1 0l1-1h-1zm-1 0h-1v-1h1zm-6-1h1-1zm-1 1v-1zm0 1h-1v-1h1zm-2 1v-1h1v1zm-78 61h-1v1h1v1h1v-1zm7 9l-1-1-1-1v-1l-1-2 2 1v2h1l1 2zm21 27l-1-2 1 1 1 1 1 1h-1zm54-91h-1v-4h-3v-2h-1v1l-1 1v1h-1v1l-3 2h-6-1-2l-2-1-3-2c-2-2-5 0-5 1h-2-3l-1 1-1 1h-2 3l-1 2h-1v1h-4l-1 1-1 2-1 1v2h-1v3l-1 1v1l-2 2v2l-1 1v2h-1v1l-1 2h2v2c-1 0-2 0-1 1l-2-1-1-1c-1 1-1-1-1-1-1-1-5 1-5 1v1l-2 2-1 2h-1v7l-1 1-2 1v1h-3l-1-1h-6v-1h-4l-1 3-1-2a13 13 0 0 1 1-1h-5v2h-1v3l1 2-1 1 1 1v2l1 1v2l1 1h1v-3c-1-1 1-2 1-1l2 1 2 1c1-2 1-1 1 0l2 2h2v2c2-1 2 0 3 2a4 4 0 0 0 3 3h1l1 1 3 3h3l2 2h3c0-2 3 0 3 1l2 1 1 1 1 1h6l2-1 5-1c3 0 1-3 1-3v-4l-7-7c-2 0-1-2-1-2 2-1 0-2 0-2l-1-3-1-3v-2c-1-1 1-2 1-2 1-1-1-2-1-2v-1h-1l-1-5-3-5v-2l-1-1v-2l2-1h2v-3l2-1h1l1-1v-1h-1l-1-4c2-3 4-1 4-1h2c2 1 0 4 0 4v6l-1 1v2c1 0 1 2-1 1l1 1c1 1 1-1 1-1l2-2 3 2h4l1 3c1-2 4 0 2 1l2 1 1 1v-1c-1-1 2-2 1 0v1l1 1v2c2 0 1-3 1-3h2c-1-4 2-4 2-4l1-3c-1-1 0-2 1-1l-1-2-1-1h-1v-1h-2v1h-1v1h-2v-1h1v-1l1-2h3c0-2 1-1 1-1l1 1v3h1c0-2 2-2 3-1v-1c-1-1 0-2 1-2l1-1s1 1 0 0v-2l2-1v-2h-2c0 2-1 0 0 0l1-1v-2h2l1-1h2l2-2v-3M312 215l-1-1v3h-1l-2 2v1l-1 1v1h-2l-1 2 1 2h1l1-1v-1l1-1 1-1 1-1h1v-3h1l1-1v-2h-1zm3 6v-2l-1-1-1 1-1 1v1l-1 1v2h-1v2h-2v1l-1 1v1l-1 3 2 1 1-1v-1h5l1-1h1v-1h1v-2l1-2h1l-1-1 1-1-1-1h-3zm2 13l-2 1h-1l-1-1v-1h1l1 1h2zm5-7l1-1v-2l-2 2 1 1zm5-5l2 3v1a15 15 0 0 1-2-3v-1h1zm1 31l1-1h-1l-1 1zm-3-2v1m14-2l1-1v-1l-1 1zm29 21h1v2h5v-7l-3-3-1 1v3l-1 1-1 3zm-2-4l-1 1c-1-1 0 0 0 0h1l1-1h-1zm-5-19h1v2h-1zm11-19c-1-1 2-2 2-1v1h-2zm2-14v1h1v-1zm-5 2h3v-1h-1l-1 1v-1zm6-25h-1l-1-1h-4v2h-1v1h1v1c1-1 3 0 3 1s3 2 2 4l1 1h2v-1l1 1v-1h-1v-4h-1v-1h-1l1-2-1-1zm4 10l-2 1-1 2 1 1-1 5c-1 1 0 0 0 0v3h1l1-1 1-3v-2l1-1v-2-2l-1-1zm2 5v-1zm0 2h-1v-1l1 1zm-1-8l-1-1v-1-1l-1-1v-1l-1-2v-1l1-1v-1l1 1v2l1 2v6-1zm-7-16l1 1 1 1h1v3h1l1-1-1-1-1-2h-1l-1-1h-1zm1-1l-1-1h-1a1 1 0 0 1 0-1l-1-1 1-1 1 1 1 1 1 1v1h-1zm-11 11h-3l1-1 1-2s-1 0 0 0l-1-2h1l1-3h2v3h-1v1l-1 1v1h2l1 1c1 0 0 0 0 0h-3v1zm-7 1h2l-1 1h-1v-1zm13-8l2-1 1-1 1 1 1 1v1h-1v1h-3v-1l-1-1zm-4-6c1 0 0 3 2 2l1 1 1-1v-2l-1-1-1-1-1-1-1 1-1 2h1zm3 9v-1l1 1h-1zm-1-1v1zm0-14v1zm-1 10zm-2 0v-1h1v1zm-8 10l-1-1h1zm-3-2v-1h1v1zm-18 0h-2 2zm-3 0h-1l1-1v1zm-1 1v-1l1 1zm5-2v1h1l1 1h2v-2h-1-3zm5-1l1 1h1l1 2a5 5 0 0 0 2 0h4l2 1v-2l-2-2-2 1c-1 1-3 0-3-1l-1-1h-1l-1 1h-1zm23-13l1-2-1-1-2-2v-2h1l-4-5c-1 1-3 0-3-1l-3-4h-2v1h2l1 2-1 1 1 1h1v2l1 1v3l1 1 1 1v1l2 2 1 1 2 1 1-1M348 166v-2h3l1 1v1h-2l-1 2h-2l1-2zm-1-3v-1l-1-1-1-1-2-1-1-1v-1h-1v-1h-2l1 1 1 2 1 1h2v1l3 2zm-11-10v-1l-1-1v2zm0-5l1 1 1 1h1v-2h-1l-1-1-1 1zm18 1l-1 2v1h2v2l2 2v3l2 1-1 3 1 1 1 3h1l3-1c2 0 3 3 3 4h-1v3l3 4h2c0-2 1-1 2-1v3l1 1h2l1 1 1 1h2l1 1 1 2h1l1 2h1v1h1v2h2l1-1a6 6 0 0 0 2-2l2-2v-2s-2-1-1-2l-2-2-1-1-1-2-1-1v-1h-1l-3-3v-2h-2l-2-3-1-1h-1l1-2v-3l-2 1v-3h-2l-1-1v-2l-1-1h-1v-1l-1-1v-1h-2l-1-1-1-1h-2l-1-1h-1l-1-1v1h-2v1h-5zm11-3l2-1s2 1 2 4l-2-1h-1l-1-2zm-30 2v-2l1 1zm-5-10l-1-2v-1h-1v-2h-3l-1 1-1 1-1 1h3v1h3l1 1c2 1 2 0 1-1zm0-5c0-1-2 1 0 1h8v-1l2-1v-1h-4-2v1h-3l-1 1zm-10 17l2-1h1l-1-1-1-1-1-1-1 2 1 2zm-11 1h2l1 1v1l-1-1h-2l-1-1zm34-22l-1 1-1-1v1l1 1v-1h1zm-6-2h-1l1 1 1-1zm-3 21h-1v1l1 1 1-1-1-1zm-33 28v1h1c1 0 0 0 0 0l-1-1zm2 0h1l-1 1zm-19-19h1v1zm30 131l-1-1-1 1h1v1l1-1zm-8-8h-1l-1 1h2-1zm74-19l-1-1v2l1-1zm1-2h-1v-1l1 1zm23-8l1 1-1 1v-2zm5-4a2 2 0 0 0 0-1l-1 1 1 1v-1zm-1 1v1h1a12 12 0 0 1-1-2v1zm-3 2v1h1l-1-1zm-2-12a1 1 0 0 0-1 0h-1 2zm-28-32h-1v1l-1 1v1l-1 1h-3v-1-2h1l1-2-1-1-1-1h-2l-1 1h-1v1c0 1-3 2-2 0l1-1v-1h-2l-1-1v-1l-2-2h-3v-1h-2c-1-1-3 0-3 1v3l-1-1h-1v1l-1 1v-1c0-1-2-3 0-3v-1l1-1h1-2l-1-1a4 4 0 0 0-2 3c-1 1-3-1-2-2l-3 1h-2l-1-1v-1l-1 1-1 1-1 1 1 1v1h1l-2 1h-2l-2-2h-2l1-2 1-3-2 1-1 1s-1 0 0 0l-1 1v1h-3l-1-1-2-1-1 1h-2v1l3 1v2h-2v-1h-1v2l1 1h1l1 2h4l3 3v1l-1 1h-1v1h1l1-2 2 1-1 1v1h1v2l-1 1-1 1-1 1h-1 4v1h1v4l1 1v4l-1 1v1h-5l-1 1-1 1v3l-1 1v3h2l1 1h1v-5l1-1v3h1v1 2h-1l-1 1h-2v-1h-1v2l-2 1c2 0 0 1 0 1 1 1 0 2-3 1v2h1v1c0 2-4 1-4 0v2h-1l1 2v1h1v1h2l4-4 2-1h2l1 1h1l1 1c0 1 0 0 0 0v-1h1-1l-1-1h-1c-1-2 0-1 1-1h1l2 2 1 1h2v1h2v-1h-2v-1h-1c0-2 0-3 1-2v-1h1v-3h-1v-1l3 1v-2h3l3-2v-1h-2v-2h2v1h2l1 1 1 1h-2-1-1l-3 2h1v2h-1l-1 1h-2v1c-2 0-2 1-2 2v1l1 1 2-1 2-1c0-1 2 1 1 2v2h-2v1h-4l-1 1h-1l-1 2-3-1h-2v-1l-2-1-4 1h-1l-1 1-2 1h-1v-1h-1l-1 1-4 2v1l-1 1-1 1h-1v2h-1v1l-1 1h-1l1 2h1l1 2 1 1 1 2 1 1 1 1h4v1h6l4-1 2 1 2 1 1 3h1l2 1v1h1v6l1 1 1 2h1l4 4 3 1 1 1h3l2-1 1-1 11-9-1-1v-2c2-1 2-4 0-4-1 0-1-1 1-1v-2l3-2v-1l-5-5c-3 0 0-5 1-5 2 0 0-8 0-8h-1v-2h-1l-1 2-1 2c0 2-6 1-7 1l-2-1-2-1h-2l-1-1-2-1h2l-1-1 3 1h1l1 1h4l1 1h4v-1l1-1v-3h1v-2h1v-5l-2-2-2 1v1 1l-1 1h-2v1h-2v-2h2l1-1 1-1 1-1 2-2c0-1 1-4 3-4h2l1-2h1v1h2l1-1 3-1h2v-1l-2-2-2-1-1-3-1-1-2-3a2 2 0 0 1 0-2l2-2v-1l2-1v-1h-1l2-2h4l1-2 1-1 1-1s0-3-1-2'/>`

        leaves: (fill, stroke = fill, strokewidth = 0.2) =>
          flagparser(
            `<g id='v'>;rotate:72,<path fill='${fill}' ${$stroke_W_Color(
              strokewidth,
              stroke
            )} d='m90 0c-3 0-5-6-5-9 1 4 5 5 5 9zm0 0c3 0 5-6 5-9-1 4-5 5-5 9z'/>,320,240,1,l,-33,26;use:-640,0,-1 1,0,l;</g>;`
          ),

        crown: (
          nr = 1,
          x = [0, -80][nr],
          y = [0, -184][nr],
          scale = [1, 1.6][nr],
          pearlSize = [1.3, 2][nr], //1.3=ES-Spain 2.3=RS-Serbia,
          rubyColor = ["#aa151b", "blue"][nr],
          basePearls = ["use:28,20;use:42,19;", ""][nr],
          innerLiningColor = ["#aa151b", "transparent"][nr],
          crownRimBaseGold = ["", "m-40 12 v10h41v-14"][nr]
        ) =>
          flagparser(
            `<g id='c' transform='translate(${x} ${y}) scale(${scale})'>;` +
            // <!-- innerLiningColor (red=spain) in crown -->
            `pathstroke:M206 175l16 2a32 32 0 0 0 15 2l10 2a27 27 0 0 1 7 5l-2 1v4l-4 5-2 2-5 4h-3l-1 2-32-4-32 4-1-2h-2l-5-4-2-2-4-4-1-4-1-2a28 28 0 0 1 7-4 26 26 0 0 1 10-3h7a30 30 0 0 0 8-2l15-2M177 213 c30 5 30 5 60 0c-30 -5 -30 -5 -60 0,${innerLiningColor},.3,#000;` +
            // white pearlDefinition for <use href="#s"
            `<circle id='s' cx='155' cy='186' r='${pearlSize}' fill='#fff'/>;` +
            // <!-- left arches -->
            `<g id='a' stroke='#000' stroke-width='.4'>;` +
            // <!-- Gold curved rim -->//todo move into arches below
            `pathstroke:M206 192s1 9-6 8l-4-2c-2 4-8 4-11 1-1 2-4 3-6 3l-3-1-3 3-4-1-6-6s7 6 10 5c2-1 2-5 2-5s2 4 4 4c3 0 5-9 5-9 0 3 4 7 6 7 3 0 5-6 5-6s3 5 5 5c3 0 6-3 5-6  ${crownRimBaseGold},#f1bf00,.4,#000;` +
            // <!-- golden arches and flowers --> <!-- arches -->
            `path:#f1bf00,M183 184l2 3v-1h1v4l-1 1-4-1-1-3h2l1-3m-2 8l-3-1v1l-3 2 4 1v1h1l2-1m4-2l-1-2 2-1 3-1v1l3 1-3 2 1 1h-3l-2-1m20-12v8h-2v-1l-2-4 2 1 2-4m-1 11l-1-1v-2l-5-2v1l1 1-4 2 4 1-1 1v1h1l5-2m-39 6l-1-1h-2l-2-3h-4c0-2 1-3 3-3l3 1v-1l2 2v2l3-2 1 1 4 1-3 2h1l1 1h-6M182 184c2 2 4-3 1-3-2-3-3-8 0-10 4-4 10-4 15-2 1 1 5 0 3-1-2-2-4-1-6-2-5 0-10 1-14 4-3 3-3 9 0 12v3m1-1c-4-2-5-9-2-12 0-1 3-3 2-1-3 3-2 9 1 12l-1 2m-22 2c-4-4-2-11 3-14 4-3 10-3 16-3 1-1 2 2 0 1-5 0-10 0-15 3-2 1-4 4-4 7s4 4 2 7c0 1-4 3-3 0l2-2m2-13c-4 2-7 8-4 12 2 2-1 6-2 3-2-4-1-11 4-13l1-1;` +
            // <!-- red circles in flower -->
            `circle:183,192,2,${rubyColor};circle:163,197,2,${rubyColor};` +
            // <!-- diamond red jewel -->
            `path:${rubyColor},M174 209l2-2 3.3.4-3 2-2-1;` +
            // <!-- green jewels -->
            `path:#058e6e,M187 207l2-2 3.3.4-3 2-2-1;` +
            // <!-- red jewels -->
            `circle:206,205,3,${rubyColor};` +
            // <!-- white pearls circle #s -->
            `use:1,4;use:0,-4;use:1,-8;use:3,-12;use:6,-15;use:10,-17;use:14,-18;use:19,-18;use:23,-18;` + //outer rim
            `use:26,-2;use:24,-6;use:23,-10;use:24,-14;use:28,-20;use:32,-22;use:37,-22;use:42,-22;use:20,10;use:40,8;` + //inner rim
            basePearls + //center
            // <!-- end crown jewels -->

            // <!-- blue circle --> <!-- yellow cross -->
            `circle:206,161,5,#005bbf;path:#f1bf00,M205 151v2h-2v2h2v4h-4v2h10v-2h-4v-4h2v-2h-2v-2z;` +
            // <!-- gold center arch -->
            `pathstroke:m209.5 166 1.5 13 -5 5 -5-5 1.5-13,#f1bf00,.4,#000;` +
            // <!-- center white jewels -->
            `use:-17.5,-70,1.5;` +
            `</g>` + // end left crown
            // <!-- right arches -->
            `<use transform='scale(-1 1)' href='#a' x='-412'/>` +
            `</g>;` //<!-- end big crown -->
          ),

        gb: (bgcolor = "#00247d", scale = 2) =>
          flagparser(
            `bgcolor:${bgcolor};<defs><clipPath id='c'>;rect:0,0,640,480;</clipPath></defs><g transform='scale(${1 / scale
            })' clip-path='url(#c)'>;rect:0,0,640,480,#00247d;pathstroke:M0 0l640 480m-640 0l640 -480,,90,#fff;pathstroke:M-20-5L320 255M660-30L320 230M660 485L320 235M-20 510L320 250,,40,#cf142b;doublecross:0,0,#fff,#cf142b,99,60;</g>`
          ),

        // repeat pattern for all 52 stars,so GZip will encode great! ONLY TAKES 9 BYTES!!!
        // how:make path relative (no capitals in path)
        us: (scale = 0.85) =>
          flagparser(
            `stripes:#b22234|#fff|#b22234|#fff|#b22234|#fff|#b22234|#fff|#b22234|#fff|#b22234|#fff|#b22234;rect:0,0,${360 * scale
            },257,#3c3b6e;<g transform='scale(${scale} 1)'>;` +
            // all stars
            "path:#fff," +
            "m30 11 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m-275 26 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m-275 26 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m-275 26 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m-275 26 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m-275 26 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m-275 26 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m-275 26 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m-275 26 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11z" +
            "m61 0 3 10h11l-9 7 3 10-9-6-9 6 3-10-9-7h11" +
            ";</g>"
          ),
      }; //presets

      return (
        fp_input &&
        fp_input.split`;`.map((fmCommand) => {
          fmCommand = fmCommand.trim();
          let presetkey = fmCommand.split`:`[0];
          let preset = presets[presetkey] || commands[presetkey];
          if (preset) {
            let args = fmCommand.split`:`[1];
            if (args)
              args = fmCommand.includes(':{"')
                ? JSON.parse(fmCommand.substr(presetkey.length + 1))
                : args.split`,`;
            else args = presetkey == "text" || presetkey == "light" ? {} : [];
            if (typeof preset == "function")
              return Array.isArray(args)
                ? preset.call(
                  element,
                  ...args.map((s) =>
                    s == "0"
                      ? 0
                      : Number(s) ||
                      (s.includes("|")
                        ? s.split`|` // split array values
                        : s)
                  )
                ) // flagparser array param??
                : preset.call(element, args);
            // pass remaining string as parameters
            else return preset;
          } else return fmCommand;
        }).join``
      );
      //        }//if (fp_input)
    }; //flagparser

    let flags = {
      ad: "country:Andorra;detail:40;bars:#0018a8|#fedf00|#d0103a", //end cty
      ae: "country:Arabic Emirates;stripes:#00732f|#fff|#000;bar:0,220,#f00", //end cty

      //todo extra detail in <100 img
      af:
        "country:Afghanistan;detail:80;bars:#000|#d32011|#007a36;" +
        "leaves:#fff,#bd6b00;" +
        "use:47,35,.87,0,v;" + //x,y,scale,rotate,id
        //todo
        //fun rotate 3 partly cricles
        //+ "rotate:3,<use href='#v' transform='translate(-300 -220)'/>,320,240,.6;"

        "<g id='lf'>;" +
        // 3 banners in leaves and flag on templepillar
        "path:#fff,M220 245l-1 2c0 1 2 9 6 11 3 2 17 5 24 7 3 1 6 2 9 5l-3-10c-2-3-5-6-8-6-6 0-14-1-20-3l-7-6zm11-21v-2h6l1-3c0-1 0-4 1-3l5 8c3 4 5 9 6 13 1 5-1 10-4 13 1-3-1-7-3-10a112 112 0 00-12-16zm4 68h-1c6 7 7 9 15 8 9-1 11-3 17-6 3-2 7-3 11-1 1 0 2 0 1-1l-4-4c-3-2-8-3-12-2-6 0-12 4-18 6h-9zm32-64c-1-2-2 2-7 6-3 1-4 6-4 9v5c-1 1-2 4-1 5l6 6c2 1 3-5 3-8 1-3 1-6 4-9l6-5-7-9z;" +
        // red cover making 3 stripes in flag
        //+ "path:#d32011,M267 244l-5-5c-2-1-2-3-3-5h-1c-2 2-3 5-3 7v4l3 1c2 0 4 1 5 3l2 3 4 1-2-2v-7z;"

        //!experiment drawing
        "line:10,blue,260,240,270,250;" +
        // + "bar:160,10,hotpink,20,10;" // $H_bar_X_Size__color_height_y
        // //::
        // + "bars:red>5>20>5>20|green|blue,50,10,10,25;" // bars,x,y,width,height
        // + "stripes:#fff|||,9,180,280,20,5;" // stripes,width,offset,x,height,gap

        "</g>;" +
        "use:-640,0,-1 1,0,lf;" +
        // Arabic text at top - 750 GZb
        //+ "path:#fff,M374 172c1-4 4 0 1 2-3 4-4 10-10 11-1 1-4 0-4-1-1 0 0-2 1-1h5c3-3 6-7 7-11zm-10 9l7-13c1-1 2 2 1 3-2 1-6 8-7 11l-1-1zm-54-24c-1-2 1-3 1-2l7 14c1 2 0 2-1 1l-3-4c-2 0-4 5-10 4l-1-7s1-1 1 1c0 1 0 5 2 5s6-3 7-5l-3-7zm53 8l1-2c3 3 4 12 5 18l-1 1c0-3-2-14-5-17zm-78-3c1-1 3-3 2-4l-1-1v2l-1 2v1zm-5 0c-1-1 1-3 2-1 0 2 5 8 6 10s0 3-1 1l-7-10zm-3 0l-1 2 1 1 1-2-1-1zm-5 10l-1 1 3-1c-1-1 3 0 2-2l-2-2-1 1 2 1h-2v2h-1zm-1-4s0 2 1 1l-1-1zm-5 8l1 1c1 0 3-2 2-3 0-1-2-2-3-1s2 1 2 2l-2 1zm4 9v1h3v-6l4 3c2 1 2-4 5-4 2 0 2-2 2-4l-4-4c-2-1-2 1-1 1l3 4-2 2-4-5v2l3 3-2 4-4-4h-2l1 6-2 1zm-3-5l1 2 1-2h-2zm28-24l2 2h-2v-2zm-5 11l1 1c3-2 7-4 8-8l2-3c1-1 3 2 4 0l3-1v-3h-1v2h-1v-1h-1c-1 1-1 3-2 1-1-1-2-3-2 0l-3 2c-1 0-1-3-3-2l-1 3c0 2 4 1 4 2l-8 7zm67 6v1h4v-1h-4zm2-5l-1 1 2 1c1-1-1-1-1-2zm-9 7s-1-2-1 1 5 2 7 1c1-1 0 4 2 5l4-3c3-3 4-8 7-12 1-1-1-2-1-1-2 4-5 12-8 14-3 1-2-2-2-4 0 0-1-2-3 0l-3 1c-1 0-2 0-2-2zm8-14a612 612 0 01-5 12l5-12zm-9-3v1h3v-1h-3zm-1 3l-1 1 1 1 3-1-2-1h-1zm-6 13c-1-1-1 1 1 1 3 1 7 0 8-4l2-8c1-2 2-1 1-4h-1l-4 11c-1 3-3 4-7 4zm-3-17c-2-1 0-4 1-3l4 7 1-5c1-1 2-1 2 1l-2 6c1 3 3 5 3 8h-1l-2-6-2 8c0 1-2 1-1-1l2-9-5-6zm-17 8l1 4 5-6h1v7l3-1 1-7h1v7c0 1 3 3 3 0v-6c-1-1 1-1 2 1v4c0 3-2 4-3 4l-3-1-3 1c-4 0-2-5-3-5l-4 5c-2 0-3-4-3-6 1-2 2-2 2-1zm9-7l2 1 3-1-1-2-1 2h-1c-1 1-1 0-1-1l-1 1zm2-5v0zm-6 2l1-2 1 1-1 2-1-1zm-5 0l-2-1c0-1 2-2 3-1 1 2 0 4-2 4s-5 3-5 3l9 1c1 0 1 1-1 1l-5 1-3 4-1-1 3-4h-3v-2l4-4 3-1zm-16 6c-1-1 1-2 2-1 3 2-4 10-7 13-1 1-2-1-1-1l7-8c0-1 1-2-1-3zm8-5v1h2c0-1 0-3-1-2l-1 1zm3-3l3-3h1l-3 3h-1zm-4 0l3-2v1l-2 2-1-1zm-12 10h-1l3-4 1 1-3 3zm-2 3l1 2c-1 0-2-1-1-2zm-9-9c-1-1 2-2 1 0 0 3 5 9 5 12s-1 5-3 6c-2 2-5 2-7 1l-1-4c0-1 2 3 4 3 3 0 6-2 6-4 0-4-5-10-5-14;"
        // Arabic text at top - 480 GZb
        "path:#fff,M374 172l1 2-10 11-4-1 1-1h5l7-11zm-10 9l7-13 1 3-7 11-1-1zm-54-24l1-2 7 14-1 1-3-4-10 4-1-7 1 1 2 5 7-5-3-7zm53 8l1-2 5 18-1 1-5-17zm-78-3l2-4-1-1v2l-1 2v1zm-5 0l2-1 6 10-1 1-7-10zm-3 0l-1 2 1 1 1-2-1-1zm-5 10l-1 1 3-1 2-2-2-2-1 1 2 1h-2v2h-1zm-1-4l1 1zm-5 8l1 1 2-3-3-1 2 2zm4 9v1h3v-6l4 3 5-4 2-4-4-4-1 1 3 4-2 2-4-5v2l3 3-2 4-4-4h-2l1 6-2 1zm-3-5l1 2 1-2h-2zm28-24l2 2h-2v-2zm-5 11l1 1 8-8 2-3h4l3-1v-3h-1v2h-1v-1h-1l-2 1h-2l-3 2-3-2-1 3 4 2-8 7zm67 6v1h4v-1h-4zm2-5l-1 1 2 1-1-2zm-9 7l-1 1 7 1 2 5 4-3 7-12-1-1-8 14-2-4h-3l-3 1-2-2zm8-14h2l-7 12 5-12zm-9-3v1h3v-1h-3zm-1 3l-1 1 1 1 3-1-2-1h-1zm-6 13l1 1 8-4 2-8 1-4h-1l-4 11-7 4zm-3-17l1-3 4 7 1-5 2 1-2 6 3 8h-1l-2-6-2 8-1-1 2-9-5-6zm-17 8l1 4 5-6h1v7l3-1 1-7h1v7h3v-6l2 1v4l-3 4-3-1-3 1-3-5-4 5-3-6 2-1zm9-7l2 1 3-1-1-2-1 2h-1l-1-1-1 1zm2-5v2zm-6 2l1-2 1 1-1 2-1-1zm-5 0l-2-1 3-1-2 4-5 3 9 1-1 1-5 1-3 4-1-1 3-4h-3v-2l4-4 3-1zm-16 6l2-1-7 13-1-1 7-8-1-3zm8-5v1h2l-1-2-1 1zm3-3l3-3h1l-3 3h-1zm-4 0l3-2v1l-2 2-1-1zm-12 10h-1l3-4 1 1-3 3zm-2 3l1 2zm-9-9h1l5 12-3 6-7 1-1-4 4 3 6-4-5-14z;" +
        // Arabic subtext
        "pathstroke:M375 160c-2 0 0 3 1 1l-1-1zm5 2h2c-1 1-2 2-1 4h-1v-4zm-9 3c-2 0-1 3 0 2s1 1 2 1l4-1c1 0 2-2 0-3 0 1 0 3-1 2l-1-1h-4zm-6-5l-4 5-2 2h-2-2l3-2 2-1 4-4h1zm1 2c-1 1-2 3-1 4s-2 2-1 0v-3l2-1z;" +
        //"M386 165v0zm5 2s1-2 2 0c0 1-2 1-2 3v2-5zm-8 5c1 1 5 0 6-1l-1-2c-2 4-1 0-2 0-1 5-2-1-4 1-3 5 1 0 1 2zm-7-7c-3 1-4 6-6 7-1 0-1-2-2-1 0 1-1 2-2 1s2-1 2-2h2l1-2 4-4c1-1 2 1 1 1zm1 2c-2 1-1 7-2 5v-5h2;"

        // bottom shield for arabic text
        "path:#fff,M350 330v3c-2-1-20 3-15-1 3-2 10-1 15-2zm-58 0v3c2-2 19 4 16 0-1-1-3-3-5-3h-11zm4-21c-1-1-3 0-4 1l-14 12c-1 1-3 3 4 6l8 2c2 1 0 4 0 4-2 1 0 2 1 2 4-5 17 4 19-1l2-4h18c2 0 2 3 3 4 2 3 13-3 18 0h2c-1-2-3-5-1-5 11-2 15-5 11-8l-13-13h-4c-17 7-33 7-50 0z;" +
        // bottom arabic text
        "path:#d32011,M350 318c2 1 0 4-1 2s-5-4-5-6c3 0 4 3 6 4m-9-5c1 3-5 1-2 0h2m8 8c-3 0-6 4-8 1 1-2 4-1 5-2-1-2-3 2-5 0-2-3 1-6 3-4l5 5m-6-3c-1-2-2 2 0 0m-7-2c1 3-6 1-2 0h2m7 7c-3 1-6 0-8 2-2 0-1-3 1-3-1 0-4 0-2-2s5-1 6 1c1 1 3 0 3 2m-8 2c-3 1-5-2-6-4-1-1-2-5 1-3 1 2 1 5 3 5s2 1 2 2m-6-7c0 3-6 0-2-1l2 1m1 8c-2 0-5 2-6-1 2-1 5 0 3-3 1-2 4 0 3 2v2m-5 1l-9-1h-6c0-3 4-1 5-3 1 3 5 1 6 0 1 1 2 2 2 0 3-1 2 3 2 4m-11-8h-5 5m-3 7c-2-1-7 1-6-2 2-1 6 2 6-2 3-1 1 3 0 4m-6-1c-2 1-3-4-1-5 0-1 1-5 3-3-1 3-4 5-1 7l-1 1m-3-7c-1 3-5-1-2-2l2 2zm-1 6c-2 2-5 2-8 1-2 1-5-3-2-5l3-1c-3 1-2 5 1 5 2 1 5 1 6-2 0-2 3-1 1 0l-1 2;", //end cty

      ag: "country:Antigua;bgcolor:;stripe:0,240,0;stripe:190,120,#0072c6;pathstroke:M488 191l-72-19 61-45-75 10 39-65-67 39 12-76-45 60-18-70-20 72-45-61 13 78-66-41 38 65-73-11 60 44-75 20h332,#fcd116;pathstroke:M0 60L320 480L640 60V480H-480,#ce1126", //end cty

      //todo detail blue water and 3 dolphins
      ai: "country:Anguila;detail:40;gb;shield:#cc3", //end cty

      al:
        "country:Albania;detail:40;bgcolor:#e41e20;" +
        //left half black eagle
        // InkScape simplified less detail 360 GZb todo save maybe 20 or 30 bytes
        "path:#000,M270 97c-11 1-41 13-17 12 14 19-36-18-18 4 15 3 37 7 8 4 19 8 70 22 42 49-24-1-1-34-30-34-22-9-48-3-63-31-26 26 36 34 40 46-16 13-58-29-40 6 8 14 60-3 31 16-12 13-45-21-33 7 8 20 62-14 36 11-9 15-54-7-33 16 16 4 58-20 27 5-8 11-49 2-25 21 14 4 54-32 32-1-5 20-59 6-32 25 17 8 54-42 35-7-5 22-45 12-40 29 27 24 45-38 62-28 4 13-36 30-6 26 11-3 22-47 22-17-19 16 4 18 10-1 16-20 1 29-15 26-38-4-11 15-11 15-18 8-37 8-49-9-36-2 18 15 9 19-13 1-25-12-35 3 11 1 57-1 26 5-12-2-16 30-6 12 15-4 30-23 45-4 22 11 9-12-7-11-6-5 31-14 38-3 4-14 37-54 32-17-4 21-30 24-41 31 7 19 42-16 25 9-8 5-32 12-9 15 12-8 29-17 15 4-27 1-3 24 6 5 12-25 13 13-2 16 10 14 25 46 23 13l18-204c-10-16-17-35-32-48 17-4-27-12-1-10-6-8-21-10-4-17-12 0-22-6-33-8zm1 9c22 8-21 6 0 0z,s;" +
        // Full detail 700 GZb
        //+ "path:#000,M270 97c-5 0-13 2-13 5-13-2-15 4-14 9l4-4 6 2 5 4h-12l-6-2-5-5c-3-3-6-2-5 2 2 5 6 7 11 7l9 1h10c-1 1-3 3-6 3-3 1-8-2-11-2 1 2 4 4 10 6 10 2 18 3 24 6 5 3 9 7 11 10 5 6 5 10 5 11 1 10-2 15-8 16-3 1-8 0-10-3-2-2-4-6-3-12 0-2 3-9 1-10l-34-16c-3-1-5 3-6 4-16-2-30-13-37-24-4-8-12 0-11 7 2 8 9 14 16 19 8 4 18 8 28 8 5 1 5 8-1 9-13 1-23 0-32-9-7-7-11 1-9 6 3 13 23 17 42 13 8-1 4 7 1 7-8 6-23 11-36 0-6-5-10-1-7 6 5 17 27 13 43 5 3-2 7 3 2 6-19 14-28 14-36 9-11-5-12 7-6 11 7 4 25 1 38-7 6-4 6 2 3 5-16 13-22 17-38 15-8-1-8 9-2 13 9 5 26-4 39-15 5-2 6 2 3 8-8 10-15 16-22 19-8 3-15 2-19 0-6-2-7 5-4 10 2 4 10 5 19 2s19-11 25-20c6-5 5 2 3 7-13 21-25 28-41 27-7-1-9 4-4 9 7 7 17 7 26 0 8-7 22-23 30-32 5-4 7 0 6 9-2 5-6 11-15 14-7 4-2 10 3 10 3 0 8-4 13-8 5-7 6-11 9-21 3-5 8-3 8 2-2 10-5 12-10 16-5 5 4 6 6 5 9-6 12-13 14-19 2-5 8-3 5 5-6 18-16 25-34 29-2 0-3 1-3 3l8 7-32 9-15-10c-2-4-2-9-11-5-5-3-8-2-11 1 5 0 7 1 8 3 3 6 8 6 13 5l9 8-17-1c-7-6-11-6-16-1-3 1-5 1-7 5 4-2 6-2 8 0 6 3 10 3 14 0l18 1-8 5c-9-3-14 1-16 8-1 3-2 7-1 10 1-3 2-6 5-7 8 2 11-2 12-7l14-7 12 4c2 5 5 7 12 6 7 0 6 3 6 6 2-4 2-7-2-10-2-5-6-7-10-4-5-2-6-4-11-5 12-4 20-4 31-8l8 7h4c7-10 11-20 17-26 3-3 6-7 10-8l5 1 2 9c-1 6-2 8-4 11l-6 9c-4 6-10 9-13 11-6 4-9 2-14 2-7 1-9 4-3 9 5 2 9 3 13 2l10-7c3-4 7 1 4 5-6 7-12 12-20 12-8 1-6 5-1 7 10 4 18-3 23-8 3-4 5-4 5 2-4 10-8 14-16 15-6-1-6 4-1 7 10 7 17-5 20-12s7-3 7 2c0 7-3 13-12 20l21 32 20-223-20-35-11-12v-1l5-1c-5-4-8-6-16-8l9-1c-2-3-7-8-14-10l10-7-20-4-13-4zm1 9c4 0 6 1 6 3s-2 3-6 3-7-2-7-3c0-2 3-3 7-3z,s;"//highdetail

        "use:-640,0,-1 1", //end cty

      am: "country:Armenia;stripes:#d90012|#0033a0|#f2a800", //end cty
      ao: "country:Angola;stripes:#cc092f|#000;pathstroke:m318 227-20-15-21 14 8-23-20-15h24l9-22 8 23 24-1-19 15m14-79-5 13-20-4-1 15c165 43 59 256-72 167l-8 14 17 11-6 13 21 10 7-14 19 4v14h24v-13l19-4 6 12 22-9-6-12 17-11 10 9 16-17-10-9c5-5 9-11 12-17l12 5 9-22-12-5c2-6 3-13 3-19h14v-24h-14c0-7-2-13-4-20l13-5-8-22-13 5-11-17 9-9-17-17-9 9-16-10 5-13,#ffcb00;pathstroke:m406 346l-10 19 4 1c14 4 20 9 26 17 3 3 7 3 10 1l7-5c3-5 2-8-2-11zm-11 18c-31-23-179-71-137-125 35 43 102 78 146 107,#ffcb00,5,#000", //end cty
      aq:
        "country:Antarctica;bgcolor:#072b5f;" +
        "<defs><g id='c' fill='none'>" +
        ";circle:134,134,50;circle:134,134,93;circle:134,134,133" +
        ";path:#000,M-100 134h467M134-100v467,s" +
        ";use:0,0,1,30 133 133" + //+ ";<use transform='rotate(30 134 133)' href='#s'/>"
        ";use:0,0,1,60 133 133;" + //+ "<use transform='rotate(60 133 133)' href='#s'/>"
        "</g>" +
        "<clipPath id='d'>" +
        ";path:#fff,M164 220c-12 7-21-12-10-18 2-13-15-11-24-14-13-2-27 3-40-2-10-2-23-8-23-19 0-9-1-19-11-16-10-6 3-19 1-28 1-6 2-14-6-12-13 0-2-16-13-20-5-4-11-19-3-18 2 9 11 9 18 14 9 6 18 15 30 12 14-1 23-13 22-26 2-13 11-24 23-29 12-2 24 1 36 3 11 5 19 14 31 15 9 3 21 3 28 11 1 13 4 25 4 38 3 8 22 10 13 22 0 10 10 20-1 28-4 12-10 21-16 31-7 10-11 21-24 24-11 2-22 7-33 5,b" +
        ";</clipPath>" +
        "</defs>" +
        "<g transform='scale(1.8) translate(45)'>" +
        "<use width='267' height='267' href='#b'/>" +
        ";path:#072b5f,h267v267z" +
        ";<use width='267' height='267' href='#c' stroke-width='3' stroke='#fff'/>" +
        "<use width='267' height='267' href='#c' stroke-width='3' stroke='#072b5f' clip-path='url(#d)'/>" +
        "</g>", //end cty

      //starrotate 18
      //sun:
      ar: "country:Argentina;stripes:#75aadb|#fff|#75aadb;rotate:18,<path fill='#fcbf49' stroke='#843511' d='M0 0l28 62s.5 1 1.3.9c.8-.4.3-1.5.3-1l-24-64m-1 24c-1 9 5 15 5 23-1 8 4 13 5 16 1 3-1 5-.3 6s3-2 2-7c-.7-5-4-6-3-16.3.8-10-4-13-3-22'/>;circle:320,240,20,#fcbf49", //end cty

      //todo detailM face in sun uruguay
      // uy: "country:Uruguay;detail:80;stripes:#fff|#0038a8|#fff|#0038a8|#fff|#0038a8|#fff|#0038a8|#fff;rect:0,0,266,266,#fff;rotate:16,<path fill='#fcd116' d='m0 28l-95-28l95-28' stroke-width='2' stroke='#000'/>,130,135;circle:130,135,40,#fcd116",//end cty
      uy: "country:Uruguay;detail:80;stripes:#fff|#0038a8|#fff|#0038a8|#fff|#0038a8|#fff|#0038a8|#fff;rect:0,0,266,266,#fff;rotate:16,<path fill='#fcbf49' stroke='#843511' d='M0 0l28 62s.5 1 1.3.9c.8-.4.3-1.5.3-1l-24-64m-1 24c-1 9 5 15 5 23-1 8 4 13 5 16 1 3-1 5-.3 6s3-2 2-7c-.7-5-4-6-3-16.3.8-10-4-13-3-22'/>,130,135,1.3;circle:130,135,30,#fcd116", //end cty

      as: "country:American Samoa;detail:40;bgcolor:#002b7f;pathstroke:m660 10v470L30 240z,#fff,25,#ce1126", //end cty
      at: "country:Austria;stripes:#ed2939|#fff|#ed2939", //end cty

      //todo star7 fat
      au: "country:Australia;bgcolor:#012169;gb;path:#fff,m0 0-18 1 2 18-12-13-12 13 2-18-18-1 15-9-10-15 17 6 5-17 5 17 17-6-10 15,s;use:110,185,2;use:500,80;use:500,390;use:410,210;use:590,190;use:1050,500,.5", //end cty

      //todo star 4 points
      aw: "country:Aruba;bgcolor:#418fd1;pathstroke:M60 130l79-20l20-79l20 79l79 20l-79 20l-20 79l-20-79z,#ef3340,5,#fff;stripe:270,30,#ffd100;stripe:330,30,#ffd100", //end cty

      ax: "country:Alland_Islands;bgcolor:#0053a5;doublecross:-80,0,#ffce00,#d21034,130,50", //end cty

      //starrotate 8
      az:
        "country:Azerbaijan;stripes:#00b9e4|#ed2939|#3f9c35;" +
        "circle:304,240,72,#fff;circle:320,240,60,#ed2939;" + //crescent az=azerbijdjan
        "rotate:8,<path fill='#fff' d='m0 3l-10-3l10-3'/>,370,240,3", //sun with 8 spikes //end cty
      ba: "country:Bosnia and Herzogovina;bgcolor:#002395;pathstroke:m130 0l480 480v-480,#fecb00;star:#fff,10,-20,3;use:30,0,3;use:50,20,3;use:70,40,3;use:90,60,3;use:110,80,3;use:130,100,3;use:150,120,3;use:170,140,3", //end cty
      bb: "country:Barbados;bars:#00267f|#ffc726|#00267f;path:#000,m320 135c-7 19-14 39-29 54 5-2 13-3 18-3v80h-22c-1 0-1-1-1-3-2-25-8-45-15-67 0-3-9-14-2-12 1 0 9 3 8 2a85 85 0 0 0-46-24c-1 0-2 1-1 2 22 35 41 75 41 124 9 0 30-5 39-5v56h10l2-157,a;<use transform='matrix(-1 0 0 1 640 0)' href='#a'/>", //end cty
      bd: "country:Bangladesh;bgcolor:#006a4e;circle:280,240,150,#f42a41", //end cty
      be: "country:Belgium;bars:#000|#fae042|#ed2939", //end cty
      bf: "country:Burkina Faso;stripes:#ef2b2d|#009e49;star:#fcd116,35,13,7", //end cty
      bg: "country:Bulgaria;stripes:#fff|#00966e|#d62612", //end cty

      bh: "country:Bahrein;bgcolor:#ce1126;path:#fff,m114 480l-146 1V0h180l94 48-99 48 99 48-99 48 99 48-99 48 99 48-99 48 99 48-99 48 99", //end cty
      bi: "country:Burundi;bgcolor:#ce1126;pathstroke:M-70 0L710 480h70v-480h-70L-70 480,#1eb53a,70,#fff;circle:320,240,140,#fff;path:#ce1126,M350 180l-19.2.4-10 16-10-16-19-0 9-17-9-17 19-0 10-16 10 16 19.2.4-9 17zm-65 112,s,4,#1eb53a;use:-60,110;use:60,110", //end cty
      bj: "country:Benin;stripes:#fcd116|#e8112d;bar:0,260,#008751", //end cty
      bl: "country:Saint Barthelemy;flag:fr", //end cty

      //todo detail shield
      bm: "country:Bermuda;detail:40;gb:#d00c27;shield", //end cty

      //todo detailH red cresent and hands and yellow text
      bn: "country:Brunei;detail:60;bgcolor:#f7e017;line:100,#fff,-50,70,690,315;line:100,#000,-50,165,690,410", //end cty

      // !todo high detaul where has it gone!!
      bo: "country:Bolivia;detail:40;stripes:#d52b1e|#f9e300|#007934", //end cty
      bq: "country:Bonaire;bgcolor:;triangle:0,480,640,0,640,480,#012a87;triangle:0,0,0,225,300,0,#f9d90f;circle:165,230,80,none,14,#000;rotate:6,<path fill='#dc171d' d='M30 0 0 50-30 0'/>,165,230;rotate:4,<path fill='#000' d='M20 80 0 110-20 80'/>,165,230", //end cty

      //brazil colors wikipedia:green:#009c3b yellow:#ffdf00 blue:#002776 white
      br: "country:Brazil;bgcolor:#009b3a;pathstroke:M20 240l300-200l300 200l-300 200,#fedf00;circle:320,240,120,#002776;path:none,m200 200q150-20 240 80,c,20,#fff;<text dx='10' dy='5' fill='green' letter-spacing='3' font-family='Arial' font-weight='bold'><textPath alignment-baseline='top' href='#c'>ORDEM E PROGRESSO</textPath></text>;path:#fff,M4 2l1 4h4l-3 2 1 4-3-2-3 2 1-4-3-2h4,s;use:220,205;use:274,247;use:220,289;use:238,275;use:256,289;use:274,317;use:310,261;use:310,303;use:292,275;use:328,275;use:301,282;use:346,191;use:382,275;use:382,289;use:400,289;use:364,303;use:364,317'/>;use:346,317", //end cty
      bs: "country:Bahamas;striangle:#00778b|#ffc72c|#00778b", //end cty

      //todo detail white dragon
      bt: "country:Bhutan;detail:40;bgcolor:#ffd520;triangle:0,480,640,480,640,0,#ff4e12", //end cty

      bw: "country:Botswana;bgcolor:#75aadb;rect:-20,185,680,100,#000,20,#fff", //end cty

      //colors: #ce1720 , #007c30 - wikipedia    brighter red/green
      //colors: #c8313e , #4aa657 - flag colors  pale red/green
      by:
        "country:Belarus;detail:900;bgcolor:#c8313e;stripe:300,300,#4aa657;" +
        //white bar
        "bar:0,120;" +
        //pattern , re-used 3 times
        //SVG because there is a transform on it
        "<path fill='#c8313e' id='s' d='" +
        //!! original detail, app 530 bytes
        //+ "m565 0v163h-44v-163zm-562 285h79v-65h40v-79h56v-69h46v-72h139v72h45v69h56v79h40v65h61v101h-61v65h-40v79h-56v69h-45v74h-32v62h-75v-62h-32v-74h-46v-69h-56v-79h-40v-65h-79m0-352h79v90h-79m310 27h-41v61h-39v77h-38v95h38v77h39v60h41v-60h39v-77h39v-95h-39v-77h-39zm4 139v90h-49v-90zm-314 236h79v97h-79m562-88v137h-44v-137zm-108 152v68h48v70h60v92h-60v71h-48v68h-56v-68h-48v-71h-40v-92h40v-70h48v-68zm-454 138h79v-70h48v-68h55v68h48v70h40v92h-40v71h-48v68h-55v-68h-48v-71h-79m447-90h-41v87h41zm-271 0h-41v87h41zm16 1441v-47h-34v-71h-45v-43h-34v-69h-79v-160h79v46h34v67h45v80h64v-72h47v-53h34v-63h45v-67h33v-68h32v-70h43v-94h-57v-85h-62v-51h-104v74h60v67h-40v82h-47v72h-59v-72h-49v-82h-30v-67h-68v-127h79v-82h30v-63h28v-72h40v-71h39v-47h47v-71h57v71h47v47h40v71h39v72h32v62h32v54h52v397h-59v67h-17v70h-44v68h-27v50h-28v53h-48v52h-69v145m292-1213v137h-44v-137zm-562 26h79v97h-79m0 486h79v97h-79zm560 246v88h-42v-88zm-58 358v-55h-26v-43h-38v-129h38v52h40v76h44v98m-214 0v-64h42v64"//highdetail

        //!! patchwork with NO pixelated lines -390pixels savebytes scale to 10% in InkScape
        "m572 0v150h-22v-150zm-562 285 221-285h139l202 285v101l-234 349h-75l-253-349m310-235h-41l-77 138v95l77 137h41l78-137v-95zm4 139v90h-49v-90zm248 260 2 100h-24v-100zm-108 137 86 113-3 131-83 125h-56l-88-139v-92l88-138zm-414 113 87-113h55l88 138v92l-88 139h-55l-87-156m407-73h-41v87h41zm-271 0h-41v87h41zm16 1441c-64-130-128-260-192-390h79l143 193 234-393v-94l-66-134-157-2 57 152-84 143h-59l-147-221v-127l263-406h57l242 377v397l-292 505m296-1218-2 150h-24v-150zm-6 860v88h-42v-88zm-58 358-64-98v-129l122 226" +
        "' transform='scale(.106)'/>" +
        ";use:0,-480,1 -1;" + //bottom left
        ";use:-120,0,-1 1;" + //top right
        ";use:-120,-480,-1 -1", //bottom righ //end cty

      //todo>0 detail when more abstract circle/rotation
      //take leave and rotate
      bz: "country:Belize;detail:40;bgcolor:#ce1126;stripe:40,400,#003f87;circle:320,240,150,#fff;circle:320,240,120,#fff,10,green", //end cty

      // colors with 4 bars: adds 5 GZb
      ca: "country:Canada;bgcolor:#f00;bar:160,320;pathstroke:M200 250l-13 5 63 57c4 15-2 19-6 27l68-9-2 71 15-1-4-70 69 8c-4-9-8-14-4-28l63-55-11-4c-9-7 3-34 5-52 0 0-36 13-39 7l-9-19-33 38c-4 1-6-1-6-4l15-79-24 14c-2 1-5 0-6-2l-23-49-25 51c-1 2-3 2-5 1l-23-14 14 79c-1 3-4 4-7 2l-32-38c-4 7-7 19-12 21-6 3-24-5-37-7 4 15 18 42 9 50,#f00", //end cty

      cc:
        "country:Cocos Islands;detail:80;bgcolor:#008000;" +
        "circle:130,140,80,#ffe000;pathstroke:M120 203h18c-7-7 2-60-1-60-1 22-6 41-17 60,#802000,2,#7b3100;circle:320,240,67,#ffe000;circle:341,240,55,#008000;" +
        // cc green tree leaves - savebytes
        "pathstroke:M133 95c4 9-11 31-8 22-3-5-8-9-13-11-21 1 0 9-1 12-5 0-9-5-13-3-21 7 4 7 6 10 3 5-4 6-8 5-9-1-20 11-17 14 8-2 22-2 28-4 4-1 12-5 11 2-3 7-9 26 1 22 4-2 4-8 5-12-1-3 2-10 3-5-1 5-5 12 2 13 6 1 7-7 5-11 4-14 15 3 19 9 2 5 11 3 11-3-5-21-15-15 10-13 4-5-1-12-6-12-9 0-5-21-16-12-13 11-3-7 1-12-2-4-8-16-13-9-3 2-5 0-7-2,#008000;" +
        "scross:#ffe000,370,-50,1.1", //end cty

      cd: "country:Democratic Republic of Congo;bgcolor:#007fff;star:#f7d618,5,-5,8;line:110,#f7d618,-60,480,700,0;line:75,#ce1021,-60,480,700,0", //end cty
      cf: "country:Central African Republic;stripes:#003082|#fff|#289728|#ffce00;bar:260,120,#d21034;star:#ffce00,5,-5,4", //end cty
      cg: "country:Congo;bgcolor:#009543;triangle:0,480,640,480,640,-200,#fbde4a;triangle:200,480,640,480,640,0,#dc241f", //end cty
      ch: "country:Switzerland;bgcolor:#d52b1e;cross:#fff,320,240,300,100", //end cty
      ci: "country:Ivory Coast;bars:#f77f00|#fff|#009e60", //end cty

      //starrotate 16
      ck: "country:Cook Islands;detail:80;gb;rotate:16,<path fill='#fff' d='m60 8l3 9h9l-7 5 3 8.7-7-5-7 5 3-9-7-5h9'/>,470,260,1.9", //end cty
      cl: "country:Chile;bgcolor:;bar:0,240,#0039a6;stripe:240,240,#d52b1e;star:#fff,8,0,6", //end cty
      cm: "country:Cameroon;bars:#007a5e|#ce1126|#fcd116;star:#fcd116,42,18,6", //end cty
      cn: "country:China;bgcolor:#de2910;star:#ffde00,5,2,6;use:140,30,2,30;use:120,75,2;use:120,35,2;use:100,-50,2,30", //end cty
      co: "country:Colombia;stripes:#fcd116|#fcd116|#003893|#ce1126", //end cty
      cr: "country:Costa Rica;stripes:#002b7f|#fff|#ce1126|#ce1126|#fff|#002b7f", //end cty
      cu: "country:Cuba;striangle:#002a8f|#fff|#002a8f|#fff|#002a8f,#cf142b,400;star:#fff,10,22,5.5", //end cty

      cv:
        "country:Cabo Verde;stripes:#003893|#003893|#fff|#003893;stripe:280,40,#cf2027;" +
        //10 stars todo: create with rotate
        "star:#f7d116,140,70,2;use:180,80,2;use:200,110,2;use:200,150,2;use:180,170,2;use:140,190,2;use:100,170,2;use:80,150,2;use:80,110,2;use:100,80,2", //end cty
      cw: "country:Curacao;bgcolor:#002680;stripe:320,60,#f9e90d;star:#fff,10,3,4;use:30,10,5", //end cty

      //todo path with green landscape and yellow bird
      cx: "country:Christmas Island;detail:40;bgcolor:#1c8a42;triangle:0,0,640,480,0,480,#0021ad;circle:320,240,80,#ffc639;scross:#fff", //end cty

      cy: "country:Cyprus;detail:80;bgcolor:;#fff;path:#d47600,m519 76c-51 18-94 52-148 62-35 9-73 13-108 1-22-4-23 24-31 37-15 13-35-5-52 4l-48 32c-4 16 11 31 18 44 14 18 38 27 59 21 16 3 36 22 48 3 15-14 36-11 54-15 21-6 42-19 52-40 12-13 31-2 46-4 22-3 10-28-2-36-12-19 11-37 27-44a1770 1770 0 0 0 85-65;path:#435125,m308 399c-5-1-11-9-8-14 8-6 16 10 8 14zm-43-13c-9 3-9-15 0-13 8-1 11 16 1 13zm-23-5c-7-1 0-5 2-1h-1zm41-5c-8 3-18-4-19-12 4-6 12-2 15 3 2 3 2 7 4 9zm-28-3c-8 6-10-13-2-10 4 0 10 11 2 10zm-29-1c-8 7-15-12-4-12 6 0 14 11 4 12zm-20-10c-6-1 3-4 1-1zm46-1c-6-1 4-3 0 0zm-22-1c-7 3-17-1-19-9 7-7 14 5 19 9zm13-2c-8 4-18-4-16-12 8-4 14 6 16 12zm-52-5c-9 6-12-14-1-11 5 1 11 14 1 11zm24-8c-6-1 6-4 0 0zm-18-3c-8 3-17-7-14-15 9-1 11 9 14 15zm12 0c-8-1-15-9-15-17 9-3 13 8 14 15v1zm-30-1c-7 0 5-4 0 0zm-9-11c-7 8-15-12-4-10 4 1 8 6 4 10zm11-11c-8 3-2-15 1-6l-1 6zm-8 0c-10 2-18-8-18-17 4-7 14-1 16 5l2 12,a;<use transform='matrix(-1 0 0 1 594 0)' href='#a'/>", //end cty
      cz: "country:Czech Republic;striangle:#fff|#d7141a,#11457e,320", //end cty
      de: "country:Germany;stripes:0|#d00|#ffce00", //end cty
      dj: "country:Djibouti;striangle:#6ab2e7|#12ad2b,#fff,400;star:#d7141a,18,27,5", //end cty
      dk: "country:Denmark;bgcolor:#c60c30;doublecross:-80,0,#fff,#fff,70", //end cty

      //todo detail parrot
      dm: "country:Dominica;detail:60;bgcolor:#006b3f;doublecross:0,0,#fcd116,#000,80;stripe:260,20,#fff;bar:340,20;circle:320,240,100,#d41c30;rotate:10,<path fill='#006b3f' d='m60 8l3 9h9l-7 5 3 8.7-7-5-7 5 3-9-7-5h9'/>,320,240,1.1", //end cty

      //todo detail shield and banner
      do: "country:Dominican Republic;detail:80;bgcolor:#002d62;pathstroke:M320 240h-320v240h320v-480h320v240,#ce1126;cross:#fff,320,240,640,80", //end cty

      dz: "country:Algeria;bgcolor:#006233;bar:320,320;pathstroke:M424 180a120 120 0 1 0 0 120 96 96 0 1 1 0-120m4 60l-108-35 67 92V183l-67 92,#d21034", //end cty

      //todo detailH banners and eagle and spears
      ec: "country:Ecuador;detail:60;stripes:#fd0|#fd0|#034ea2|#ed1c24", //end cty

      ee: "country:Estonia;stripes:#0072ce||#fff", //end cty

      //todo detailH golden eagle on white bar
      eg: "country:Egypt;detail:60;stripes:#ce1126|#fff|#000", //end cty

      eh: "country:Western Sahara;striangle:|#fff|#107b00,#c4111b;circle:400,240,70,#c4111b;circle:420,240,69,#fff;star:#c4111b,90,40,4", //end cty

      //todo detailM gold leaves with yellow ellipse :#ffc726
      er: "country:Eritrea;detail:60;striangle:#12ad2b|#4189dd,#ea0437,640", //end cty

      es:
        "country:Spain;detail:900;stripes:#c60b1e|#ffc400|#ffc400|#c60b1e;" +
        "crown:0;" +
        // <!-- start left pillar -->
        "<g id='l'>;" +
        // <!-- gold in pillar -->
        "pathstroke:M124 223h21v-5h-21v5m2 4a1 1 0 0 1 1 0h16a1 1 0 0 1-1-1l1-2a2 2 0 0 1 0 0h-16a1 1 0 0 1-1 0l1 2a1 1 0 0 1-1 1m1 0h16l1 1h-18l1-1m0-4h16l1 1h-18l1-1m-1 85v1l-2 2h22a3 3 0 0 1-3-2v-1a1 1 0 0 1 0 0h-16a1 1 0 0 1-1 0m1-1h17l-1 1h-16l-1-1 1-1m-3 11h22v-6h-22v6,#f1bf00,.4,#000;" +
        // <!-- waves --> // todo waves in other flags
        "rect:120,318,30,9,#ccc;" +
        "path:#0039f0,M149 322a7 7 0 01-4-.8 8 8 0 00-4-.7c-1 0-2.7.2-3.7.7-1 .6-2.3.9-3.8.9s-2.8-.4-3.7-.9a8 8 0 00-3.7-1 8 8 0 00-3.7.8c-1 .5-2.3.9-3.8.9v2.3c1 0 3-.3 4-1a10 10 0 017 0 7 7 0 003.7.9 8 8 0 004-.8c1-.5 2-1 4-1 2 0 2.8.3 3.8.8s2.2.8 3.7.8,w,.4,#000;" + // #wave
        //+ "use:0,-5,1,0,w;use:0,5,1,0,w;"
        "<use href='#w' x='0' y='-5'/><use href='#w' x='0' y='5'/>;" + // use href 10 GZb shorter because GZ sees repeat pattern! <use href='#w' x='0' y='
        // <!-- white pillar -->
        "pathstroke:M138 229v76m1.7-76v76m-13 0h16v-76h-16v77,#ccc,.4,#000;" +
        // <!-- red banner -->
        // + "pathstroke:M158 258a50 50 0 00-23-2c-9 1.6-16.5 5-16 8v.2l-3.5-8c-.6-3 7-7.5 17.6-9a43 43 0 019-.7c6.6 0 12.4.8 16 2v9.4M127 267c-4-.3-7-1.4-7.6-3-.3-1.5 1.2-3 4-4.5 1.2.1 2.5.3 3.8.3v7M142 261.5c2.7.4 4.7 1 6 2l.1.2c.5 1-2 3-6 5.4v-7.5M117 282c-.4-1 4-3.6 10-6l8-3c8-3.7 14.4-8 13.6-9.4v-.2c.4.4 1 8 1 8 1 1-5 5.5-12.4 9.1-2.5 1-7.6 3-10 4-4.4 1.4-8.7 4-8 5l-1.5-7.7M122 286.7c-2 1-3.7 2.5-3.4 3 0 .6.8 1 2 1.6 1.5 1.1 2.5 3 1.7 4a5.5 5.5 0 00-.1-9,#aa151b,.4,#000;"
        "pathstroke:m158 258c-7-2-26-7-39 6v0l-3-8c-1-3 7-7 18-9 15-2 21 0 25 1v9m-31 9c-4 0-7-1-8-3 0-1-4-8 7-4m15 2c3 0 5 1 6 2l0 0c1 1-2 3-6 5v-7m-25 20c0-1 5-4 10-6 0 0 11-3 22-12l1 8c1 1-8 6-12 9-12 3-19 8-18 9l-1-8m4 5c-2 1-4 3-3 3 0 1 5 1 4 7 3-2 3-8 0-10,#aa151b,.4,#000;" +
        // <!-- yellow text PLVS -->
        //"path:#f1bf00,M125.8 254c1.9-.6 3.1-1.5 2.5-3-.4-1-1.4-1-2.8-.6l-2.6 1 2.3 5.8.8-.3.8-.3-1-2.5m-1.2-2.7l.7-.3c.5-.2 1.2.1 1.4.8.2.5.2 1-.5 1.5a4.4 4.4 0 01-.6.3l-1-2.3m7.3-2.5l-.9.3h-.8l1.3 6.1 4.3-.8-.2-.4v-.4l-2.5.6-1.2-5.3m8.4 5.2c.8-2.2 1.7-4.3 2.7-6.4a5.3 5.3 0 01-1 0 54.8 54.8 0 01-1.8 4.6l-2.4-4.3-1 .1h-1a131.4 131.4 0 013.5 6h1m8.8-4.7l.4-.9a3.4 3.4 0 00-1.7-.6c-1.7-.1-2.7.6-2.8 1.7-.2 2.1 3.2 2 3 3.4 0 .6-.7.9-1.4.8-.8 0-1.4-.5-1.4-1.2h-.3a7.3 7.3 0 01-.4 1.1 4 4 0 001.8.6c1.7.2 3-.5 3.2-1.7.2-2-3.3-2.1-3.1-3.4 0-.5.4-.8 1.3-.7.7 0 1 .4 1.2.9h.2;" +

        // <!-- crown on pillar -->
        "use:330,650,.25,0,c;" + //"<use transform='scale(.25)' href='#c' x='330' y='650'/>"
        "</g>;" + //end pillar
        // <!-- right pillar -->
        "use:-413,0,-1 1,0,l;" + //"<use transform='scale(-1 1)' href='#l' x='-413'/>;"
        // removedtext
        // 'text:{"fill":"#f1bf00","font":"Arial","size":6,"y":254,"str":"PLVS","x":137};' +
        // 'text:{"fill":"#f1bf00","font":"Arial","size":6,"y":254,"str":"ULTRA","x":278};' +

        //   <!-- big shield outline -->
        //+ "pathstroke:M207 330.6a82 82 0 01-35.5-8 23 23 0 01-13-20v-32h96v32a23 23 0 01-13 20 81 81 0 01-35 8,#ccc,.5,#000;"
        "shield:#ccc,66,158,217,.5,#000;" +
        // <!-- SHIELD bottom-left shield red shield-->
        "shield:#aa151b,33,158,269,.5,#000;" +
        //+ "pathstroke:M207 302c0 13-10 23-24 23s-24-10-24-23v-32h48v32,#aa151b,.4,#000;"
        // <!-- bottom-left shield yellow stripes-->
        "pathstroke:m169 322 5 2v-53h-5v52m-11-20a24 24 0 0 0 6 15v-47h-6v33m21 22a27 27 0 0 0 6 0v-55h-6v56m11-2a19 19 0 0 0 6-3v-51h-6v55m11-9c2-2 5-7 5-12l1-34h-6v47,#f1bf00,.4,#000;" +
        // <!-- SHIELD start bottom-right red shield -->
        "shield:#aa151b,33,207,269,.5,#000;" +
        "<g id='shield'>;" +
        // pattern left half of yellow squares in red shield
        "pathstroke:m215 277h5v-2h5v4h-5v-2m5 0h5m-15 0v6h-2v5h4v-5h-2m0 5v6m0 3v3h-2v5h4v-5h-2m1-5h3v-2h5v4h-5v-2m5 0h5m1-18v6h-2v5h2v15h-2v5h2v10m-15-41 15 18m-15 17 15-17,none,1.5,#f1bf00;" +
        "circle:214,276,3,#f1bf00;circle:230,276,3,#f1bf00;circle:216,311,3,#f1bf00;circle:230,318,3,#f1bf00;" +
        "circle:214.5,295,2,none,1.5,#f1bf00;" +
        // <!-- should be rects -->
        // < !-- < circle fill='none' stroke='gold' stroke- width='1.5' cx = '223' cy = '286' r = '2' />
        //     <circle fill='none' stroke='gold' stroke-width='1.5' cx='223' cy='304' r='2' /> -->
        //         <circle fill='none' stroke='gold' stroke-width='1.5' cx='223' cy='316' r='2' />
        "</g>;" +
        "use:-460,0,-1 1,0,shield;" +
        //green circle in red shield
        "circle:230,295,4,#058e6e;" + // 6 GZ bytes
        // <!-- SHIELD  top-left shield: yellow castle (overlaps bottom-left sheild)-->
        "rect:158,217,48,54,#aa151b;" +
        //   <!-- my castle -->
        "castle;" +
        //   <!-- blue door 2 windows -->
        "pathstroke:M185 263v-4c0-1 0-3-3-3-2 0-3 2-3 3v4M179 250v-4c0-1 0-3-3-3-2 0-3 2-3 3v4M191 250v-4c0-1 0-3-3-3-2 0-3 2-3 3v4,#0039f0,.4,#000;" +
        // SHIELD pink lion
        //   <path fill='#ccc' stroke='#000' stroke-width='.4' d='M206.5 270h48v-54h-48v54'/>
        //+ "rect:207,217,49,54,#ccc;"
        // tongue
        "path:#db4446,M231 230v-1h0-2a6 6 0 01-3-2l-1-1-3 1 2 1 2 1 3 1h2;" +
        // <!--pink lion  -->
        "pathstroke:M238 228v3l1 1h-1l-1-1 1 2 1 2v1l-2-1 1 1-1 2-1-2v4l-1-1-1-1 2 6c1 1 3 4 6 3s2-5 1-7l-1-4 1-4v-3l1-2v-3l1 3 3-3-2 4h2l-1 1-1 3-2 1v5l2 5c0 1 0 3-2 5l-3 1c-1 0-2 1-2 3l3 3 1 1-2 2v5h-2v-1h-1v1l-1-1h-1l1-1s1 0 0 0l-1-1v-1h2l1-1-2-2v1h-2l-1-1v-4h-3v3l1 2-2 1-1-1-3 1h-2v-1h-1l-1-1v-1h2v-1l-1-1h1l1-1v2h4l-1-1v-2h-1v2l-1-2 3-4h4l-5-4-2-1-2 2v-2l-1 2-1 1v-2l-1 1h-2v2h-2v-2 1l-1-1v-1h1l-1-1v-1l1-1 1 1h2l2-1 1-1-1-1-1-1h-2l-1-1v-1h-2l1-1h1l-1-1-1-1h-1l-1-1v-1h2l-2-1 2-2 1 2v-2h2l-1 3 5 3 1 1 5-2-1-1h1l2-1-3-3v-1l1-1h2l1-1h1l3 1 2 3,#ed72aa,.2,#000;" +
        // <!-- eye -->
        "pathstroke:M232 225h1l1 1h-1;" +
        // <!-- body stripes -->
        "pathstroke:M237 231a8 8 0 010-1m-9 1v-1l1 1h-1m1 0v-1l1 1h-1m0-4v1v-1m1 1h0-1m-5 6h-1v1h4l-1 1v3h1a5 5 0 001-1l1-1v1l1 2v-1h1l1-1v1l1 1v-1l1-1a4 4 0 000-1v1m-11 1l1-1 1-1h1m1 5l1-1a4 4 0 002-1,none,.2,#000;" +
        // <!-- claws -->
        "pathstroke:M217 227h2v-1l-1-1v1a2 2 0 01-1 1m-2 1l-1-1-2 1h2v1l1-1a7 7 0 000 0m-1 3h-1v1h2l-1-1m3 9h-2l-1 1h2l1-1m-1 3h-1l-1 2 1-1 1 1v-1-1m1 3v1l2 1-1-1 1-1h-2m16 1l2 2-1 3m-10 1l-1-1-1 1h2m-2 2l-1 1-1 1 1-1 1 1v-2m2 3v1l1 1v-1l1-1h-2m12 1h-1l-1 2 1-1h1v0-1m0 3v1l1 1v-1h1-1a16 16 0 01-1-1m3 1l1 1 1 1-1-1 1-1h-2,#db4446,.2,#000;" +
        // < !--start pink lion crown -- >
        "use:3010,280,.1,35,c;" + // -10 GZb "<use transform='scale(.1) rotate(35)' href='#c' x='3010' y='280'/>;"
        //   <!-- start bottom shield flower -->
        "circle:207,320,5,#ffd691,.4,#000;" +
        "pathstroke:M207 324a5 5 0 0 1 0-7 5 5 0 0 1 1 3 5 5 0 0 1-1 4,#aa151b,.4,#000;" +
        "pathstroke:M206 327l-5-3h-6l2 1 3 2h6m1 0l5-3 7 1h-2l-4 2h-7v-2h2v5h-2v-5,#058e6e,.4,#000;" +
        //  SHIELD <!-- shield-center Oval -->
        "<ellipse fill='#aa151b' stroke='#000' stroke-width='.6' cx='206.5' cy='270' rx='15' ry='18'/>" +
        "<ellipse fill='#005bbf' stroke='#000' stroke-width='.6' cx='206.5' cy='270' rx='11' ry='14'/>" +
        //   <!-- 3 yellow lilys -->
        ";path:#f1bf00,M201 261s-1 1-1 3a6 6 0 00.6 2c-.2-.5-1-1-1-1-1 0-1.4.6-1.4 1l.2.8.5.9c.1-.3.5-1 1-1s1 1 1 1a.9.9 0 010 1h-1v1h1l-1 1.5 1-.4.8.9.8-1 1 .4-.7-1h1v-1h-1.1a.9.9 0 010-.3 1 1 0 011-1c.4 0 .7.3 1 1l.4-1 .2-1a1 1 0 00-1-1c-1 0-1.2.3-1.4.9 0 0 .6-1.2.6-2.5s-1-3-1-3,f,.4,#000;" +
        "<use href='#f' x='10'/><use href='#f' x='5' y='9'/>;",
      //end cty spain
      et: "country:Ethiopia;stripes:#078930|#fcdd09|#da121a;circle:320,240,130,#0f47af;rotate:5,<line stroke-width='4' stroke='#fcdd09' x1='50' y1='15' x2='100' y2='30'/>,320,240;pathstroke:m321 146-56 172 145-105h-180l145 106z,#0f47af,8,#fcdd09", //end cty
      fi: "country:Finland;bgcolor:;doublecross:-80,0,#002f6c,#002f6c,120", //end cty

      fj: "country:Fiji;detail:40;gb:#68bfe5;shield:#ce1126", //end cty

      fk: "country:Falkland Islands;detail:40;gb;shield:#d3d3d3", //end cty
      fm: "country:Micronesia;bgcolor:#75b2dd;star:#fff,90,10,3;use:155,0,3,20;use:10,68,3,-20;use:145,20,3,37", //end cty
      fo: "country:Faroe Islands;bgcolor:;doublecross:-80,0,#0065bd,#ed2939,125,60", //end cty
      fr: "country:France;bars:#002395|#fff|#ed2939", //end cty
      ga: "country:Gabon;stripes:#009e60|#fcd116|#3a75c4", //end cty
      gb: "country:United Kingdom;gb:#00247d,1", //end cty

      //todo detailM add flower
      gd: "country:Grenada;bgcolor:#ce1126;rect:70,70,500,340,#fcd116;triangle:70,70,320,240,70,410,#007a5e;triangle:570,70,320,240,570,410,#007a5e;circle:320,240,58,#ce1126;star:#fcd116,80,0,2;use:145,0,2;use:205,0,2;use:80,200,2;use:145,200,2;use:205,200,2;use:68,40,4", //end cty

      ge: "country:Georgia;bgcolor:;cross:#f00,140,100,100;cross:#f00,500,100,100;cross:#f00,140,380,100;cross:#f00,500,380,100;doublecross:0,0,#f00", //end cty
      gf: "country:French Guiana;bgcolor:#078930;triangle:0,0,640,480,0,480,#fcdd09;star:#da121a,40,20,6", //end cty

      //path = yellow maltezer? cross
      //do not replace <path in rotate
      gg: "country:Guernsey;bgcolor:;doublecross:0,0,#e8112d;rotate:4,<path fill='#f9dd16' d='m-180 40 20-20h190v-40h-190l-20-20'/>", //end cty
      gh: "country:Ghana;stripes:#ce1126|#fcd116|#006b3f;star:#000,36,16,6.7", //end cty

      //todo gibraltar red castle and key detailM
      gi: "country:Gibraltar;detail:40;stripes:#fff|#fff|#da000c;rect:200,80,240,200,#da000c,1", //end cty

      gl: "country:Greenland;bgcolor:;path:#d00c33,m0 240h640v240h-640zm80 0a160 160 0 1 0 320 0 160 160 0 0 0-320 0", //end cty
      gm: "country:Gambia;stripes:#ce1126|#fff|#3a7728;stripe:190,100,#0c1c8c", //end cty
      gn: "country:Guinea;bars:#ce1126|#fcd116|#009460", //end cty
      gp: "country:Guadeloupe;flag:fr", //end cty

      //todo detail leaves
      gq: "country:Equatorial Guinea;detail:60;striangle:#3e9a00|#fff|#e32118,#0073ce,180", //end cty

      gr: "country:Greece;stripes:#0073ce|#fff|#0073ce|#fff|#0073ce|#fff|#0073ce|#fff|#0073ce;rect:0,0,240,240,#0073ce;line:53,#fff,120,0,120,270;line:53,#fff,0,135,240,135", //end cty
      gs: "country:South Georgia;detail:40;gb", //end cty

      //todo detail leaves from wikipedia
      gt: "country:Guatemala;detail:60;bgcolor:;bars:#4997d0|#fff|#4997d0", //end cty

      //todo detail palmtree
      gu: "country:Guam;detail:60;rect:0,0,640,480,#00257c,50,#c71b36;path:#008de8,m320 110q-170 120 0 260 170-140 0-260z,k,20,#c71b36", //end cty

      gw: "country:Guinea Bissau;stripes:#fcd116|#009e49;bar:0,240,#ce1126;star:#000,12,24,5", //end cty
      gy: "country:Guyana;striangle:#009e49|#009e49,#fff,600;triangle:0,20,560,240,0,460,#fcdd09;triangle:-16,0,300,240,-16,480,#ce1126,16,#000", //end cty
      //starrotate onestar copy
      hk: "country:Hong Kong;bgcolor:#de2408;rotate:5,<path fill='#fff' d='M0 0s-52-22-44-80c7-28 20-46.6 43-57 11-3 22-5 33-6-3 3-5 6-7 9-2 6-1 12 3 18 4 7 7 14 7 24a37 37 0 0 1-15 34c-7 5-14 7-21 13-5 5-8 9-9 18-0 16 4 18 9 27'/><path stroke='#de2408' d='M0 0c-20-18-18-62-3-77'/><path fill='#de2408' d='M0-105l3 9h9l-7.4 5.4 2.8 8.7-7.4-5.4-7.4 5.4 2.8-8.7-7.4-5.4h9.2'/>", //end cty
      hn: "country:Honduras;stripes:#0073cf|#fff|#0073cf;star:#0073cf,145,100,2;use:85,80,2;use:85,120,2;use:205,80,2;use:205,120,2", //end cty

      //feb 2020: detail crown & checkboard pattern
      hr:
        "country:Croatia;detail:900;stripes:#f00|#fff|#171796;" +
        // white shield, red outline
        "shield:#fff,120,230,160,3,#f00;" +
        //checkboard red/white
        "<pattern patternUnits='userSpaceOnUse' id='c' x='232' y='163' width='72' height='72'>" +
        //2 red squares
        ";rect:0,0,36,36,#f00;rect:36,36,72,72,#f00;" +
        "</pattern>;" +
        "pathstroke:m233 163h174v120c0 108-174 108-174 0,url(#c);" +
        //light blue crown
        "pathstroke:m410 159 22-49-17-27-28 10-19-22-25 15-23-20-23 19-25-15-19 22-28-10-17 27 22 49a218 218 0 0 1 90-19c32 0 62 7 90 19,#0093dd,2,#fff;" +
        //dark blue crowninset segment 2 and 4
        "pathstroke:m266 145-13-53 19-22 25 15 4 54z,#171796;" +
        "pathstroke:m341 140 2-54 25-15 19 22-10 53z,#171796;" +
        //segment 1 star and moon
        "circle:240,125,12,#fff;circle:239,122,12,#0093dd;" + //crescent km-Comoros
        //segment 1,3 and 5 stars
        "star:gold,278,110,.8;use:376,100,.8;use:402,100,.8;use:390,130,.8;use:497,110,.8;" +
        //segment 2
        "line:12,#f00,256,100,297,91;" +
        "line:12,#f00,261,126,300,118;" +
        //segment 4 yellow goat, todo: re-use dragon
        "rect:365,45,20,15,gold,1,#000,transform='rotate(10)';" +
        //segment 5 red/white line
        "rect:402,-20,38,10,#f00,2,#fff,transform='rotate(20)';" +
        "", //end cty

      //detail palmtree leaves
      ht: "country:Haiti;detail:80;stripes:#00209f|#d21034;rect:244,180,150,120,#fff", //end cty
      hu: "country:Hungary;stripes:#cd2a3e|#fff|#436f4d", //end cty
      id: "country:Indonesia;stripes:#f00|#fff", //end cty
      ie: "country:Ireland;bars:#169b62|#fff|#ff883e", //end cty
      il: "country:Israel;bgcolor:;stripe:45,70,#0038b8;stripe:360,70,#0038b8;pathstroke:m320 140 100 150-200 0zm0 200-100-150 200 0z,#fff,18,#0038b8", //end cty

      //3 legs
      im: "country:Isle of Man;detail:80;bgcolor:#d00c27;rotate:3,<path stroke='#000' fill='#fff' d='M-40-70l-74 29c-7-13-53-29-44-2 14 8 20 31 34 29 25-15 82-24 76 0 8 42 35 25 55 13-7-21-24-68-47-69' stroke-width='2'/>", //end cty

      //todo (low) recreate spike, pouint between circles
      // starrotate 24 spikes
      in: "country:India;stripes:#ff9933|#fff|#138808;circle:320,240,61,none,8,#000080;circle:320,240,12,#000080;rotate:24,<circle cx='40' cy='40' r='3' fill='#000080'/><path fill='#000080' d='m0 0 2-30-2-20-2 10 2 30'/>", //end cty

      //todo detailM add waves
      io: "country:British Indian Ocean Territory;detail:40;gb", //end cty

      iq:
        "country:Iraq;stripes:#ce1126|#fff|#000;" +
        "path:#007a3d," +
        //todo: simplify iraq path
        "M180 290l9-10 8 10-8 9zm-32-6l11 2 3-21-2-4 10-10 5 11 12 2-3-9 13-13 1 23h84v-34l-4-4-4 4v24h-70l58-81v15l-38 53h41v-16l16-12 14 12-1 50H177l-7 16-14 1zm153-84l11 14v48l18-3-3 17h-26zm76 46l14-3-1-12 13-16v47h10v-55l10-10v65h10v-65l-4-5 14-11v95h-71zm13 6l-8 10h10zm58-55l13 12v53l18-2-4 16h-27zm-54-4l15-6 7 3 3-6 2 1-2 9-11 1-11 2zm11-10l-7-9 2-2z" +
        // +"m180 290 9-10 8 10-8 9zm-32-6c3 2 9 2 11 2 8-2 10-14 3-21l-2-4 10-10 5 11c0 2 12 2 12 2l-3-9 13-13 1 23h84v-34l-4-4-4 4v24h-70c18-28 38-55 58-81 0 0 3 14 0 15l-38 53h41v-16l16-12 14 12v49h-117s-5 15-8 17-10 2-14 1zm155-86c0-1 14 13 12 13-3 2-3 51-3 51l16-2c3-2 3-2 2 2l-2 11h-27zm74 48c3-2 14-3 14-3l1-4c0-6-1-8-2-8-2-1 13-16 13-16v47h10l-1-49s-3-4-1-6l12-10v66h10v-66l-4-5 11-11c3-5 3-6 3 46v49h-71v-10s2-17 5-20zm13 6c-4 0-7 9-7 9h10zm61-55c1-1 14 13 13 13-3 2-3 51-3 54l18-4-4 14-27 1zm-54-2-3-2c-1-1 0-1 2-1 5 1 13-5 13-5l7 3 3-6c0-2 1-1 2 1 2 3 1 7-2 9h-6c-2-1-3-1-5 1s-7 3-11 2zm8-12c-2-1-5-7-6-9 0-2 1-2 2-2 2-1 6 12 4 11z"

        // +"M180 290l9-10 11 10-10 10zm-30-5c14-8 12-10 10-25l10-9 5 14h15l-5-10 10-15v25h87v-34l-4-4-4 4v24h-70l56-80v15l-35 55h40v-19l16-12 14 12v49H175c-6 14-5 17-20 20zm150-85l10 15v50h20v10h-30zm90 45v-14l13-16v47h10v-55l10-10v65h10v-65l-4-5 11-12v95h-70c0-15 5-30 20-30zm0 7l-8 10h10zm60-57l10 15v55h15v10h-25zm-56-2c11 2 10-4 15-6 4-1-4 8 12-2l-2 9-22 3zm11-10l-7-9 2-2z",//end cty
        "", //end cty

      ir:
        "country:Iran;detail:40;stripes:#239f40|#fff|#da0000;" +
        // define arabic writing in green/red stroke as pattern
        //todo Iran better transformscale,.4 is a bit to small compared to original
        "<defs><pattern patternUnits='userSpaceOnUse' patternTransform='scale(.4 .4)' id='p' width='100' height='40'>" +
        "<path fill='none' stroke='#fff' stroke-width='6' d='M0 6h64m28-3v24h-10v-24v24h-10v-24v12h-20v12h12m-60 0v-12h20v12h18v-12h-12M11 24h6M0 36h46m3 0h46'/>" +
        "</pattern></defs>;" +
        // draw rectangle with pattern
        "<rect fill='url(#p)' y='144' width='640' height='188'/>;" +
        // inner symbol
        "path:#da0000,M304 170c-3 13 9 17 16 10 0 4 17 8 15-9-2 6-10 6-15 3-7 4-14 3-16-4zm16 12l-8 7 1 88c-42-33-20-83-13-92-11 8-21 27-22 48 0 18 8 38 30 55l-27 3c7 4 22 3 32 2l7 9 6-9c11 1 26 2 34-2-9 0-19-1-29-4 22-16 30-36 29-54 0-21-11-40-21-48 7 9 28 58-13 91l1-87zm-25 1c-64 22-35 92-13 98a66 66 0 0113-98zm48 0c33 21 39 68 13 98 23-6 51-76-13-98", //end cty

      is: "country:Iceland;bgcolor:#02529c;doublecross:-80,0,#fff,#dc1e35", //end cty
      it: "country:Italy;bars:#009246|#fff|#ce2b37", //end cty
      je: "country:Jersey;detail:60;crossx:#fff,#df112d", //end cty

      //todo make with crossx and exta parameter for 3rd color
      jm: "country:Jamaica;bgcolor:#009b3a;pathstroke:M0 0L640 480h70v-480h-70L0 480,#000,70,#fed100", //end cty

      //star7 points from australia
      jo: "country:Jordan;striangle:#000|#fff|#007a3d,#ce1126,380;path:#fff,m140 240-18 1 2 18-12-13-12 13 2-18-18-1 15-9-10-15 17 6 5-17 5 17 17-6-10 15", //end cty
      jp: "country:Japan;bgcolor:;circle:320,240,150,#bc002d", //end cty

      ke:
        "country:Kenya;stripes:#000|#b00|#060;stripe:145,22,#fff;stripe:315,22,#fff;" +
        //spear
        "<g id='s'>;" +
        "pathstroke:m220 70q50 40 50 80-30-20-50-80z,#fff,1,#000;" +
        "line:6,#fff,360,330,390,390;" +
        "</g>" +
        "<use transform='matrix(-1 0 0 1 640 0)' href='#s'/>;" +
        //red shield
        "path:#b00,m320 80q150 150 0 320-150-170 0-320;" +
        //black shield right
        "path:#000,m262 165q30 70 0 150-30-70-5-140 30-70;" +
        //black shield left
        "path:#000,m379 165q30 70 0 150-30-70-5-140 30-70;" +
        //white shield TOP
        "path:#fff,m320 80q30 70 0 150-30-70-5-140 30-70;" +
        //white shield BOTTOM
        "path:#fff,m320 250q30 70 0 150-30-70-5-140 30-70;" +
        //red line over whites
        "line:4,#b00,320,80,320,400;" +
        //white circle
        "circle:320,240,14,#fff", //end cty

      //starrotate
      kg:
        "country:Kyrgyzstan;bgcolor:#e8112d;" +
        "rotate:40,<path fill='#ffef00' d='M60 60c13-16 41 0 66-12-28 1-43-13-64-11 22-14 41'/>;" +
        "circle:320,240,95,#e8112d;circle:320,235,80,#ffef00" +
        ";<g id='s'>;pathstroke:M260 180Q360 220 360 310,none,7,#e8112d;pathstroke:M270 170Q370 220 380 300,none,7,#e8112d;pathstroke:M280 160Q380 220 395 280,none,7,#e8112d;</g>" +
        "<use transform='matrix(-1 0 0 1 640 0)' href='#s'/>", //end cty

      // !! todo better abstract temple
      kh: "country:Cambodia;detail:40;stripes:#032ea1|#e00025|#e00025|#032ea1;rect:150,310,400,20,#fff,2,#000;rect:200,224,280,20,#fff,2,#000", //end cty

      //better starrotate sun
      ki: "country:Kiribati;detail:60;bgcolor:#ce1126;rotate:18,<path fill='#fcd116' stroke='#843511' d='M40 30l0 50-30 0'/>;circle:320,240,60,#fcd116,2,#777;stripe:280,300,#003f87;path:#fff,M-100 282c29 19 70 38 101 12 35-28 75-3 107 14 40 15 71-19 107-28 43-7 71 44 115 32 32-1 51-41 85-32 31 9 57 36 91 31 35-4 64-42 101-27 31 13 69 31 101 10 23-3 50-44 25-52-24 14-51 32-79 22-28-7-57-31-86-16-28 17-62 32-95 22-28-3-46-36-75-26-28 9-51 36-83 32-37-1-65-43-104-29-34 10-68 37-104 22-33-14-72-39-105-12-27 17-61 17-85-4-26-16-15 16-17 29M-100 352c29 19 70 38 101 12 35-28 75-3 107 14 40 15 71-19 107-28 43-7 71 44 115 32 32-1 51-41 85-32 31 9 57 36 91 31 35-4 64-42 101-27 31 13 69 31 101 10 23-3 50-44 25-52-24 14-51 32-79 22-28-7-57-31-86-16-28 17-62 32-95 22-28-3-46-36-75-26-28 9-51 36-83 32-37-1-65-43-104-29-34 10-68 37-104 22-33-14-72-39-105-12-27 17-61 17-85-4-26-16-15 16-17 29M-100 422c29 19 70 38 101 12 35-28 75-3 107 14 40 15 71-19 107-28 43-7 71 44 115 32 32-1 51-41 85-32 31 9 57 36 91 31 35-4 64-42 101-27 31 13 69 31 101 10 23-3 50-44 25-52-24 14-51 32-79 22-28-7-57-31-86-16-28 17-62 32-95 22-28-3-46-36-75-26-28 9-51 36-83 32-37-1-65-43-104-29-34 10-68 37-104 22-33-14-72-39-105-12-27 17-61 17-85-4-26-16-15 16-17 29", //end cty

      km:
        "country:Comoros;detail:80;striangle:#ffc61e|#fff|#ce1126|#3a75c4,#3d8e33,340;" +
        "circle:120,240,100,#fff;circle:160,240,100,#3d8e33;" + //crescent km-Comoros
        "star:#fff,70,80,1.7;use:70,105,1.7;use:70,132,1.7;use:70,160,1.7", //end cty

      kn: "country:Saint Kitts and Nevis;bgcolor:#009e49;diagonal:#ce1126,#fcd116,#000;star:#fff,80,0,4,40;use:100,-60,4,40", //end cty
      kp: "country:North Korea;stripes:#024fa2|#fff|#fff|#fff|#024fa2;stripe:110,257,#ed1c27;circle:250,240,80,#fff;star:#ed1c27,30,20,6", //end cty
      kr:
        "country:South Korea;bgcolor:;circle:320,240,99,#c60c30;" +
        "path:#003478,m237 185a50 50 0 0 0 83 55 50 50 0 0 1 83 55 99 99 0 0 1-165-110;" +
        "<g id='s'>;line:16,#000,100,150,160,60;line:16,#000,120,165,180,75;line:16,#000,142,180,202,90;</g>;" +
        "use:0,0,1,110 320 240;" +
        "use:0,0,1,180 320 240;" +
        "use:0,0,1,290 320 240;" +
        // + "<use transform='rotate(110 320 240)' href='#s'/>"
        // + "<use transform='rotate(180 320 240)' href='#s'/>"
        // + "<use transform='rotate(290 320 240)' href='#s'/>;"

        "line:12,#fff,460,143,480,128;" +
        "line:12,#fff,500,115,520,100;" +
        "line:12,#fff,450,330,520,382;" +
        "line:12,#fff,160,345,135,368", //end cty

      kw: "country:Kuwait;striangle:#007a3d|#fff|#ce1126,#000;rect:194,159,640,160,#fff", //end cty
      ky: "country:Cayman Islands;detail:40;gb", //end cty

      kz: "country:Kazakhstan;detail:60;bgcolor:#00afca;rotate:32,<path fill='#ffe400' d='m0 28l-95-28l95-28'/>,320,240;circle:320,240,70,#ffe400,6,#00afca;bar:40,40,#ffe400", //end cty
      la: "country:Laos;stripes:#ce1126|#002868|#002868|#ce1126;circle:320,240,95,#fff", //end cty

      //todo detailM green tree
      lb: "country:Lebanon;detail:80;stripes:#ed1c24|#fff|#fff|#ed1c24;path:#00a651,M316 122c-7 15-39 30-26 36-10 5-15 8-20 17 3 7 11-3 12 0-16 17-44 26-51 39 41 0-4 27-20 37 10 24 35-10 35 10-17 9-39 17-54 29 9 21 54-5 63-5-15 16-48 10-48 29 25 2 43-4 68-12 41 15-31 52-34 59 20-6 54-25 70-22 15 5 15 14 35 19-9-14 0-12 9-7 13 5 15 10 30 7-17-11-48-55-25-61 31 1 74 25 95 20-7-17-34-29-51-34 19-14 42 13 42-8-20-14-27-27-54-27 12-3 42 3 42-9-6-2-52-10-38-16 7 5 31 5 32 5-12-21-51-22-63-44 0-7 17 1 34 6-8-16-36-15-9-20-23-18-54-38-74-48", //end cty

      lc: "country:Saint Lucia;bgcolor:#6cf;triangle:175,435,320,70,465,435,#000,20,#fff;triangle:160,440,320,240,480,440,#fcd116", //end cty

      //todo detailM crown
      //todo detailL smaller crown with Qq paths
      li: "country:Liechtenstein;detail:80;stripes:#002b7f|#ce1126;path:#ffd83d,M140 60l16 19 17-19-17-18zm-83 78l24 54h150l27-51c-82-78-122-78-201-3", //end cty

      //todo detailM change to bigger detail size// replace 4x matrix with rotate:
      lk:
        "country:Sri Lanka;detail:60;bgcolor:#ffbe29;rect:27,27,88,427,#00534e;rect:115,27,88,427,#eb7400;rect:230,27,385,427,#8d153a;" +
        // one of 4 corner leaves
        "path:#ffb700,M579 409s4 7 8 10c6 4 18 4 23 9 6 6 0 15 0 15v5h-6c-3 0-4 2-9 2-12-1-11-12-12-21l-3-12-1-8z,s,1,#000;" +
        "<use transform='matrix(-1 0 0 1 845 0)' href='#s'/>" +
        "<use transform='matrix(1 0 0 -1 0 480)' href='#s'/>" +
        ";use:0,0,1,180 423 240;" +
        //+ "<use transform='rotate(180 423 240)' href='#s'/>"

        //yellow lion
        "pathstroke:m379 280c2 5-2 3 0 0zm86-1c-6 11 7 20 12 30 10 14-12 24-17 29 9 5 23 6 31-1 10-15 6-36-6-49-5-5-12-8-20-9zm-150-34c4 0 10 0 3 2l-3-2zm158-94c-24 1-53 21-22 46 19 11 44 8 70 3 12 9-1 26-13 23-47 0-58 10-105 8 31-3 39-14 30-24-12-7 5-4 3-34-1-11-12-16-21-14-12-1-33 15-61 10-12 0-9 16-1 19 8 2 21 1 24 13v1c-3-2-18-8-23-7-7 3 18 9 21 9-6 5-19-8-25 0-5 15 22 6 23 19-4 11-20 15-22 28-2 8-2 18 2 26l-21-29c-4-4-11 25-1 29 21 33 29 10 29 9l6 4c10 2 19 10 20 20 4 12-6 19-16 20-13 8 8 15 15 11 14-4 31-20 33-62 10 14 16 8 24 3 28-21 58 7 73 34 2 10-20 17-8 25 12 4 41-29 21-61 5-12 12-24 6-37-16-16 17-35-7-49-16-7-32 3-48-1-9-1-42-11-21-29 20-6 34 2 37 10 10 5 23 0 31 10 6 9 21-3 10-8-10 0-18-3-25-10-11-9-23-15-38-15zm-140-12c-34 20-24 88-21 104-5-4-10-7-9 2 2 5 6 7 11 8-6 4-2 23-1 28 1 4-17 16-2 29 3 4 10 4 13-1 3-4 2-10-2-13-4-4-2-11 1-15 1-4 2-24-4-28 5-1 10-3 12-8-10-40-5-66-2-86l4-20,#ffb700,2,#000", //end cty

      lr: "country:Liberia;stripes:#bf0a30|#fff|#bf0a30|#fff|#bf0a30|#fff|#bf0a30|#fff|#bf0a30|#fff|#bf0a30;rect:0,0,217,217,#002868;star:#fff,6,-2,6", //end cty

      //todo rework path in inkscape
      ls: "country:Lesotho;detail:80;stripes:#00209f|#009543;stripe:144,194,#fff;pathstroke:M320 153c-6 0-6 5-6 9l1 26-11 11c3 0 7-1 9 1l-1 18-48 66c-3-1-7-4-8-2l-12 26c40 22 89 24 132 9 7-3 16-6 21-10l-13-26c-2 0-6 4-7 1l-49-64v-19l8-1-11-10v-32c-1-2-3-3-5-3z,#000;pathstroke:M337 230h-34c-7-15-13-33-9-50 2-12 13-21 25-21 10-1 21 5 25 15 8 18 0 39-7 56z,none,8,#000", //end cty

      lt: "country:Lithuania;stripes:#fdb913|#006a44|#c1272d", //end cty
      lu: "country:Luxembourg;stripes:#ed2939|#fff|#00a1de", //end cty
      lv: "country:Latvia;bgcolor:#9e3039;stripe:190,100,#fff", //end cty
      ly: "country:Libya;stripes:#e70013|#000|#000|#239e46;path:#fff,M362 198a52 52 0 1 0 0 84 60 60 0 1 1 0-84m-13 42l81-26-50 68v-84l50 68", //end cty
      ma: "country:Marocco;bgcolor:#c1272d;pathstroke:M320 179l-36 110 93-67H262l93 68z,none,12,#006233", //end cty
      mc: "country:Monacco;stripes:#ce1126|#fff", //end cty
      md: "country:Moldova;detail:60;bars:#0046ae|#ffd200|#cc092f", //end cty

      //todo montenegro add simplified eagle
      me: "country:Montenegro;detail:40;bgcolor:#d3ae3b;rect:27,27,586,426,#c40308", //end cty

      mf: "country:Saint Martin;flag:fr", //end cty
      mg: "country:Madagascar;stripes:#fc3d32|#007e3a;bar:0,213", //end cty
      // starrotate:x,y,fill,scale=1,len=30,wid=4
      mh: "country:Marshall_Islands;bgcolor:#003893;triangle:640,0,-80,520,640,180,#dd7500;triangle:640,84,-80,530,640,180,#fff;rotate:4,<path fill='#fff' d='m0 2l-40-2l40-2'/>,150,180,3;rotate:24,<path fill='#fff' d='m0 4l-30-4l30-4'/>,150,180,3", //end cty
      mk: "country:North_Macedonia;bgcolor:#d20000;path:#ffe600,M0 0h96l224 231L544 0h96L0 480h96l224-231 224 231h96zm640 192v96L0 192v96zM280 0l40 206L360 0zm0 480l40-206 40 206;circle:320,240,77,#ffe600,17,#d20000", //end cty
      ml: "country:Mali;bars:#14b53a|#fcd116|#ce1126", //end cty
      mm: "country:Myanmar;stripes:#fecb00|#34b233|#ea2839;star:#fff,13,0,13", //end cty
      mn: "country:Mongolia;detail:80;bars:#c4272f|#015197|#c4272f;path:#f9cf02,M91 132a16 16 0 0 0 32 0c0-6-4-7-4-10 0-2 2-5-3-9 3 4-1 5-1 9l1 7a3 3 0 0 1-6 0c0-3 3-7 3-11 0-5 0-7-3-11-2-4-6-7-3-10-5 1-2 8-2 12s-4 6-4 11 3 6 3 9a3 3 0 0 1-7 0c0-3 2-3 2-7s-4-5-2-9c-4 4-2 7-2 9 0 3-4 3-4 10;circle:107,189,35,#f9cf02;circle:107,180,25,#f9cf02;path:#f9cf02,m37 230v153h32v-153zm108 0v153h32v-153zm-70 26v13h64v-13zm0 89v13h64v-13zm0-115h64l-32 20zm0 134h64l-32 19;circle:107,307,34,#f9cf02,4,#c4272f", //end cty
      mo:
        "country:Macau;bgcolor:#00795e;path:#fbd20e,M295 109l41 29-16-47-15 47 40-29;" +
        "<g id='s'>;path:#fff,M320 332H218a146 146 0 0 1-4-4h106a2 2 0 0 1 1 2l-1 2zm0-32a13 13 0 0 0 1-7 12 12 0 0 0-1-4 82 82 0 0 1-32 19 81 81 0 0 1-24 3h-63a144 144 0 0 0 6 8h61c20 0 38-7 52-19zm-110-24a32 32 0 0 1-9 2 81 81 0 0 0 61 27 81 81 0 0 0 58-25 441 441 0 0 0 5-59 441 441 0 0 0-5-67c-7 6-19 18-25 38a81 81 0 0 0-3 23 81 81 0 0 0 14 45 81 81 0 0 1-17-49c0-13 2-25 7-35a33 33 0 0 1-7-13 81 81 0 0 0-10 40c0 18 5 35 15 48a95 95 0 0 0-73-29 33 33 0 0 1 7 8 95 95 0 0 1 68 30 95 95 0 0 0-61-22 95 95 0 0 0-36 7 81 81 0 0 0 82 52l-14 1a81 81 0 0 1-57-22zm110 88h-53a144 144 0 0 0 53 10 11 11 0 0 0 1-4 11 11 0 0 0-1-6zm0-24h-94a144 144 0 0 0 8 6h86a5 5 0 0 0 1-3 4 4 0 0 0-1-3zm0 12h-77a144 144 0 0 0 15 8h62a8 8 0 0 0 1-4 8 8 0 0 0-1-4;" +
        "path:#fbd20e,M201 175l25 23-7-34-14 32 30-17zm36-32h35l-28-21 11 34 11-33;" +
        "</g>" +
        "<use transform='matrix(-1 0 0 1 640 0)' href='#s'/>", //end cty

      //todo detailM
      mp: "country:North Mariana Islands;detail:60;bgcolor:#0071bc;circle:320,240,180,none,40,#fff;rect:280,100,80,350,#8c8a8c,2,#000;star:#fff,24,7,9", //end cty

      mq: "country:Martinique;flag:fr", //end cty
      mr: "country:Mauritania;bgcolor:#006233;stripe:410,70,#c8102e;circle:320,220,150,#ffd700;circle:320,180,145,#006233;star:#ffd700,52,10,5;stripe:0,70,#c8102e", //end cty

      //todo add abstract shield
      ms: "country:Montserrat;detail:40;gb", //end cty

      mt: "country:Malta;detail:80;bars:#fff|#cf142b;cross:#96877d,80,80,120,40", //end cty
      mu: "country:Mauritius;stripes:#ea2839|#1a206d|#ffd500|#00a551", //end cty
      mv: "country:Maldives;bgcolor:#d21034;rect:80,80,480,320,#007e3a;circle:350,240,80,#fff;circle:380,240,80,#007e3a", //end cty

      //todo detailL better align spoke to center of rotate circle
      mw: "country:Malawi;bgcolor:#000;circle:320,210,130,#ce1126;rotate:80,<path fill='#ce1126' d='m125 20l60-5q6 5 0 10'/>,320,200;stripe:140,20,#000;stripe:160,160,#ce1126;stripe:320,160,#339e35", //end cty

      //todo detailH add abstract circle leaves like cyprus
      mx: "country:Mexico;detail:80;bars:#006847|#fff|#ce1126", //end cty

      //starrotate 14
      my: "country:Malaysia;stripes:#cc0001|#fff|#cc0001|#fff|#cc0001|#fff|#cc0001|#fff|#cc0001|#fff|#cc0001|#fff|#cc0001|#fff;rect:0,0,373,274,#010066;circle:150,135,90,#fc0;circle:167,135,82,#010066;rotate:14,<path fill='#fc0' d='m0 4l-18-4l18-4'/>,237,138,3.7", //end cty

      //todo detailM book and gun
      mz: "country:Mozambique;detail:80;striangle:#007168|#fff|#fce100,#d21034,310,<rect x='0' y='175' width='640' height='130' fill='#000'/>;star:#fce100,3,14,7", //end cty

      //starrotate 12
      na: "country:Namibia;bgcolor:#003580;triangle:0,480,640,0,640,480,#009543;line:160,#fff,-60,480,700,0;line:120,#d21034,-60,480,700,0;rotate:12,<path fill='#ffce00' d='m0 5l-11-5l11-5'/>,140,120,7;circle:140,120,45,#ffce00,8,#003580", //end cty
      nc: "country:New Caledonia;flag:fr", //end cty
      ne: "country:Niger;stripes:#e05206|#fff|#0db02b;circle:320,240,70,#e05206", //end cty
      nf: "country:Norfolk Island;bgcolor:#007934;bar:195,250;pathstroke:M320 100l90 250h-80v50h-20v-50h-80,#007934", //end cty
      ng: "country:Nigeria;bgcolor:#008751;bar:213,213", //end cty

      //todo detailH paths with Cc curves for true circle!
      ni: "country:Nicaragua;detail:80;stripes:#0067c6|#fff|#0067c6;path:none,m260 240q50-140 120 0,cv;<text dx='10' fill='#c9a504' letter-spacing='.2' font-family='Arial' font-size='13'><textPath alignment-baseline='top' href='#cv'>REPUBLICA DE NICARAGUA</textPath></text>;path:none,m250 240q70 130 140 0,cv2;<text dx='10' fill='#c9a504' letter-spacing='2' font-family='Arial' font-size='13'><textPath alignment-baseline='top' href='#cv2'>- AMERICA CENTRAL -</textPath></text>;triangle:275,260,320,180,365,260,lightblue", //end cty

      nl: "country:Netherlands;stripes:#ae1c28|#fff|#21468b", //end cty
      no: "country:Norway;bgcolor:#ef2b2d;doublecross:-80,0,#fff,#002868,120", //end cty

      //todo detailL blunter starspikes
      //starrotate
      np: "country:Nepal;pathstroke:m7 474h354l-233-236h242l-363-231z,#dc143c,14,#003893;circle:95,160,62,#fff;circle:95,143,62,#dc143c;rotate:16,<path fill='#fff' d='m0 6l-18-6l18-6'/>,95,187,2;rotate:16,<path fill='#fff' d='m0 6l-24-6l24-6'/>,95,350,3", //end cty

      nr: "country:Nauru;bgcolor:#002b7f;stripe:215,50,#ffc61e;rotate:12,<path fill='#fff' d='m0 6l-30-6l30-6'/>,240,360,3", //end cty
      nu: "country:Niue;detail:80;gb:#fcd116;circle:160,120,35,#002868;star:#fcd116,95,10,1.5;use:155,60,1.5;use:95,110,1.5;use:35,60,1.5;use:47,24,2.7", //end cty

      nz: "country:New Zealand;gb;<g stroke='#fff' stroke-width='2'>;star:#f00,235,20,2;use:235,170,2;use:190,85,2;use:325,90,1.7;</g>", //end cty

      //todo detailL swords
      om: "country:Oman;detail:80;stripes:#fff|#db161b|#008000;bar:0,175,#db161b", //end cty

      //gzip example repeating patter
      pa: "country:Panama;bgcolor:;rect:320,0,640,240,#d62918;rect:0,240,320,480,#005293;path:#005293,m210 180l-43-28-42 28 16-45-42-28 52-1 16-45 17 45h52l-42 29 16 45;path:#d62918, m517 414l-43-28-42 28 16-45-42-28 52-1 16-45 17 45h52l-42 29 16 45", //end cty

      //todo detailM circle stuff  !todo countries API does not have detail circle! ERROR
      pe: "country:Peru;detail:80;bars:#d91023|#fff|#d91023;circle:320,240,80,none,10,green", //end cty

      //todo detailM // !todo detail with paths and colors
      pf: "country:French Polynesia;detail:60;stripes:#de2010|#fff|#fff|#de2010;circle:320,240,80,orange;path:blue,M240 240 a1 1 0 0 0 160 0", //end cty

      //todo simplify bird        //savebytes
      pg: "country:Papua New Guinea;bgcolor:#ce1126;triangle:0,0,640,480,0,480,#000;scross:#fff,20,-50,1.3;path:#fcd116,M387 119c-2-6-9-8-13-6h-27l16 6c4 12 18 14 18 14-31 2-39 7-54 35-4 14-15 13 5 13-12 9 4 4 11 3-7 6 13 0 15 0-7 9 12-2 16-3 9 7 7 6 9-4 11 3 9 3 11-7 13 18 18 36 42 40-7-17 10-4 18 0 2-8 13 5 26 5 0-6-9-16 0-9-1-11-13-20 0-16l-8-13c6-2 3-4 2-9 48 8 32 61-9 55 28 14 46 1 58-22 14 31-9 49-40 53 65 9 61-38 35-77-1-11-6-12 5-9-6-10-10-20-14-31h5c-3-7-25-22-14-22-5-7-35-17-20-22-15-10-45 14-39 0-7 0-5-1-5-7 6-7 6-5-2-9 2-9 9-14-2-8 2-13 5-12-7-9 4-6 4-11 4-18-46-2-21 77-42 77", //end cty

      //todo smaller offset triangle
      ph: "country:Philippines;striangle:#0038a8|#ce1126,#fff,400;rotate:8,<path fill='#fcd116' d='m-25 -40-22-32h-7l26 34c-1 1-1 1-2 2l-31-35h-9v8l36 31-2 3-35-26v7l33 21'/>,140;star:#fcd116,-10,18,2,-30;use:190,35,2,20;use:-10,190,2,-5;circle:140,240,50,#fcd116", //end cty

      pk: "country:Pakistan;bgcolor:#01411c;bar:0,160;circle:420,240,150,#fff;circle:450,210,140,#01411c;star:#fff,110,80,3.3,-20", //end cty
      pl: "country:Poland;stripes:#fff|#dc143c", //end cty
      pm: "country:Saint Pierre;flag:fr", //end cty
      pn: "country:Pitcairn Island;detail:40;gb", //end cty
      pr: "country:Puerto Rico;striangle:#ed0000|#fff|#ed0000|#fff|#ed0000,#0050f0,400;star:#fff,7,13,7", //end cty
      ps: "country:State of Palestine;striangle:#000|#fff|#007a3d,#ce1126", //end cty

      //todo detailH curve
      pt:
        "country:Portugal;detail:900;bgcolor:#f00;bar:0,256,#060;" +
        //widest yellow band underneath
        "curve:0,20,200,100,155,190,20,#ff0;curve:0,20,200,100,150,195;curve:0,-20,200,100,157,184;" +
        //2 curves arche bottom
        "curve:0,20,188,0,162,190,10,#ff0;curve:0,20,188,0,160,187;curve:0,20,188,0,160,193;" +
        "curve:0,20,220,0,145,250,10,#ff0;curve:0,20,220,0,147,247;curve:0,20,220,0,147,253;" +
        "curve:0,20,188,0,162,300,10,#ff0;curve:0,20,188,0,160,297;curve:0,20,188,0,160,303;" +
        // circle
        "circle:256,240,110,none,10,#ff0;circle:256,240,113,none,1,#000;circle:256,240,107,none,1,#000;" +
        //2 curves arche to top
        "curve:0,-20,188,0,162,180,10,#ff0;curve:0,-20,188,0,162,183;curve:0,-20,188,0,162,177;" +
        "curve:0,-30,220,0,145,240,10,#ff0;curve:0,-30,220,0,147,237;curve:0,-30,220,0,147,243;" +
        "curve:0,-30,138,0,162,300,10,#ff0;curve:0,-30,138,0,160,297;curve:0,-30,138,0,160,303;" +
        //widest yellow band
        "curve:0,-20,200,100,155,190,20,#ff0;curve:0,-20,200,100,150,195;curve:0,-20,200,100,157,184;" +
        // vertical band
        "line:10,#ff0,256,124,256,356;line:1,#000,253,124,253,356;line:1,#000,260,124,260,356;" +
        //red shield, white shield
        "shield:#f00,90,190,160,2,#fff;shield:#fff,55,215,190,2,#777;" +
        //5 blue shields
        "<g id='s'>;path:#039,M246 196v12a1 1 0 0 0 18 0v-12z;" +
        //5 white circles
        "circle:250,200,2,#fff;circle:260,200,2,#fff;circle:250,210,2,#fff;circle:260,210,2,#fff;circle:255,205,2,#fff;" +
        "</g>;" +
        "use:0,30;use:-25,30;use:25,30;use:0,60;" +
        //5 castles
        "castle:195,182,.6,.6;castle:247,182,.6,.6;castle:303,182,.6,.6;castle:303,234,.6,.6;castle:195,234,.6,.6;castle:288,282,.6,.6,45;castle:213,293,.6,.6,-45;", //end cty

      // all other flags use a pale blue; flagcolors and encycolorpedia say this is the correct one
      pw: "country:Palau;bgcolor:#09f;circle:280,240,150,#ff0", //end cty
      py: "country:Paraguay;detail:60;stripes:#d52b1e|#fff|#0038a8;circle:320,240,60,#fff,5,#000", //end cty
      qa: "country:Qatar;bgcolor:#8d1b3d;path:#fff,M0 0v480h158l98-27-98-27 98-27-98-27 98-27-98-27 98-27-98-27 98-27-98-27 98-27-98-27 98-27-98-27 98-27-98-27 98-27-98-27H0", //end cty
      re: "country:Reunion;flag:fr", //end cty
      ro: "country:Romania;bars:#002b7f|#fcd116|#ce1126", //end cty

      // created detail february 2020, maybe better to redraw completely for smaller version
      // feathers are all the same Path for better GZip compression
      rs:
        "country:Serbia;detail:900;stripes:#c6363c|#0c4076|#fff;" +
        // re using Spain crown
        "crown:1;use:-50,-50,2.1;" +
        "line:1,#000,185,150,315;" +
        "line:1,#000,185,154,315;" +
        // Shield color,width,x,y,borderwidth,bordercolor
        "shield:#c6363c,110,165,160,2,#fff;" +
        //!! Eagle
        "<g id='e' transform='scale(.45) translate(70 50)'>;" +
        //+ "<g id='e' transform='matrix(.45 0 0 .45 31 21)'>;"// extra 3 bytes GZ

        // extra details in crown, using g-use to create 2
        "circle:420,280,10,red;" +
        //path_Color_D__id_strokewidth_stroke_color
        // Claw
        "pathstroke:M412 585c-12 4-34 42-43 45-7 1-14-2-21-3-14 17 10 7 11 11-15 1-16 14-10 16 5 1 16-13 17-4-10 6-8 16-4 18s15-4 13-19c3-7 13-23 29-18 3-4 0-12-5-11-2 1-7 5-6 1 3-4 19-27 19-36z,#edb92e,1,#21231e;" +
        //clawnails - 113 bytes
        "pathstroke:M345 635c-4-3-6-3-8-1-1 1-2 1-1-1 3-6 7-7 11-4l2 2c0 2-3 3-4 4zm58-6c4-3 8-4 10-2 1 1 3 0 1-1-4-7-9-7-13-3l-3 3zm-34 35s-1-5-3-7l-4 4c-4 4-4 11 3 17 1 1 2 0 1-2-1-3 1-6 3-12zm-16-13c-4 2-6 4-6 6s-1 2-1 1c-5-12 0-14 7-13z,#edb92e,1,#21231e;" +
        //fleur de li - 156 GZip bytes
        "pathstroke:M388 701c8 7 15-8 8-27-26-23-18 8-15 10 2-2 2-7 5-6 11 2 11 22 0 18-2 0-1 4 2 5z,#edb92e,1,#21231e;" +
        "pathstroke:M388 701c8 7 15-8 8-27-26-23-18 8-15 10 2-2 2-7 5-6 11 2 11 22 0 18-2 0-1 4 2 5z,#edb92e,1,#21231e,matrix(-1 0 0 1 802 0);" +
        "pathstroke:M392 650c-4 5-3 12 0 16s6 29 6 29c0 4-2 6-5 7-1 1 8 9 8 9s8-8 7-9c-2-1-4-4-5-7 0 0 3-25 7-29 3-4 4-11-1-16l-8-12-9 12z,#edb92e,1,#21231e;" +
        "pathstroke:M395 686h12c2 0 3 1 3 3s-1 4-3 4h-12c-2 0-3-2-3-4s1-3 3-3z,#edb92e,1,#21231e;" +
        // Feathers
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000;" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 2.95 -23 -694);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 2.95 -10 -682);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 2.95 4 -683);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 2.95 19 -692);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 2.95 35 -735);" +
        // tail long feathers
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 2.95 85 -575);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 2.95 99 -570);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 2.95 112 -565);" +
        // feather left of shield
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 1.68 48 -190);" +
        // feathers under wing
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 1.68 -32 -247);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 1.68 -18 -236);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 1.68 -4 -231);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 1.68 6 -237);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 1.68 17 -242);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 1.68 31 -242);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(1 0 0 1.68 45 -237);" +
        //3 feathers under wing
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,translate(14 6);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,translate(27 14);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,translate(41 21);" +
        //wingtop
        "<path stroke='#000' fill='#fff' d='M481 421v-44c-2-14-6-29-14-41 9 4 11-14 2-11-14-1-38-10-51-12-10 7 10 28 19 34 4 13 13 27 10 41-4 9-11 16-18 22-5 3-7 5-1 5-5 4-12 3-16-4 0 0-43-46-43-61 14-37-2-32-8-30-17 9-26 27-32 44s-6 36-9 54c1 2 22-17 19-8l-2 9c10-1 18-8 20-17-2-13 14-7 14-7s27 51 47 52c3-4-1-13 8-11 17-2 56-8 55-15z'/>;" +
        //diagonal feathers leftbottom
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(.91 .41 -.44 .86 254 77);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(.91 .41 -.44 .86 266 86);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(.91 .41 -.44 .86 278 90);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(.91 .41 -.44 .86 264 55);" +
        "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(.91 .41 -.44 .86 273 66);" +
        //            + "pathstroke:M370 393s-3 48-11 44-4-50-4-50,#fff,1,#000,matrix(.91 .41 -.44 .86 290 70);"
        // Head

        //  tongue
        "<path stroke='#000' fill='#edb92e' d='M441 357c-2 2-9 2-18 2-15 1-24-4-26-13 6 6 13 10 20 8 10-3 16-5 18-4 2 0 4 3 6 7z'/>;" +
        //+ "pathstroke:M441 357c-2 2-9 2-18 2-15 1-24-4-26-13 6 6 13 10 20 8 10-3 16-5 18-4 2 0 4 3 6 7z,#edb92e;"

        //  eyes
        "<path stroke='#000' fill='#fff' d='M430 331l-3-2c-1-2 0-3 2-6l5 2zm5-6c-3 2-7-2-10-1s-2-5 0-2c4 0 7 1 10 3zm9 3c0 3-7 1-5-1zm0 1z'/>;" +
        //  beak
        "<path stroke='#000' fill='#edb92e' d='M406 318c-17 2-16 12 0 28 3 3 4 3 4 0 1-6 7-9 10-5 2 3 2 5 9 4 9 7 16 12 5 12-5 0-9 3-16 2l3 5c7 1 14-3 20-2 14 3-23-38-22-40 1-4-9-11-13-4z'/>;" +
        "<path stroke='#000' fill='#fff' d='M424 414c9-4 18-8 22-6s2 10 4 10 7-9 10-10c3-2 5 4 7 4 2 1 4-4 7-8'/>;" +
        // Tail diagonal
        //+ "<path stroke='#000' fill='#fff' d='M449 569l-9-5c-4 3-7 13 0 22a65 65 0 0114 28c6-8 8-17 4-25-5-11-9-17-9-20z'/>;"
        //tail triangle
        //+ "<path stroke='#000' fill='#fff' d='M464 575c0 5 12 56 18 56s18-51 18-56z'/>;"

        // Shield color,width,x,y,borderwidth,bordercolor
        //+ "shield:#c6363c,86,418,426,1,#000;cross:#fff,480,500,130,18;"
        //$L_line_width_color_x1_y1_x2_y2
        "line:24,#fff,420,495,480,495;" +
        "line:12,#fff,475,425,475,572;" +
        // 3 in shield
        "pathstroke:M465 440c-44-4-16 18-14 10 0-2-4-6-4-2-8-2 4-10 10 0-4 10-8 4 0 16-6 10-18 2-10-2 0 4 6 2 4 0-4-10-28 12 14 10,#fff,.5,#000;" +
        "pathstroke:M465 518c-44-4-16 18-14 10 0-2-4-6-4-2-8-2 4-10 10 0-4 10-8 4 0 16-6 10-18 2-10-2 0 4 6 2 4 0-4-10-28 12 14 10,#fff,.5,#000;" +
        "</g>;" + // Eagle id='e'
        "<use href='#e' transform='matrix(-1 0 0 1 495 0)'/>;", //end cty usedef
      //+ "shield:#c6363c,42,218,210,1,#000;cross:#fff,249,246,70,14;"
      //+ "pathstroke:M235 218c-22-2-8 9-7 5 0-1-2-3-2-1-4-1 2-5 5 0-2 5-4 2 0 8-3 5-9 1-5-1 0 2 3 1 2 0-2-5-14 6 7 5,white,.5,#000;"

      ru: "country:Russia;stripes:#fff|#0039a6|#d52b1e", //end cty
      rw: "country:Rwanda;stripes:#00a1de|#00a1de|#e5be01|#20603d;rotate:24,<path fill='#fad201' d='m0 5l-80-5l80-5'/>, 515, 125;circle:515,125,25,#fad201,3,#00a1de", //end cty

      sa:
        "country:Saudi Arabia;detail:40;bgcolor:#006c35;" +
        // todo: text for Saudi flag, longer text requires other font-settings for sa: flag
        //+ "<text x='70' y='300' font-size='70' fill='#fff'>لَا إِلٰهَ إِلَّا الله مُحَمَّدٌ رَسُولُ الله"    //  100 bytes-A god but Allah,Muhammad is the Messenger of Allah
        //+"<text x='240' y='300' font-size='240' fill='#fff'>لَمُحَمَّدٌ رَسُولُ الله"               //  77 bytes-The Messenger of Allah
        "<text x='240' y='300' font-size='240' fill='#fff'>الله" + //  18 bytes-Allah
        "</text>;" +
        // white sword // todo simplify
        "path:#fff,M412 340l21 1 10-1c10-1 10 14 10 14 0 10-4 10-7 11-3 0-4-2-6-4a13 13 0 0 1-7 1l-10-1h-10c0 2-2 3-4 3s-4-6-4-10l1-3c-34-1-70-3-105-2l-80 2c-14 0-26-2-33-13h47l57-1 115 2c-4-1-4-7 2-9l2 3c4 0 2 5 1 6", //end cty

      sb: "country:Solomon Islands;bgcolor:#215b33;triangle:0,0,640,0,0,480,#0051ba;line:40,#fcd116,0,480,640,0;star:#fff,10,0,3;use:60,0,3;use:10,45,3;use:60,45,3;use:35,20,3", //end cty
      sc: "country:Seychelles;bgcolor:#d62828;path:#007a3d,M0 480l930-160v160H0;path:#fff,M0 480l930-320v160L0 480;path:#003f87,M0 480V0h310L0 480;path:#fcd856,M0 480L310 0h310L0 480", //end cty
      sd: "country:Sudan;striangle:#d21034|#fff|#000,#007229", //end cty
      se: "country:Sweden;bgcolor:#006aa7;doublecross:-80,0,#fecc00,#fecc00,95", //end cty
      sg: "country:Singapore;bgcolor:;stripe:0,240,#ed2939;path:#fff,M146 40a84 84 0 0 0 1 165 86 86 0 0 1-107-59A86 86 0 0 1 99 40c16-4 31-4 47 0;star:#fff,90,20,1.7;use:60,40,1.7;use:120,40,1.7;use:70,70,1.7;use:110,70,1.7", //end cty

      //todo abstract shield
      sh: "country:Saint Helena;detail:40;gb", //end cty

      //savebytes
      si:
        "country:Slovenia;detail:80;stripes:#fff|#005da4|#ed1c24;" +
        //blue shield red outline
        "pathstroke:M223 85c-3 31 4 66-10 94-11 22-31 49-56 49-25-1-44-28-55-50-14-28-8-61-10-93 42-15 89-15 131 0z,#005da4,5,#ed1c24;" +
        // hide red line at top of shield
        "curve:0,-14,127,0,94,84,6,#005da4;" + // _cx_cy_dx_dy_x1_y1__strokewidth_stroke_fill_id_(x3)_(y3)
        //white mountains
        "path:#fff,M209 168l-29-28-10 10-12-24-13 24-10-10-29 28c9 34 36 55 51 54 19-6 38-15 52-54;" +
        //blue river //todo re-use river wave symbol/def #wave from Spain
        "pathstroke:M118 198s30 6 43 0c7-3 32 2 32 2l3-5s-36-6-45-2c-9 5-33 0-33 0v5,none,3,#005da4;" +
        "star:#ffdd00,305,200,.5;use:260,155,.5;use:345,155,.5", //end cty
      sj: "country:Svalbard;flag:no", //end cty

      //savebytes with c/q paths
      sk: "country:Slovakia;stripes:#fff|#0b4ea2|#ee1c25;path:#fff,M233 371c-43-21-105-62-105-143 0-82 4-119 4-119h202s4 37 4 119-62 122-105 143;path:#ee1c25,M233 360c-39-19-96-57-96-131s4-109 4-109h184s4 34 4 109c0 74-56 112-96 131;path:#fff,M241 209c11 0 32 1 51-6l-1 15 1 14c-17-5-38-6-51-5v41h-16v-41c-12-1-33 0-50 5v-14-15c18 7 39 6 50 6v-26c-10 0-24 1-40 6v-15-14c16 5 30 6 40 6-1-17-6-37-6-37h28s-5 20-5 37c9 0 23-1 39-6v29a119 119 0 0 0-40-6v26;path:#0b4ea2,M233 263c-20 0-30 28-30 28s-6-13-23-13c-11 0-19 10-24 19 20 31 52 51 77 63 25-12 57-32 77-63-5-9-13-19-24-19-16 0-22 13-22 13s-11-28-31-28", //end cty
      sl: "country:Sierra Leone;stripes:#1eb53a|#fff|#0072c6", //end cty
      sm: "country:San Marino;detail:40;bgcolor:;stripe:240,240,#5eb6e4", //end cty
      sn: "country:Senegal;bars:#00853f|#fdef42|#e31b23;star:#00853f,42,18,6", //end cty
      so: "country:Somalia;bgcolor:#4189dd;star:#fff,28,8,8", //end cty
      sr: "country:Suriname;bgcolor:#377e3f;stripe:96,288,#fff;stripe:140,200,#b40a2d;star:#ecc81d,28,11,8", //end cty
      ss: "country:South Sudan;stripes:#000|#fff|#078930;stripe:175,125,#da121a;triangle:0,0,320,240,0,480,#0f47af;star:#fce100,10,30,5", //end cty
      st: "country:Sao Tome;striangle:#12ad2b|#ffce00|#ffce00|#12ad2b,#d21034,230;star:#000,58,28,5;use:92,28,5", //end cty

      //todo add green leaves in detailM
      sv: "country:El_Salvador;detail:60;stripes:#0f47af|#fff|#0f47af;circle:320,240,70,#fff,5,#fc0;path:#ffcc00,M320 190l50 80h-100", //end cty

      sx: "country:Sint Maarten;detail:60;striangle:#dc1016|#002688,#fff,300", //end cty
      sy: "country:Syria;stripes:#ce1126|#fff|#000;star:#007a3d,30,40,4;use:108,40,4", //end cty

      //todo detailH sz shield
      sz: "country:Swaziland;detail:40;stripes:#3e5eb9|#b10c0c|#b10c0c|#3e5eb9;stripe:88,34,#ffd900;stripe:360,34,#ffd900", //end cty

      //todo add abstract shield
      tc: "country:Turks Islands;detail:40;gb", //end cty

      td: "country:Chad;bars:#002664|#fecb00|#c60c30", //end cty
      tf: "country:French Southern Territories;bgcolor:#002395;path:#fff,M0 0h292.8v196.8H0;path:#002395,M0 0h96v192H0;path:#ed2939,M192 0h96v192h-96;path:#fff,M426 219.6l15 25h44V330l-33-52-44 71h22l23-41 47 84 47-84 23 41h22L546 278 513 330v-47h20l15-23H513v-15h44l15-25H426zm52 105h-48v17h48zm91 0h-48v17h48;star:#fff,185,115,2;use:285,115,2;use:210,175,2;use:265,175,2;use:238,195,2", //end cty
      tg: "country:Togo;stripes:#006a4e|#ffce00|#006a4e|#ffce00|#006a4e;rect:0,0,288,288,#d21034;star:#fff,9,0,7", //end cty
      th: "country:Thailand;stripes:#a51931|#f4f5f8|#2d2a4a|#2d2a4a|#f4f5f8|#a51931", //end cty
      tj:
        "country:Tajikistan;stripes:#cc0000|#fff|#fff|#006600;" +
        "path:#f8c300,M301 234a9 9 0 0 1 16 4v34h6v-34a9 9 0 0 1 16-4 20 20 0 1 0-38 0;" +
        "path:#f8c300,M317 258a26 26 0 0 1-44 17 27 27 0 0 1-41 12c3 25 40 20 43-4 12 20 37 14 45-11,a;" +
        "<use fill='#f8c300' transform='matrix(-1 0 0 1 640 0)' href='#a'/>;" +
        "path:#f8c300,M292 303c-5 11-16 13-25 4l8-4c-1-3 0-7 3-9a15 15 0 0 1 6 8c5-1 8 1 8 1,b;" +
        "<use fill='#f8c300' transform='rotate(9 320 551)' href='#b'/>" +
        "<use fill='#f8c300' transform='rotate(19 320 551)' href='#b'/>;" +
        "pathstroke:M254 328a233 233 0 0 1 133 0z,none,11,#f8c300;" +
        "star:#f8c300,200,80,1.5;" +
        "use:170,90,1.5;use:230,90,1.5;use:150,115,1.5;use:250,115,1.5;use:140,150,1.5;use:260,150,1.5", //end cty

      //todo abstract shapes, better scross
      tk: "country:Tokelau;bgcolor:#00247d;path:#fed100,M108 355c134-90 266-195 401-259-39 96-11 201 67 254 7-2 34 9 12 8l-480-3zm-4 6c10 27 42 8 62 13l437 6c-4-24-32-15-48-14-152-3-311-3-451-5;scross:#fff,30,-99", //end cty

      tl: "country:Timor Leste;striangle:#dc241f|#dc241f,#ffc726,500;triangle:0,0,300,240,0,480,#000;star:#fff,-10,23,6,-25", //end cty

      //todo detailM Turkemistand banner
      tm: "country:Turkmenistan;detail:60;bgcolor:#00843d;bar:80,100,#d22630;circle:290,90,55,#fff;circle:275,80,55,#00843d;star:#fff,325,40,.8;use:325,75,.8;use:325,110,.8;use:360,60,.8;use:290,90,.8", //end cty

      tn: "country:Tunisia;bgcolor:#e70013;circle:320,240,121,#fff;circle:320,240,90,#e70013;circle:340,240,75,#fff;star:#e70013,49,67,4,-20", //end cty

      to: "country:Tonga;bgcolor:#c10000;rect:0,0,320,220,#fff;cross:#c10000,160,110,170,50", //end cty
      tr: "country:Turkey;bgcolor:#e30a17;circle:240,240,120,#fff;circle:270,240,96,#e30a17;star:#fff,58,70,4,-20", //end cty
      tt: "country:Trinidad and Tobago;bgcolor:#da1a35;pathstroke:M0-20l500 520h140L140-20,#000,20,#fff", //end cty

      tv: "country:Tuvalu;detail:40;gb:#5b97b1;star:#fff40d,82,122,3;use:110,117,3;use:110,90,3;use:140,110,3;use:160,90,3;use:185,75,3;use:185,25,3;use:160,45,3;use:135,50,3", //end cty
      //starrotatestar 12
      tw: "country:Taiwan;bgcolor:#fe0000;rect:0,0,320,240,#000097;rotate:12,<path fill='#fff' d='m0 28l-95-28l95-28'/>,160,125;circle:160,125,50,#fff,7,#000097", //end cty
      tz: "country:Tanzania;bgcolor:#1eb53a;diagonal:#00a3dd,#fcd116,#000", //end cty
      ua: "country:Ukraine;stripes:#005bbb|#ffd500", //end cty

      //todo Uganda detailM black bird
      ug: "country:Uganda;detail:60;stripes:#000|#fcdc04|#d90000|#000|#fcdc04|#d90000;circle:320,240,75,#fff", //end cty

      um: "country:United States minor islands;us", //end cty
      us: "country:United States of America;us", //end cty

      uz: "country:Uzbekistan;stripes:#0099b5|#fff|#1eb53a;circle:134,77,58,#fff;circle:154,77,58,#0099b5;star:#fff,230,10;use:270,10;use:310,10;use:190,55;use:230,55;use:270,55;use:310,55;use:150,100;use:190,100;use:230,100;use:270,100;use:310,100;stripe:160,10,#ce1126;stripe:320,10,#ce1126", //end cty

      //detail holy moly graphics
      va: "country:Vatican City;detail:40;bgcolor:;bar:0,320,#ffe000", //end cty
      vc: "country:Saint Vincent;bars:#0072c6|#fcd116|#fcd116|#009e60;path:#009e60,m259 180l-46 71 45 75 44-74-43-72zm122 0l-46 71 45 75 44-74-43-72zm-62 97l-46 71 45 75 44-74-43-72", //end cty
      ve: "country:Venezuela;stripes:#fc0|#00247d|#cf142b;rotate:16,<path fill='#fff' d='M80 8l3 9h9l-7 5 3 8.7-7-5-7 5 3-9-7-5h9'/>,320,320,1.7;stripe:320,160,#cf142b", //end cty

      //todo green shield
      vg: "country:British Virgin Islands;detail:40;gb", //end cty

      vi: "country:Virgin Islands;detail:40;bgcolor", //end cty
      vn: "country:Vietnam;bgcolor:#da251d;star:#ff0,15,0,12", //end cty
      vu: "country:Vanuatu;detail:80;stripes:#d21034|#009543;path:#000,M0 0l330 212h394v56H330L0 480V0;pathstroke:m-40 15L320 240h460h-460L-40 465,#000,20,#fdce12;circle:100,240,55,#000,20,#fdce12", //end cty
      wf: "country:Wallis and Futuna;flag:fr", //end cty
      ws: "country:Samoa;bgcolor:#ce1126;rect:0,0,320,240,#002b7f;scross:#fff,50,-150,1", //end cty

      //savebytes todo simplify path for country outline
      xk: "country:Republic of Kosovo;detail:80;bgcolor:#244aa5;star:#fff,70,40,2;use:100,30,2;use:130,20,2;use:160,20,2;use:190,30,2;use:220,40,2;path:#d0a650,M253 225c15 5 22-13 24-23 11-6 26-21 17-34-14-12 13-18 22-17 12 2 2 21 17 20 13 2 28 3 33 17 8 12 15 27 30 32 10 4 1 30 19 25 11 5 27 6 36 13-2 19-20 31-23 49-19-4 1 25-13 21-14-2-26 9-29 22-7 18-17-8-26-10-11-2-17 13-29 14-10 4-24 10-22 23 7 14-10 31-21 19-7-11 3-23-4-35-3-14-9-30-23-38-19 0-27-19-34-33-9-9-13-24-13-33-19 0-10-30 5-19 14 5 21-15 34-13", //end cty
      ye: "country:Yemen;stripes:#ce1126|#fff|#000", //end cty
      yt: "country:Mayotte;flag:fr", //end cty

      //savebytes? secondlast path is green because striangle goes to left corner
      za: "country:South Africa;striangle:#de3831|#007a4d|#002395,#007a4d,400;path:#000,M0 382V98l212 142L0 382;path:#ffb612,M0 60v38l212 142L0 382v38l267-180L0 60;path:#007a4d,M0 60V0h89l282 191h349v98H371L89 480H0v-60l267-180L0 60;path:#fff,M89 0h55l238 160h338v31H371L89 0zm0 480h55l238-160h338v-31H371L89 480", //end cty
      zm: "country:Zambia;detail:80;bgcolor:#198a00;rect:385,173,240,307,#de2010;rect:471,173,240,307,#000;rect:556, 173,240,307,#ef7d00", //end cty

      //todo plus detail golden bird
      zw: "country:Zimbabwe;detail:80;stripes:#006400|#ffd200|#d40000|#000|#d40000|#ffd200|#006400;pathstroke:M-30-30v540L340 240z,#fff,14,#000;star:#d40000,4,8,8", //end cty

      //Discontinued flags
      //an:Netherlands Antilles,discontinued in 2010,5 islands got their own flag  https://en.wikipedia.org/wiki/ISO_3166-2:AN

      // SPECIAL FLAGS
      eu: "country:European Union;bgcolor:#039;star:#fc0,148,20,2;use:148,180,2;use:68,100,2;use:228,100,2;use:78,60,2;use:108,30,2;use:218,60,2;use:188,30,2;use:218,140,2;use:188,170,2;use:78,140,2;use:108,170,2", //end cty

      un: "country:United Nations;bgcolor:#5b92e5;lun;circles:5,320,220,20,none,3,#fff;pathstroke:M320 220l100 0M320 220l70 70M320 220l0 100M320 220l-70 70M320 220l-100 0M320 220l-70-70M320 220l0-100M320 220l70-70,#fff,3,#fff;circle:320,220,18,#5b92e5", //end cty
      unia: "country:Pan Africa;stripes:#e31c23|#000|#00843e", //end cty

      // 92 GZb
      //caricom: 'country:Caribean Community;stripes:#71d4ed|#124086;circle:320,240,160,#fcd116,25,#007a4d;text:{"str":"C","font":"Arial","size":210,"x":290,"y":290};text:{"str":"C","font":"Arial","size":210,"x":340,"y":345}',//end cty

      //in quotes!! prevent cross: replacement! ch: $c
      redcross: "country:Red Cross;bgcolor:;cross:#f00,320,240,300,100", //end cty

      redcrescent:
        "country:Red Crescent;bgcolor:;" +
        "circle:320,240,160,#f00;circle:360,240,130,#fff", //red cross crescent //end cty
      jollyroger:
        "country:Jolly Roger;bgcolor:#000;" +
        //jolly todo: bone ends rotate:7, hide 3 with black circles, eyes with black circles
        // one path 411 GZb
        "path:#fff,M372 253c-3 6-33 28-46 28s-46-23-49-28c-4-7-8-18-7-24 0-3 9-6 10-3 11 23 26 27 46 27 19 0 32 0 43-26 2-5 9-1 10 2 4 10 0 0 0 0s-2 17-7 24zm-46 77c25-11 64-27 90-31 8-16 47-48 39 1 22 15 13 41-28 18-21 2-58 17-76 25 17 8 50 28 64 36 86 7 48 34 27 36 0 11-36 33-45-16-10-10-60-40-73-43-17 7-57 31-73 45-5 35-23 32-41 12-34 0-46-36 28-37l62-33c-27-10-57-20-78-25-31 22-52 3-28-18-3-10 2-42 46-4 17 6 66 24 86 34zm0-148c-4 7-17 17-17 21-1 11 10 11 17 6 7 4 17 6 17-6-1-5-12-13-17-21zm35 41c-4 2-2 11-6 12-18 7-40 6-58 1-5-1-5-12-7-13-12-7-30-8-40-16-5-4-2-29-10-34-7-4-10-20-12-33-3-14-5-40 10-58 16-18 44-33 88-33s73 14 88 33c14 19 11 45 8 58-2 13-9 28-15 33s-4 31-6 34c-5 5-29 9-40 16zm-103-63c0 19 19 28 34 22 18-6 20-37 1-43-16-4-34 2-35 21zm114 23c21-2 27-34 9-43-14-7-36-1-38 18-2 23 14 27 29 25", //highdetail //end cty
      // xx: "flags:zw|zw|zw|zw|zw|zw|zw|zw|zw",

      //!todo Earth flag, detailH make with code
      //         earth: `country:Earth;bgcolor:#013ba6;<defs>
      // <circle id='a' r='146' fill='none' stroke-width='39' stroke='#013ba6'/><circle id='c' r='146' fill='none' stroke-width='17' stroke='#fff'/><clipPath id='b'><path ='m0-200v400h200v-400zm-200 0v400h100v-400'/></clipPath><clipPath id='e'><path d='m-200-200h400v250h-400'/></clipPath><clipPath id='f'><path d='m0 0l-200-150v300'/></clipPath>
      // <clipPath id='g'><path d='m0 0l-200-200v400'/></clipPath>
      // <clipPath id='h'><path d='m0 0l-50-200h-150v350'/></clipPath>
      // <clipPath id='i'><path d='m0 0v-200h-200v400'/></clipPath>
      // </defs>
      // <g id='d' transform='translate(400 240) scale(.6)'><use clip-path='url(#b)' href='#a'/><use href='#c'/></g>
      // <use transform='rotate(-60 314 240)' href='#d'/>
      // <use transform='rotate(60 314 240)' href='#d'/>
      // <use transform='rotate(120 314 240)' href='#d'/>
      // <use transform='rotate(180 314 240)' href='#d'/>
      // <use transform='rotate(-120 314 240)' href='#d'/>
      // <g transform='translate(314 240) scale(.6)'><use clip-path='url(#e)' href='#a'/><use href='#c'/></g>
      // <g transform='translate(400 240) scale(.6)'><use clip-path='url(#f)' href='#a'/><use clip-path='url(#g)' href='#c'/></g>
      // <g id='j' transform='rotate(120 45 235) scale(.6)'><use clip-path='url(#h)' href='#a'/><use clip-path='url(#i)' href='#c'/></g>
      // <use transform='matrix(-1 0 0 1 628 0)' href='#j'/>`,//end cty

      lgbt: "country:LGBT Rainbow;stripes:#e70000|#ff8c00|#ffef00|#00811f|#0044ff|#760089", //end cty
      trans: "country:Transgender;stripes:#5bcefa|#f5a9b8|#fff|#f5a9b8|#5bcefa", //end cty

      //todo recreate with 4 rotating pieces, savebytes
      //275 GZb
      nato: "country:NATO;bgcolor:#012169;path:#fff,m459 243v-6h140v6h-140zm-418 0v-6h140v6h-140zm276 136h6v58h-6v-58zm0-336h6v58h-6v-58zm125 196h-123l22-23-19-86c0-1 1-1 1 0l26 81 93 28zm-29-17c-6-38-37-70-77-77l3 8c33 7 60 34 67 68l6 2zm-93 139v-122l22 21 87-19c0 1 1 1 0 1l-82 26-28 93zm16-29c40-6 70-38 77-77l-7 3c-8 33-34 60-67 67l-3 8zm-138-93h122l-22 22 19 86c0 1-1 1-1 0l-26-81-93-28zm29 16c6 38 36 70 76 77l-3-8c-33-7-60-34-67-68l-6-2zm93-139v123l-22-22-88 18v-1l82-26 28-93zm-15 29c-40 6-71 38-77 77l8-3c7-33 34-60 67-67l3-8", //end cty

      //Olympic 69 bytes
      //missing detail: overlapping colors patches
      olympic:
        "country:Olympic;bgcolor:;circle:125,200,80,none,15,#0885c2;circle:315,200,80,none,15,#000;circle:500,200,80,none,15,#ed334e;circle:220,275,80,none,15,#fbb132;circle:405,275,80,none,15,#1c8b3c", //end cty
      // added 2024 for Paris 2024 olympics
      ain: "country:Individual Neutral Athlete;bgcolor:#00afa8;circle:320,240,150,#fff;circle:320,240,100,#fff,8,#00afa8;<text x='37%' y='57%' fill='#00afa8' font-family='arial' font-size='100'>AIN</text>",
      // Reference signal and ics definition in presets
      signal: "signal",
      ics: "ics",
    };

    //let fmPropValue = (_this, name, defaultValue = false) => getComputedStyle(_this).getPropertyValue("--flagmeister" + name) || defaultValue;

    let flagsmap = Object.keys(flags).map(
      (iso) => {
        let createFlagElement = (baseClass, options) =>
          customElements.define(
            "flag-" + iso,
            class extends baseClass {
              // Used by the FlagAnalyzer
              get data() {
                return flags[iso];
              }

              static get observedAttributes() {
                return [
                  "source",
                  "box",
                  "draw",
                  "clip",
                  "filter",
                  "char",
                  "selected",
                  "is",
                ];
              }
              attributeChangedCallback(name, oldValue, newValue) {
                if (this.img && oldValue != newValue) this.load();
              }
              constructor(flag) {
                flag = super();

                // public attributes/properties getter/setter
                // ALL ARE PROCESSED BY THE FLAGPARSER!!!
                [
                  ["iso", iso],
                  ["detail", false], // disable detail by assigning a huge number of width-pixels

                  ["source", false], // from which URI source SVG detail flags are loaded

                  ["box", "0 0 640 480"], // default viewBox='0 0 640 480'

                  ["transform", ""], // SVG transform on <g> wrapping FlagMeister SVG content

                  [
                    "clip",
                    $R_rect_X_Y_W_H___colorNone_strokewidth_stroke(
                      0,
                      0,
                      640,
                      480
                    ),
                  ], // default clip is the standard 640 by 480 flag

                  ["flags", flags],
                  //,['mask',""]
                  ["draw", ""], // draw SVG through flagparser() on the flag
                  ["filter", false], // use SVG filter
                ].map(([attr, defaultvalue]) => {
                  Object.defineProperty(flag, attr, {
                    set(val) {
                      val
                        ? flag.setAttribute(attr, val)
                        : flag.removeAttribute(attr);
                    },
                    get() {
                      let val =
                        flag.getAttribute(attr) || //todo numbers are stills strings here,but ~~string == 0
                        getComputedStyle(this)
                          .getPropertyValue("--flagmeister" + attr)
                          .trim() ||
                        defaultvalue;
                      // !todo handle 0 '0' value with generic code (now clip in svg() below)
                      if (val == "none") val = false;
                      else if (typeof val == "string")
                        val = flagparser(val, this);
                      else;

                      // if (1) console.log((() => {
                      //     let hasCSSproperty = getComputedStyle(this).getPropertyValue('--flagmeister' + attr).trim();
                      //     let hasAttr = flag.getAttribute(attr);
                      //     return `% c ${iso} get:${attr} ${hasCSSproperty ? 'CSSprop' : ""} ${hasAttr ? 'Attribute:' + hasAttr : ""} ${val == defaultvalue ? 'default:' + defaultvalue : ""}=${val} `
                      // })(), 'color:red')

                      //if (attr == 'clip') window["console"].log(val);

                      return val && val.length == 1 ? val[0] : val;
                    }, // property GETTER
                    //enumerable:1,  // default:false
                    //configurable:1   // default:false
                    //writable:1       // not valid,since there is a set method!
                  });
                });
              }
              svg( // todo create as getter
                newiso = iso,
                svg = flagparser(flags[newiso], this),
                filter = this.filter,
                clip = this.clip
                //, log = console.log(svg, commands)
              ) {
                return (
                  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${this.box
                  }'><defs><clipPath id='clip'>${clip == "0" ? "" : clip
                  }</clipPath></defs>` +
                  (filter || "") +
                  //additional filter can be wrapped in extra <g>
                  //+ `<filter id='f1'><feGaussianBlur stdDeviation='0'></feGaussianBlur></filter>`

                  // extra group so filter is also applied to clip-path itself
                  `<g ${filter ? `filter='url(#ff)'` : ""
                  }><g clip-path='url(#clip)' transform='${this["transform"]
                  }'>${svg}${this.draw}</g></g></svg>`
                );
              }
              connectedCallback() {
                let flag = this;
                //this.iso = iso;
                // log(
                //   `%c created <flag-${iso}>`,
                //   `background:lightgreen;color:black`
                // );
                flag.setAttribute("is", "flag-" + iso); // force is attribute after using createElement

                flag.img = flag; // Customized Built-In
                if (baseClass == HTMLElement) {
                  flag.img =
                    flag.querySelector("img") || // existing img tag in lightDOM
                    flag.appendChild(document.createElement("img"));
                  flag.img.onload = flag.onload;
                  flag.img.onerror = flag.onerror;
                }

                // this.setAttribute('title',iso + ' :' + flag[0]);
                if (
                  !flag.detail && //if no detail specified,
                  flags[iso].includes("detail:") //and flag has detail: specification
                ) {
                  flag.detail = flags[iso].split`detail:`[1].split`;`[0]; // extract default pixels
                }

                flag.load(); // always load/set our FlagMeister svg first
              }
              reset() {
                //this.source=false;
                this.removeAttribute("detail");
                this.connectedCallback();
              }
              load(load_svg = this.svg()) {
                let fetchdata = async (uri) => {
                  try {
                    //async/await is nice sugar, but 11 GZip bytes longer
                    this.detail = uri; // prevent detailed flag from reloading again
                    let options = {};
                    if (location.href.includes("no-cors"))
                      options = { mode: "no-cors" };
                    let response = await fetch(uri, options);
                    let response_data = await (stringIncludesSVGextension(
                      response.url
                    )
                      ? response.text() // SVG file content
                      : response.json()); // JSON from RestCountries API

                    //console.log("Loaded:", iso, uri); //cleanlog

                    if (typeof response_data == "string")
                      load_img(response_data);
                    else {
                      // it is a json response
                      // 2022 RestCountries now returns an Array of countries
                      // if flag does not exist, throws an error
                      if (response_data[0].flags) {
                        this.info = response_data[0]; //store countryinfo
                        fetchdata(response_data[0].flags.svg);
                      } else {
                        console.error("No flag", iso, response_data);
                        //error
                      }
                    }
                  } catch (error) {
                    console.error(error, this);
                    //this.remove();
                  }
                };
                //console.log('load()',iso,load_svg ? 'svg' :'NO svg',load_svg.slice(0,20));
                let _SOURCE;
                let load_img = (svg, flag = this) => {
                  // if (false|| this._SOURCE_IS_SVGFILE) {        // received svg data from a URI,process/wrap in a SVG <g> tag
                  //     if (log) console.warn('processing SVG file');
                  //     //create SVG document from svg string
                  //     let docSVG=(new DOMParser()).parseFromString(svg,'image/svg+xml').children[0];
                  //     if (this.box !== 'match') {
                  //         //add a group element with correct SVG namespace at the end
                  //         let G=docSVG.appendChild(document.createElementNS('http://www.w3.org/2000/svg','g'));
                  //         //fit in width
                  //         let vbw=640 / docSVG.getAttribute('viewBox').split` `[2];
                  //         //fit in height
                  //         //let vbh=480 / docSVG.getAttribute('viewBox').split` `[3];
                  //         //scale the loaded SVG into our FlagMeister viewBox
                  //         G.setAttribute('transform',`scale(${ vbw })`);
                  //         //move all elements inside <g>
                  //         while (docSVG.children[0] !== G) G.appendChild(docSVG.children[0]);
                  //         //apply our FlagMeister default viewBox size
                  //         docSVG.setAttribute('viewBox','0 0 640 480');
                  //     }
                  //     //remove offending width/height settings
                  //     docSVG.removeAttribute('width');
                  //     docSVG.removeAttribute('height');
                  //     //serialize SVG document back to svg string and wrap in our FlagMeister SVG structure
                  //     svg=this.svg((new XMLSerializer()).serializeToString(docSVG.children[0]));
                  // }
                  //flag.img.style.width = "100%";
                  flag.img.src =
                    "data:image/svg+xml," +
                    svg
                      //.replace(/</g, "%3C") //
                      //.replace(/>/g, "%3E") //
                      .replace(/#/g, "%23");
                  //console.log(iso, 'src=', this.src.length, 'bytes ', load_svg ? 'NO' : load_svg.slice(0, 20));
                  //Observe image resize,also called on first load! width is immediatly checked
                  flag.O = new ResizeObserver((entries) => {
                    //if detail defined and no '.svg' in detail and current width is wider then defined flag.detail
                    if (
                      flag.detail &&
                      !stringIncludesSVGextension(flag.detail) &&
                      entries[0].contentRect.width >= flag.detail
                    ) {
                      flag.O.disconnect(flag); //unobserve(this);//!?? difference .disconnect(this)
                      flag.detail = ".svg"; // prevent failed restcountries fetch from running again

                      // save some bytes assign and test in one call
                      // eslint-disable-next-line no-cond-assign
                      if ((_SOURCE = flag.source)) {
                        if (!stringIncludesSVGextension(_SOURCE)) {
                          _SOURCE = _SOURCE + iso + ".svg";
                        }
                        flag.load(_SOURCE);
                      } else {
                        fetchdata(
                          "https://restcountries.com/v3.1/alpha/" + iso
                        );
                      }
                      // } else {
                      //console.log('No Observed Action');
                    }
                  }); // END ResizeObserver
                  if (flag.detail && flag.detail != "9999") {
                    // log(
                    //   "Attach Observer:",
                    //   iso,
                    //   flag.nodeName,
                    //   flag.detail,
                    //   flag.clientWidth,
                    //   flag.source
                    // );
                    flag.O.observe(flag.img); // Observe the IMG, NOT <flag-nl>
                  }
                };
                if (stringIncludesSVGextension(load_svg)) fetchdata(load_svg);
                else load_img(load_svg);
              } //load
            },
            options // customElement define options
          );
        //created Custom Element

        //createFlagElement(HTMLImageElement, { extends: 'img' });
        //todo Create <flag-nl></flag-nl>
        return createFlagElement(HTMLElement, {});
      } //createCustomElement
    ); //map iso flags

    // window.console.log(`FlagMeister created ${flagsmap.length} <flag-[iso]> elements`);
    // window.console.log(`FlagMeister created <flagmeister-text>`);

    customElements.define(
      "flagmeister-text",
      class extends HTMLElement {
        connectedCallback(
          flag = this,
          word = flag.getAttribute("word"),
          isos = flag.getAttribute("iso").split`,`,
          height = flag.getAttribute("height") ||
            "var(--flagmeisterletterheight,99px)"
        ) {
          flag.innerHTML =
            `<style>[word='${word}']{display:flex;justify-content:flex-start}[word='${word}'] img{width:auto;height:${height};filter:var(--flagmeistertextfilter,drop-shadow(1px 1px 0 grey) drop-shadow(-1px -1px 0 #fff) drop-shadow(4px 4px 2px #000))</style>` +
            [...word].map(
              (str, idx) =>
                `<flag-${isos[idx] || isos[0]
                } detail=9999 letter=${str} clip='text:${JSON.stringify({
                  str: str == "_" ? " " : str, // change _ to space
                  y: word.match(/[gjqyQ]/) ? 355 : 420,
                  ...JSON.parse(flag.getAttribute("text")), // user overrules settings
                })}' filter=light box='150 0 340 480'></flag-${isos[idx] || isos[0]
                }>`
            ).join``;
        } // connectedCallback
      }
    ); // define flagmeister-text

    // ====================================================================================================
    // above svg-flag is checked in customElements registry
    customElements.define(
      "svg-flag",
      class extends HTMLElement {
        connectedCallback() {
          let flag = this.appendChild(document.createElement("flag-" + this.getAttribute("is")));
          let img = flag.querySelector("img");
          img.setAttribute("is", this.getAttribute("is"));
          img.classList.add("svg-flag");
          if (this.hasAttribute("detail")) flag.setAttribute("detail", this.getAttribute("detail"));
          if (this.hasAttribute("replaceWith")) this.replaceWith(img);
          else flag.replaceWith(img);
        }
      }
    );
  }
})();
