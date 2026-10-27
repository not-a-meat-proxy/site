// Where things are in namp's screenshots, every coordinate the front page reads in one table, so a retake that
// moves a part by a few px is an edit here. All in the wide shots' CSS px, 1600 by 1000 (their files are 2x),
// as [x, y, width, height] from the shot's top left.

export const WIDE = { w: 1600, h: 1000 };

// The tour's phone shots, a phone's 402 CSS px wide (their files are 3x), by name: its canvas bar over D3 and D4
// (phone-asks), shot 640 tall, and its lane, canvas bar and Timeline open (phone-timeline), a whole phone's 874.
// A cut naming one (shot) is in its px.
export const PHONE = {
  "phone-asks": { w: 402, h: 640 },
  "phone-timeline": { w: 402, h: 874 },
};

// The hero's shot, a topic's canvas page with namp's drawer open at its right on the D3 question: where the
// page starts past the sidebar, the drawer's left edge, its border included, and how much of the shot's height
// the hero shows at least.
export const hero = {
  from: 312,
  drawer: 928,
  shown: 780,
};

// The tour's shot, the same canvas page with Timeline open and the lane at its right: the frame shows it from
// past the sidebar. Each gain's parts (boxes), outlined, the rows in them that arrive one after another (rows),
// and its cut for the narrow layout (cut), of the wide shot or of the phone shot it names. A part on the page's
// left edge starts 5px in from it, so its outline shows whole inside the frame's border, and its rows 4px in
// from the part, inside its outline.
export const tour = {
  from: 312,
  gains: {
    asks: {
      // The asks' marks in the gutter beside D3 and D4, its number at their corner, and the canvas bar over the
      // page, counting the asks and stepping through them.
      boxes: [
        [317, 828, 895, 146],
        [317, 52, 952, 40],
      ],
      rows: [
        [321, 56, 944, 32],
        [321, 832, 887, 68],
        [321, 902, 887, 68],
      ],
      // On a phone: the canvas bar from its top, over D3 and D4 with their marks in the gutter.
      cut: { shot: "phone-asks", x: 0, y: 52, w: 402, h: 267 },
    },
    lane: {
      // The lane's Goal and Work cards.
      boxes: [[1284, 246, 300, 254]],
      rows: [
        [1288, 250, 292, 68],
        [1288, 328, 292, 168],
      ],
      cut: { x: 1276, y: 240, w: 316, h: 266 },
    },
    timeline: {
      // Timeline, today's work by who did it, and Since you were here under it, from the page's left edge as
      // Timeline's band runs; its number at the bottom left corner, in the gutter clear of the words, as the top
      // left one would sit on the canvas bar.
      boxes: [[317, 98, 943, 340]],
      corner: "bottom",
      rows: [
        [366, 102, 884, 278],
        [366, 404, 336, 30],
      ],
      // On a phone: the canvas bar, Timeline open under it, and Since you were here.
      cut: { shot: "phone-timeline", x: 0, y: 201, w: 402, h: 465 },
    },
    page: {
      boxes: [[312, 0, 1288, 1000]],
      rows: [],
      cut: { x: 312, y: 0, w: 1288, h: 1000 },
    },
  },
};
