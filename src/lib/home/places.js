// Where things are in namp's screenshots, every coordinate the front page reads in one table, so a retake that
// moves a part by a few px is an edit here. All in the wide shots' CSS px, 1600 by 1000 (their files are 2x),
// as [x, y, width, height] from the shot's top left.

export const WIDE = { w: 1600, h: 1000 };

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
// and its cut of the shot for the narrow layout (cut).
export const tour = {
  from: 312,
  gains: {
    asks: {
      // The asks' marks in the gutter beside D3 and D4, its number at their corner, and the canvas bar over the
      // page, counting the asks and stepping through them.
      boxes: [
        [312, 828, 900, 146],
        [312, 52, 957, 40],
      ],
      rows: [
        [314, 54, 953, 36],
        [314, 830, 896, 70],
        [314, 902, 896, 70],
      ],
      cut: { x: 312, y: 826, w: 600, h: 150 },
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
      // Timeline, today's work by who did it, and Since you were here under it; its number at the bottom left
      // corner, as the top left one would sit on the canvas bar's outline.
      boxes: [[362, 98, 898, 340]],
      corner: "bottom",
      rows: [
        [366, 102, 884, 278],
        [366, 404, 336, 30],
      ],
      cut: { x: 352, y: 92, w: 918, h: 352 },
    },
    page: {
      boxes: [[312, 0, 1288, 1000]],
      rows: [],
      cut: { x: 312, y: 0, w: 1288, h: 1000 },
    },
  },
};
