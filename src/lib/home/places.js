// Where things are in namp's screenshots, every coordinate the front page reads in one table, so a retake that
// moves a part by a few px is an edit here. All in the wide shots' CSS px, 1600 by 1000 (their files are 2x),
// as [x, y, width, height] from the shot's top left.

export const WIDE = { w: 1600, h: 1000 };

// The tour's Machines shot, the Machines place alone beside the rail, its file 2x: as tall as the wide shots
// and as wide as what the tour's frame shows of them (WIDE.w - tour.from) past the rail (from), so it fills the
// same frame.
export const MACHINES = { w: 1352, h: 1000, from: 64 };

// The tour's phone shots, a phone's 402 CSS px wide (their files are 3x), by name: its canvas bar over D3 and D4
// (phone-asks), shot 640 tall, and its canvas bar with Timeline open over Since you were here (phone-timeline), a
// whole phone's 874. A cut naming one (shot) is in its px.
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

// The tour's shot, the same canvas page with Timeline open and the side column at its start: the frame shows it
// from past the sidebar, and the Machines shot from past the rail. The canvas starts past the side column
// (canvas). Each gain's parts (boxes), outlined, the rows in them that arrive one after another (rows), and its
// cut for the narrow layout (cut), of the wide shot or of the phone shot it names. A part on the frame's left edge
// starts 5px in from it, so its outline shows whole inside the frame's border, a part on the canvas 3px in from
// the canvas, so its outline takes the gutter's marks whole, and its rows 4px in from the part, inside its outline.
export const tour = {
  from: 312,
  canvas: 720,
  gains: {
    asks: {
      // The asks' marks in the gutter beside D3 and D4, its number at their corner, and the canvas bar over the
      // canvas, counting the asks and stepping through them.
      boxes: [
        [723, 812, 817, 152],
        [723, 52, 872, 40],
      ],
      rows: [
        [727, 56, 864, 32],
        [727, 816, 809, 64],
        [727, 897, 809, 63],
      ],
      // On a phone: the canvas bar from its top, over D3 and D4 with their marks in the gutter.
      cut: { shot: "phone-asks", x: 0, y: 52, w: 402, h: 400 },
    },
    side: {
      // The side column: its inbox's sections, Needs you then Working, then its strip's Goal and Work.
      boxes: [[317, 56, 398, 314]],
      rows: [
        [385, 104, 321, 152],
        [385, 256, 321, 76],
        [321, 120, 54, 120],
      ],
      cut: { x: 312, y: 52, w: 408, h: 320 },
    },
    timeline: {
      // Timeline, today's work by who did it, and Since you were here under it, from the canvas's left edge as
      // Timeline's band runs; its number at the bottom left corner, in the gutter clear of the words, as the top
      // left one would sit on the canvas bar.
      boxes: [[723, 96, 872, 328]],
      corner: "bottom",
      rows: [
        [780, 102, 800, 262],
        [780, 392, 760, 28],
      ],
      // On a phone: the canvas bar, Timeline open under it, and Since you were here.
      cut: { shot: "phone-timeline", x: 0, y: 52, w: 402, h: 506 },
    },
    machines: {
      // Machines: each machine's row with its runtime, herdr or hc, in the Machines shot's px.
      shot: "machines",
      boxes: [[83, 232, 1246, 618]],
      rows: [
        [87, 236, 1238, 184],
        [87, 424, 1238, 207],
        [87, 635, 1238, 211],
      ],
      // On a phone: Machines from its title, through each machine's row.
      cut: { shot: "machines", x: 64, y: 80, w: 1288, h: 780 },
    },
  },
};
